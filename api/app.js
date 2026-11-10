import { put, list, get, del } from '@vercel/blob';
import crypto from 'node:crypto';

const P = 'db/state-';
const NL = String.fromCharCode(10);

const hp = function(p) {
  return crypto.createHash('sha256').update('tm-salt:' + p).digest('hex');
};

const USERS = {
  rahul: { n: 'Rahul Sharma', role: 'Departing Owner', h: hp('demo123'), email: 'rahul.sharma@turbominds.io' },
  maya: { n: 'Maya Desai', role: 'Approver', h: hp('demo123'), email: 'maya.desai@turbominds.io' },
  akash: { n: 'Akash Patil', role: 'Successor', h: hp('demo123'), email: 'akash.patil@turbominds.io' }
};

const blank = function() {
  return {
    rev: 0,
    project: null,
    sources: [],
    records: [],
    ho: { gen: false, ok: false, acc: false, snap: null, genAt: null },
    audit: [],
    sessions: {},
    n: 0
  };
};

function fail(c, m) {
  const e = new Error(m);
  e.code = c;
  throw e;
}

const byName = function(a, c) {
  return a.pathname < c.pathname ? 1 : -1;
};

async function loadDb() {
  const l = await list({ prefix: P });
  const b = l.blobs.slice().sort(byName);
  if (!b.length) return blank();
  const r = await get(b[0].pathname, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) fail(500, 'Database read failed');
  return JSON.parse(await new Response(r.stream).text());
}

async function saveDb(db) {
  db.rev = (db.rev || 0) + 1;
  const nm = P + String(Date.now()).padStart(13, '0') + '-' + String(db.rev).padStart(6, '0') + '.json';
  await put(nm, JSON.stringify(db), { access: 'private', addRandomSuffix: false, contentType: 'application/json' });
  try {
    const l = await list({ prefix: P });
    const b = l.blobs.slice().sort(byName);
    const o = b.slice(6).map(function(x) { return x.pathname; });
    if (o.length) await del(o);
  } catch (e) {}
}

const TY = {
  STATUS: 'status',
  DECISION: 'decision',
  TODO: 'task',
  RISK: 'risk',
  FACT: 'fact',
  CONTACT: 'contact',
  PROCESS: 'process'
};

const norm = function(t) {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(Boolean).join(' ');
};

const neg = function(t) {
  return (' ' + norm(t) + ' ').indexOf(' not ') > -1;
};

const key = function(t) {
  return norm(t).split(' ').filter(function(w) { return w !== 'not'; }).join(' ');
};

const has = function(p, l) {
  return l.some(function(w) { return p.indexOf(' ' + w + ' ') > -1; });
};

const inj = function(l) {
  const p = ' ' + norm(l) + ' ';
  return (
    p.indexOf(' ignore previous ') > -1 ||
    p.indexOf(' ignore all previous ') > -1 ||
    p.indexOf(' everything approved ') > -1 ||
    p.indexOf(' ignore all instructions ') > -1
  );
};

function classify(l) {
  const i = l.indexOf(':');
  if (i > 0 && i < 10) {
    const k = l.slice(0, i).trim().toUpperCase();
    if (TY[k]) return [TY[k], l.slice(i + 1).trim()];
  }
  const p = ' ' + norm(l) + ' ';
  if (has(p, ['todo', 'pending', 'action item', 'need to'])) return ['task', l];
  if (has(p, ['decided', 'agreed'])) return ['decision', l];
  if (has(p, ['risk', 'blocker', 'expires'])) return ['risk', l];
  return l.length > 25 ? ['fact', l] : null;
}

function lg(db, uid, m) {
  const uObj = uid ? USERS[uid] : null;
  db.audit.unshift({
    t: new Date().toISOString(),
    u: uObj ? uObj.n : 'System',
    role: uObj ? uObj.role : 'System',
    m: m
  });
  db.audit = db.audit.slice(0, 300);
}

function view(db, uid) {
  const u = USERS[uid];
  return {
    rev: db.rev,
    user: { id: uid, n: u.n, role: u.role, email: u.email },
    project: db.project,
    sources: db.sources.map(function(s) {
      return {
        id: s.id,
        name: s.name,
        done: s.done,
        skipped: s.skipped || 0,
        chars: s.text.length,
        lines: s.text.split(NL).length,
        preview: s.text.slice(0, 2500)
      };
    }),
    records: db.records,
    ho: db.ho,
    audit: db.audit.slice(0, 100)
  };
}

const apd = function(db) {
  return db.records.filter(function(r) { return r.st === 'approved'; });
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    let b = req.method === 'POST' ? (req.body || {}) : {};
    if (typeof b === 'string') b = JSON.parse(b);
    const a = req.method === 'POST' ? b.action : 'state';
    const tok = String(req.headers.authorization || '').replace('Bearer ', '');
    let db = await loadDb();

    if (a === 'reset') {
      db = blank();
      lg(db, null, 'Demo workspace reset to initial state');
      await saveDb(db);
      return res.status(200).json({ ok: true });
    }

    if (a === 'login') {
      const lu = String(b.user || '').toLowerCase();
      const us = USERS[lu];
      if (!us || us.h !== hp(String(b.password || ''))) fail(401, 'Invalid account identifier or password');
      const t = crypto.randomBytes(24).toString('hex');
      const now = Date.now();
      Object.keys(db.sessions).forEach(function(k) {
        if (db.sessions[k].exp < now) delete db.sessions[k];
      });
      db.sessions[t] = { u: lu, exp: now + 43200000 };
      lg(db, lu, 'User signed into workspace');
      await saveDb(db);
      return res.status(200).json({ token: t, state: view(db, lu) });
    }

    const ss = db.sessions[tok];
    if (!ss || ss.exp < Date.now()) fail(401, 'Session expired. Please sign in again.');
    const u = ss.u;

    if (a === 'state') {
      return res.status(200).json({ state: view(db, u) });
    }

    if (a === 'logout') {
      delete db.sessions[tok];
      lg(db, u, 'User signed out');
      await saveDb(db);
      return res.status(200).json({ ok: true });
    }

    const need = function(r) {
      if (u !== r) fail(403, 'Action restricted: Only ' + USERS[r].n + ' (' + USERS[r].role + ') can perform this action');
    };

    const locked = function() {
      if (db.ho.gen) fail(409, 'Handover report is already locked. Knowledge records and sources cannot be modified.');
    };

    let msg = '';
    const findRec = function(id) {
      const r = db.records.find(function(x) { return x.id === Number(id); });
      if (!r) fail(404, 'Knowledge record not found');
      return r;
    };

    const pendCf = function() {
      return db.records.some(function(r) { return r.cf && r.st === 'pending'; });
    };

    if (a === 'create') {
      need('rahul');
      if (db.project) fail(409, 'A project is already active for this handover.');
      const pn = String(b.name || '').trim().slice(0, 100);
      if (!pn) fail(400, 'Please provide a valid project name');
      db.project = {
        name: pn,
        desc: String(b.desc || '').trim().slice(0, 400),
        status: String(b.status || 'On track').trim().slice(0, 200),
        timeline: String(b.timeline || 'On track, launch in 3 weeks').trim().slice(0, 200),
        createdAt: new Date().toISOString()
      };
      lg(db, u, 'Created project "' + pn + '"');
      msg = 'Project successfully created';
    } else if (a === 'updateProject') {
      need('rahul');
      locked();
      if (!db.project) fail(400, 'No active project found');
      const pn = String(b.name || '').trim().slice(0, 100);
      if (pn) db.project.name = pn;
      if (b.desc !== undefined) db.project.desc = String(b.desc || '').trim().slice(0, 400);
      if (b.status !== undefined) db.project.status = String(b.status || '').trim().slice(0, 200);
      if (b.timeline !== undefined) db.project.timeline = String(b.timeline || '').trim().slice(0, 200);
      lg(db, u, 'Updated details for project "' + db.project.name + '"');
      msg = 'Project details updated';
    } else if (a === 'addSource') {
      need('rahul');
      locked();
      if (!db.project) fail(400, 'Please create the project before connecting sources');
      const nm = String(b.name || '').trim().slice(0, 80) || 'knowledge-notes.txt';
      const tx = String(b.text || '');
      if (!tx.trim()) fail(400, 'Source document content cannot be empty');
      if (tx.length > 100000) fail(413, 'Document exceeds maximum size of 100,000 characters');
      if (db.sources.length >= 30) fail(409, 'Maximum limit of 30 connected sources reached');
      db.sources.push({
        id: ++db.n,
        name: nm,
        text: tx,
        done: false,
        skipped: 0
      });
      lg(db, u, 'Connected source document "' + nm + '"');
      msg = 'Source document added: ' + nm;
    } else if (a === 'deleteSource') {
      need('rahul');
      locked();
      const sid = Number(b.id);
      const srcItem = db.sources.find(function(s) { return s.id === sid; });
      if (srcItem) {
        db.sources = db.sources.filter(function(s) { return s.id !== sid; });
        db.records = db.records.filter(function(r) { return r.src !== srcItem.name || r.st === 'approved'; });
        lg(db, u, 'Removed source document "' + srcItem.name + '"');
        msg = 'Source document removed';
      }
    } else if (a === 'extract') {
      need('rahul');
      locked();
      let n = 0, sk = 0, ig = 0;
      db.sources.forEach(function(s) {
        if (s.done) return;
        s.text.split(NL).forEach(function(raw) {
          const l = raw.trim();
          if (!l) return;
          if (inj(l)) {
            s.skipped = (s.skipped || 0) + 1;
            sk++;
            return;
          }
          const c = classify(l);
          if (!c) {
            ig++;
            return;
          }
          db.records.push({
            id: ++db.n,
            type: c[0],
            text: c[1].slice(0, 500),
            src: s.name,
            ev: l.slice(0, 500),
            st: 'pending',
            ts: 'Open',
            createdAt: new Date().toISOString()
          });
          n++;
        });
        s.done = true;
      });

      const g = {};
      db.records.forEach(function(r) {
        if (r.st !== 'pending' || (r.type !== 'fact' && r.type !== 'status')) return;
        const k = key(r.text);
        (g[k] = g[k] || []).push(r);
      });
      Object.keys(g).forEach(function(k) {
        const x = g[k];
        if (x.length > 1 && x.some(function(r) { return neg(r.text); }) && x.some(function(r) { return !neg(r.text); })) {
          x.forEach(function(r) { r.cf = k; });
        }
      });
      lg(db, u, 'Extraction completed: ' + n + ' records extracted, ' + sk + ' suspicious line(s) skipped' + (ig ? ', ' + ig + ' unclassified' : ''));
      msg = n + ' records extracted successfully' + (sk ? ' (' + sk + ' prompt injection lines blocked)' : '');
    } else if (a === 'decide') {
      need('rahul');
      locked();
      const r1 = findRec(b.id);
      if (r1.st !== 'pending') fail(409, 'This record has already been reviewed');
      if (r1.cf) fail(409, 'Please resolve conflicting source statements before deciding');
      r1.st = b.ok ? 'approved' : 'rejected';
      lg(db, u, (b.ok ? 'Approved record: ' : 'Rejected record: ') + r1.text);
      msg = b.ok ? 'Record approved' : 'Record rejected';
    } else if (a === 'approveAll') {
      need('rahul');
      locked();
      let c2 = 0, left = 0;
      db.records.forEach(function(r) {
        if (r.st !== 'pending' || r.cf) return;
        const s = db.sources.find(function(y) { return y.name === r.src; });
        if (r.ev && s && s.text.indexOf(r.ev) > -1) {
          r.st = 'approved';
          c2++;
        } else {
          left++;
        }
      });
      lg(db, u, 'Auto-verified and approved ' + c2 + ' records (' + left + ' remaining for manual review)');
      msg = c2 + ' verified records approved' + (left ? ', ' + left + ' flagged for manual review' : '');
    } else if (a === 'resolve') {
      need('rahul');
      locked();
      const ch = findRec(b.id);
      const why = String(b.reason || '').trim().slice(0, 300);
      if (!ch.cf || ch.st !== 'pending') fail(409, 'No open conflict identified for this record');
      if (why.length < 3) fail(400, 'Please enter a clear explanation for resolving this conflict');
      const ck = ch.cf;
      db.records.forEach(function(r) {
        if (r.cf === ck) {
          r.st = r.id === ch.id ? 'approved' : 'rejected';
          r.note = 'Conflict resolved by Rahul Sharma: ' + why;
          r.cf = null;
        }
      });
      lg(db, u, 'Resolved conflict in favor of "' + ch.text + '" (Reason: ' + why + ')');
      msg = 'Conflict resolved successfully';
    } else if (a === 'generate') {
      need('rahul');
      locked();
      if (!db.project) fail(400, 'Create the project first');
      if (pendCf()) fail(409, 'Please resolve all open conflicts before generating the handover report');
      const ar = apd(db);
      if (!ar.length) fail(409, 'At least one record must be verified and approved before generating the report');
      db.ho.snap = ar.map(function(r) {
        return {
          id: r.id,
          type: r.type,
          text: r.text,
          src: r.src,
          ev: r.ev,
          ts: r.ts || 'Open',
          note: r.note || null
        };
      });
      db.ho.genAt = new Date().toISOString();
      db.ho.gen = true;
      lg(db, u, 'Generated handover report snapshot with ' + ar.length + ' approved records');
      msg = 'Handover report generated and locked for review';
    } else if (a === 'mgrApprove') {
      need('maya');
      if (!db.ho.gen) fail(409, 'The handover report has not been generated by the departing owner yet');
      if (db.ho.ok) fail(409, 'Handover report has already been approved');
      db.ho.ok = true;
      db.ho.approvedAt = new Date().toISOString();
      lg(db, u, 'Approved the handover report and transition plan');
      msg = 'Handover report successfully approved by Maya Desai';
    } else if (a === 'accept') {
      need('akash');
      if (!db.ho.ok) fail(409, 'Maya Desai (Approver) must approve the handover report before acceptance');
      if (db.ho.acc) fail(409, 'Ownership has already been accepted');
      db.ho.acc = true;
      db.ho.acceptedAt = new Date().toISOString();
      lg(db, u, 'Accepted full project ownership and operational responsibilities');
      msg = 'Congratulations! You are now the official owner of this project';
    } else if (a === 'setTask') {
      need('akash');
      if (!db.ho.acc) fail(409, 'Please accept project ownership before updating operational tasks');
      const st = String(b.status || '');
      if (['Open', 'In progress', 'Blocked', 'Done'].indexOf(st) < 0) fail(400, 'Invalid task status');
      const tr = findRec(b.id);
      if (tr.type !== 'task' || !db.ho.snap.some(function(x) { return x.id === tr.id; })) {
        fail(400, 'Specified item is not an approved task in the handover report');
      }
      tr.ts = st;
      // also update in snap if present
      const snapTask = db.ho.snap.find(function(x) { return x.id === tr.id; });
      if (snapTask) snapTask.ts = st;
      lg(db, u, 'Updated task status to ' + st + ': "' + tr.text + '"');
      msg = 'Task status updated to ' + st;
    } else {
      fail(400, 'Unknown API action: ' + a);
    }

    await saveDb(db);
    return res.status(200).json({ state: view(db, u), msg: msg });
  } catch (e) {
    const cd = Number.isInteger(e.code) ? e.code : 500;
    return res.status(cd).json({ error: cd === 500 ? 'Server error: ' + e.message : e.message });
  }
}

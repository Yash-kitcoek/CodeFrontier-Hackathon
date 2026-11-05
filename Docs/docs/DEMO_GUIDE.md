# Demo Guide

> **All records below are synthetic demo data.** Steps assume the features exist; skip or narrate any that are not implemented, and say so honestly.

## Scenario
Rahul (outgoing backend developer) hands over to Akash. Synthetic facts: Login API completed · Payment integration in progress · Password reset pending · PostgreSQL selected · Payment webhook requires testing.

## Synthetic Files
`tech_doc.md`: "Payment integration completed. Database: PostgreSQL chosen over MySQL for relational reporting."
`tasks.csv`: `Login API,Done` · `Payment integration,In progress` · `Password reset,Pending` · `Payment webhook testing,Pending`
`meeting_notes.md`: "Webhook needs testing before launch. Finance contact: <synthetic name>." and a line marked `[CONFIDENTIAL] Synthetic salary figure` to show redaction.

## Steps
| # | Action | What judges should see |
|---|---|---|
| 1 | Log in as Rahul; create project "Demo Club App" | Project created |
| 2 | Upload the three synthetic files | Sources listed |
| 3 | Click Analyse | Job completes |
| 4 | Open extracted items | Decisions (PostgreSQL), tasks, owners, blockers, each with an evidence status |
| 5 | Upload a second task export where payment is "Done" | Conflicting information introduced |
| 6 | Open Contradiction Ledger | Both claims, sources, timestamps, status "Unresolved", with a conflict warning |
| 7 | Correct an item and resolve the conflict with a note | Version history updated |
| 8 | Check readiness breakdown, then Approve | Handover version frozen |
| 9 | Log out; log in as Akash | Different account |
| 10 | Open handover | Backend view: tasks, APIs, decisions with sources; confidential salary line absent |
| 11 | Acknowledge receipt; mark one item "incorrect" | Acknowledgement and feedback logged |

## Proof of Permission-Awareness
Call the API directly as Akash for the confidential record and show a 403/404, proving the filter is server-side.

## Honest Limitations to State
Missing evidence is shown as "Insufficient evidence"; the system does not claim complete automation.

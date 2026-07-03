# What I Would Do Next

If I had two additional weeks, this is the order I would build in, grouped by how
much each item would move the experience forward. Authentication, roles, and the
first version of the HR Panel already exist, so this list starts from there.

## Priority 1 - Features that would fundamentally improve the experience

- **Harden the session layer.** The login and role model work, but HR access
  currently trusts a value the client sends. The first thing I would do is issue a
  signed session token at login and verify it on the server, so an HR-only action
  cannot be triggered by a hand-crafted request. Everything else that touches
  permissions sits on top of this, which is why it comes first.
- **Full employee management in the HR Panel.** HR can add employees today but not
  edit or deactivate them. Real onboarding data changes constantly: people move
  teams, change roles, or leave. Letting HR update and archive records is what
  turns the panel from a demo into a real app.


## Priority 2 - Features that would add significant value

- **Per-department and per-role checklists.** An engineer's first week is not a
  salesperson's. Tailoring the checklist by department would make it genuinely
  useful rather than generic, and it builds naturally on the two-table checklist
  structure that is already in place.
- **A focused "meet your team" view.** The dashboard already shows a slice of the
  hire's department. I would grow that into a proper view scoped to their team,
  with their manager highlighted, which is far more actionable than the full
  directory when you are brand new.
- **Search in the directory.** Alongside the existing department filter, a name
  search matters for finding one specific person quickly in a 200-person company.

## Priority 3 - Nice-to-have improvements

- **Reminders** that nudge the new hire through unfinished checklist items, so
  progress does not stall in the second week when the initial momentum fades.
- **Profile pages** with a photo, a short bio, and contact details, which make the
  directory feel like people rather than rows.
- **A mobile-responsive pass.** A new hire might check the schedule from their
  phone before deciding whether to go in, and the UI is currently desktop first.
- **Theming and dark mode**, a small quality-of-life touch once the substance is
  there.
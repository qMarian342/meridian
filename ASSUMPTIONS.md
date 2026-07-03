# Assumptions

This document records the assumptions I made while building **Meridian App** and
the reasoning behind each one.

## About the users

**Who uses the application?**

- **The new hire** - the primary user, in their first month. They open the app
  on day one not knowing anyone or how things work. Almost every screen is
  designed around this person.
- **HR** is the second user. In this scenario HR is a single person who owns all
  the source data: employee records, departments, weekly schedules, and the
  shared checklist. HR has a dedicated panel for that work.
- **Existing colleagues** - a secondary audience who might look at the
  directory or the schedule, but the app is designed around the new-hire journey.

**What does the user already know when they open it for the first time?**

Almost nothing about the company's internal structure. The app assumes zero prior
knowledge: the new hire knows their own name and role (HR told them), but not who
their teammates are, who is in the office today, or what they should do first.
That is why the dashboard leads with a checklist and a team directory
rather than assuming any familiarity.

I originally scoped the MVP as a single hardcoded user with no login. Partway
through I changed direction and added authentication, because the distinction
between a regular employee and HR turned out to be the foundation that the HR
workflow depends on. The app now has two roles: a regular employee, who sees the
onboarding pages and can only edit their own checklist progress, and HR, who can
also open the HR Panel. I documented this change of direction because it reflects
how my thinking evolved.

## About the data

**Who enters the information?**

HR enters all the source data through the HR Panel or directly in the database:
employee records, departments, weekly schedules, and the shared checklist tasks.
The new hire only ever writes their own checklist progress by ticking tasks off.
This split is deliberate. It keeps a single owner for company-wide data and gives
the new hire exactly one thing to manage, which is their own progress.

**When is the information added?**

Information can be added at any time, not only before someone's first day. The app
always reads the current state of the database while it runs, so any record added
to the system appears as soon as the relevant page loads or is refreshed. When HR
creates an employee, changes a task, or updates a schedule in the panel, the
change is saved immediately and shows up on the next read. Checklist progress
works the same way: the new hire updates it continuously through their first
weeks, and each change is saved and reflected right away.

**What happens if information is missing or incorrect?**

I designed the app to degrade rather than crash:

I designed the app to degrade rather than crash:

- A new employee with no schedule rows simply does not appear in "who's in today"
  and sees a friendly empty state on their week grid.
- Checklist tasks with no progress row default to not completed, handled by a left
  join, so a brand new hire automatically sees the full list, unchecked.
- On employee creation, a duplicate email is rejected with a clear 400 and a
  readable message, and an unknown department returns a 404, instead of leaking a
  raw database error.
- A malformed email is rejected automatically by validation, which returns a 422.

I assumed a trusted user for data entry, so there is no approval workflow. Data
that HR enters is treated as correct.

## About the context

**What device does the new employee use on the first day?**

I assumed a laptop or desktop, company or personal, because the day-one tasks
themselves (setting up Slack, activating email, configuring a dev environment)
happen on a computer. The UI is therefore built desktop first.

**Do they have access to the application before their first working day?**

I assumed not. A new hire may not have working credentials until day one, so the
app never depends on pre-arrival access. HR seeds the record ahead of time, and
the hire logs in on their first day to a dashboard that is already populated with
their checklist, their team, and the schedule.

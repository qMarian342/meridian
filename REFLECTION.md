# Reflection

## What turned out to be harder than I expected

Some of the trickiest moments were not big architectural problems but subtle
framework behaviours that surfaced as runtime errors. A dictionary I accidentally
called like a function, and an ORM query that needed to be chained to reach a
nested relationship, both looked fine at a glance and only failed at request time.
Working through them taught me to slow down and read a traceback properly instead
of guessing.

The other thing that caught me out was reproducibility. The app ran perfectly on
my machine, but it would have crashed on a fresh clone: a dependency my code
relied on was not listed, and nothing created the database tables. Fixing that
made me think about the project from the point of view of someone cloning it for
the first time, not just my own setup.

## A decision I would make differently if I started over

I would design the identity layer first. I began with a single hardcoded user and
added authentication later, once the HR features made the difference between a
regular employee and HR. Bringing auth in was the right call, but
doing it late meant the notion of "the current user" lived in more than one place
before it had a single home. If I restarted, I would set up the current user, the
seed script, and the dependency list from the very beginning, because so much of
the app ends up depending on all three.

## What I learned about myself as a developer

This project showed me that I'm a perfectionist, I find it genuinely
hard to leave an inconsistency alone. I couldn't move on until each one was
correct, even though they were small details. I also learned that I clearly prefer
working in an organised way: breaking the task into small pieces and committing
each one separately, one feature at a time, instead of building everything at once.
That rhythm kept the whole project clear in my head and made it easy to see what
was done and what was left.
Deciding mid-project to change
direction on authentication, rather than sticking to my original plan just because
I had written it down, is the moment I am most glad.

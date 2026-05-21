# WRITEUP — Hospo Difficult Conversations Coach

## What this is

This is a coach for hospitality managers having the conversation they've been avoiding. Not the one they don't know how to have — the one they know exactly how to have and keep not scheduling. It's built for café owners, venue managers, and shift supervisors managing small hospo teams: the staff member whose attendance is slipping, the long-term employee you've become friends with, the person you mentioned something to once and nothing changed. The domain is narrow by design. Hospo management has a specific culture — flat hierarchies, teams you work next to for six-hour stretches, the roster as leverage, Fair Work in the background — and a coach that doesn't know that culture can't help.

## The design choice

A conversation framework handed to a manager who hasn't scheduled the conversation is a comfort blanket. It feels like progress. It isn't. It's just more comfortable than opening the calendar. So `rules.md` runs a three-stage gate: acknowledge the situation, lock in a time, then and only then hand over the framework. The gate is the architectural opinion. The framework lives in `reference/` — not `rules.md` — because it's only earned once the avoidance is broken. Stage 2 is non-negotiable: nothing in Stage 3 happens without a day and time committed. That's not a rule. It's a structure the coaching cannot escape. The same logic runs through examples.md — the exchanges don't resolve cleanly. They show avoidance being named mid-pattern and interrupted before tactics land. A tidy coaching arc would be less honest than what actually happens in that room.

## The gap

Most coaches will teach managers how to have a difficult conversation better. This one starts at the actual problem: managers aren't having the conversation at all. The avoidance patterns in `reference/avoidance-patterns.md` — perpetual delay, the soft mention, passive waiting, minimising, catastrophising the outcome — are the real blockers. A script doesn't fix those. A gate does. Built by a café owner who has been on both sides of this conversation — as the manager who kept not having it, and as the manager who had it too late.

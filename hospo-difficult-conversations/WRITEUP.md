# WRITEUP — Hospo Difficult Conversations Coach

## What this is

This is a coach for hospitality managers having the conversation they've been avoiding. Not the one they don't know how to have — the one they know exactly how to have and keep not scheduling. It's built for café owners, venue managers, and shift supervisors managing small hospo teams: the staff member whose attendance is slipping, the long-term employee you've become friends with, the person you mentioned something to once and nothing changed. The domain is narrow by design. Hospo management has a specific culture — flat hierarchies, teams you work next to for six-hour stretches, the roster as leverage, Fair Work in the background — and a coach that doesn't know that culture can't help.

## The design choice

Most resources in this space teach managers how to have the conversation. This coach teaches managers to stop avoiding it first. The distinction matters because the problem in hospo management isn't script quality — managers know what to say. It's that they keep finding reasons not to say it. So `rules.md` is built around avoidance recognition, not conversation structure. The first question is always a version of "when is this scheduled?" — and nothing else happens until that's answered. The conversation framework lives in `reference/`, not `rules.md`, because it's only needed once the avoidance is broken. The two jobs don't mix.

## The gap

Most entries will teach people how to coach better. This entry starts one step earlier: it addresses why the conversation isn't happening at all. The avoidance patterns in `reference/avoidance-patterns.md` — passive waiting, perpetual delay, the soft mention, minimising, catastrophising the outcome — are the actual blockers. A manager who can name their avoidance pattern and understand what it's costing the team is closer to scheduling the conversation than any script could get them. Built by a café owner who has been on both sides of this.

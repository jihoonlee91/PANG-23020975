# Phase 1-3. Start Button

> This is a draft. Details will be finalized after discussion.

## Goal

- Transition to the gameplay screen when the start button is clicked

## Design

- Since there's currently only one mission, the main screen's "Start" button also serves as the start button, and clicking it enters Mission 1 play directly
- Once there are multiple missions, revisit this by exposing a separate "Start" button for the selected mission
- Clicking "Start" (or "Retry" on the end screen) doesn't jump straight into gameplay — it shows a 3-2-1 countdown screen first, giving the player a moment to get ready. The countdown screen also repeats the basic controls (same summary as the main screen) so it's the last thing seen before play starts

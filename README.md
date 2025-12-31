# Infinite Pomodoro Timer 🍅⏱️

A clean, focused Pomodoro timer built with **Next.js + TypeScript** to help users work or study in repeatable focus cycles with minimal distraction.

**Live Demo:** https://promorodo-timer.vercel.app  
**Repository:** https://github.com/DaluAlozie/promorodo-timer

---

## Features

- 25-minute focus timer
- Start and reset controls
- Pomodoro cycle counter
- Reset cycle count for new work sessions
- Minimal, distraction-free UI

---

## Motivation

This project was built to explore clean state management and reusable timer logic in a modern Next.js application.

Rather than overloading features, the focus is on:
- Clarity
- Maintainability
- Real-world usability

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Zustand** for state management
- Custom React hooks for timer logic
- Component-based architecture

---

## Project Structure

```txt
promorodo-timer/
├─ app/               # Next.js routes (App Router)
├─ components/        # UI components
├─ customHooks/       # Reusable timer logic
├─ stores/            # Zustand state stores
├─ public/            # Static assets

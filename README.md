# Closira — Customer Communication Platform for SMBs

Hey there! Welcome to the codebase for Closira. I built this platform because small and medium business owners are drowning in messages across WhatsApp, email, and phone calls. It's impossible to keep up. Closira is designed to centralize those messages, automatically run them against Standard Operating Procedures (SOPs), and escalate the complex issues to human agents.

This repository holds everything you need to get the app running, split cleanly into a Python backend and a React Native frontend.

## Video Submission Link
https://drive.google.com/file/d/1_FAbv7SgN92-ibFQRbfJZblvz6E3frDc/view?usp=sharing

## Why I Chose This Stack

When putting this together, I had to make a few opinionated choices to keep things moving fast but maintain a high level of quality.

For the backend, I went with FastAPI because it's incredibly fast and the automatic OpenAPI documentation is a lifesaver. I picked SQLite for the database because I honestly didn't want to deal with the overhead of setting up and managing a local Postgres instance just for a prototype. It keeps the barrier to entry low—you just run the app and the database file creates itself.

On the frontend side, I used Expo and React Native. The UI design is highly intentional. Instead of falling into the trap of "AI-generated" aesthetics (like floating cards with excessive drop shadows and purple gradients), I committed to a strict "Technical/Developer" look, similar to tools like Linear. I deliberately avoided loading custom web fonts, sticking strictly to native system fonts with a crisp, high-contrast monochrome palette. The layout relies entirely on tight spacing and 1px borders rather than shadows, giving it a raw, utilitarian feel that means business.

## Getting It Running

Running the backend is pretty straightforward. You just need to navigate into the `/backend` folder, create a virtual environment, and install the requirements. Once you run `uvicorn main:app --reload`, the server spins up at `http://localhost:8000`. You can even check out the interactive API docs at the `/docs` endpoint.

For the frontend, head into the `/frontend` directory and run an `npm install`. Starting it up with `npx expo start` will give you a QR code you can scan with the Expo Go app on your phone, or you can just run it in a local simulator. Right now, the app is loaded with dynamic mock data so you can click around and experience the UI without even needing the backend running.

## How It Works Under the Hood

When a new enquiry hits the system, the backend doesn't just store it; it actively evaluates it. It checks the message against a set of keyword-based SOPs. If a customer is asking about prices, it flags it as a "Pricing Question." If they are unhappy, it catches the complaint. If someone messages outside of standard business hours (between 8 PM and 8 AM) and it doesn't match an SOP, it hits an After-Hours Fallback. Anything else gets automatically escalated to a human agent.

## Honest Limitations

As much as I love how this is coming together, there are a couple of honest limitations to keep in mind:

First, the SQLite database is fantastic for getting off the ground, but it isn't built for heavy concurrent write loads. If Closira scales to support thousands of active businesses simultaneously, we will absolutely need to migrate to Postgres. 

Second, while both the frontend and backend are fully functional on their own, they aren't fully wired up to each other just yet. The frontend relies heavily on a robust mock data context to demonstrate the complex UI states (like overdue follow-ups and resolved escalations) without requiring you to manually seed a database first. Tying the React Native app directly to the FastAPI endpoints is the logical next step.

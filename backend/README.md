# Closira Backend

Hey, this is my backend implementation for the Closira internship assignment. Basically, it's a FastAPI app that takes incoming customer messages from whatsapp/email/calls, runs them against some standard operating procedures (SOPs) to figure out what they want, and auto-escalates anything it doesn't understand to a human.

## How to run it

It's pretty simple to get running locally.

1. CD into the backend folder: `cd backend`
2. Set up your virtual env: `python -m venv venv` and activate it (`venv\Scripts\activate` on windows)
3. Install the stuff: `pip install -r requirements.txt`
4. Run the server: `uvicorn main:app --reload`

It runs on `http://localhost:8000` and you can check `http://localhost:8000/docs` to see the swagger UI.

## Database Stuff

I chose to use SQLite for this. I know Postgres is the standard for production, but honestly I just didn't want to deal with setting up a local Postgres instance and writing docker-compose files for a prototype. SQLite is built-in and just works out of the box.

The schema is pretty simple, just 3 main tables:
- `enquiries` - stores the main message, customer name, channel, and current status.
- `timeline_events` - keeps track of everything that happens to an enquiry so we can show a history log on the frontend.
- `follow_ups` - stores scheduled follow-up tasks.

## BackgroundTasks vs Celery

I used FastAPI's built-in `BackgroundTasks` to handle the SOP matching after an enquiry comes in. I thought about using Celery, but Celery felt like massive overkill for this scale. BackgroundTasks was enough to get the job done without needing to configure a whole separate worker process and a message broker.

## API Endpoints

- `POST /enquiry` - send a new message here (needs customer_name, channel, message). returns a job_id right away.
- `POST /enquiry/{id}/follow-up` - schedules a follow up for later (give it delay_minutes).
- `POST /enquiry/{id}/escalate` - manually push an issue to a human agent.
- `GET /enquiry/{id}/history` - spits out the full conversation history and timeline.
- `GET /health` - just checks if the api and db are alive.

## SOP Matching

When a message comes in, a background task checks it against 5 basic rules using simple keyword matching:
1. Booking enquiry - looks for words like book, appointment, schedule, reserve
2. Pricing question - looks for price, cost, rate, fee
3. Complaint - looks for unhappy, issue, bad, complaint
4. After-hours - triggers if you message between 8pm and 8am or use words like closed or tomorrow
5. General enquiry - fallback if nothing else matches

If it totally fails to match anything, it just auto-escalates to a human so we don't send a weird automatic reply.

## Known limitations and trade-offs

There's definitely a few things I'd change if this was going to production:
- SQLite won't scale if we get a lot of concurrent writes. We'd definitely need to migrate to Postgres eventually.
- The keyword matching is super basic right now. It can easily get confused if a customer says something like "I don't have a complaint" because it will still trigger the complaint SOP.
- There's zero auth implemented right now, so anyone can hit the endpoints.

# Closira Frontend

Hey, this is my frontend app for the Closira internship assignment. Basically it's a mobile dashboard for business owners to check their incoming leads and see which customer messages got escalated. It lets them see exactly what's going on without checking five different messaging apps at once.

## How to run it

Getting it running is pretty easy.

1. Go into the frontend folder: `cd frontend`
2. Install everything: `npm install`
3. Boot up the packager: `npx expo start`

From there you can just scan the QR code with the Expo Go app on your phone, or hit 'a' to open it in an Android emulator if you have one set up.

## The Screens

![Dashboard Screen](./screenshots/dashboard.png)

- **Dashboard:** The main home screen. Shows a quick summary of stats and the most recent activity feed.
- **Leads:** A list of all the new incoming messages that need attention.
- **Escalations:** The scary tab. This is where you see all the issues the automated SOP matching couldn't figure out.
- **Follow-ups:** A list of reminders to message people back.
- **Conversation Detail:** If you tap on any lead or escalation, it opens this screen to show the full chat history and a timeline of what happened.

## Styling (Why I used StyleSheet)

I decided to just use standard React Native `StyleSheet` for this instead of NativeWind or something fancy. Honestly, I just didn't want to spend half the weekend fighting with Tailwind configuration errors in Expo. StyleSheet is built-in and I already knew how to use it, so it was way faster for me to just write plain styles and stick to a clean, technical design.

## Where things are

The folder structure is mostly what you'd expect:
- `/screens` - all the main page views live here.
- `/components` - reusable UI stuff like buttons, badges, and cards.
- `/constants` - holds my colors and typography settings so the design stays consistent.
- `/mock` - this is where all the fake data lives.

## Mock Data

Right now the app doesn't actually talk to the backend. All the data is hardcoded in the `/mock` folder. I structured the fake data exactly like the real API responses will look, so hooking it up later should just be a matter of swapping out the imports for real `fetch` calls.

## Known limitations

Since this was a weekend project, there's a few things I know aren't perfect yet:
- There is no real API connection. Anything you "resolve" or "send" in the app just updates local state and will reset if you reload the app.
- I don't own an iPhone, so I haven't tested this on iOS at all. It might look weird on a notch.
- Some of the empty states (like if you have zero escalations) aren't fully handled and just show a blank screen instead of a nice "You're all caught up!" message.

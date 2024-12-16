npm init
npm i express, dotenv
npm install nodemon --save-dev
git init, git status

app.js, .env, .gitignore

npm i mongoose
npm i bcrypt, jsonwebtoken
Map: models, controllers, routes, app.js

---

git init
git add .
git commit -m "Done"
git remote add origin https://github.com/SandeepLS/Virtual-Event-Management.git
git branch -M main
git push -u origin main

---

Postman-tool: 1_Virtual_Event
User/EventManager Register
User/EventManager login :- we get token, based on the role.

//EventManager create & manage event
Using that token, EventManager create events
Using that token, EventManager Update events
Using that token, EventManager delete events

---

//user register for an event
Endpoint:
http://localhost:3000/api/v1/events/<eventId>/register
Headers:
User Authorization: Bearer <user_JWT_token>

-> middleware/userVerify.js -> controllers/event.js -> controllers/user.js -> routes/event.js
-> Using eventId, User register a particuler events.
Then User_ID added to the participants fielsd, in a event table.

-> Update files:-
event.js Controller -> event.js Routes ->

->const userId = req.user.\_id; // User ID from middleware decoded JWT
The user.\_id is coming from the decoded JWT (JSON Web Token). When a user logs in successfully, a JWT is created and signed with their user details, including the user.\_id (MongoDB ObjectId) and the user's role or other identifying information. This token is passed in the Authorization header when making requests to protected routes.

->Then we didn't mention require the Middleware (validateJWT) in event.js?
Ans: Updated event.js Routes
// Route to register for an event (protected route)
router.post('/:eventId/register', validateJWT, registerForEvent); // Use validateJWT middleware here

->Summary

- When a user sends a request to POST /api/v1/events/:eventId/register, the validateJWT middleware checks the validity of the token in the Authorization header.
- If the token is valid, the request proceeds to the registerForEvent controller.
- In the controller, you can access req.user.\_id to register the user for the event.

-> But in event.js we didn't use User right, Then why should you use require(const User = require('../models/user');)?
Why User is Needed:

- The User model is required because, when registering for an event, you might need to verify whether the user is already registered (by checking the participants array).
- Additionally, you might want to fetch user details (such as the email address) to send a confirmation email once they successfully register.
- Add the user's \_id to the participants field/array of that event.
- Optionally, you may want to associate the event with the user in some way (if required).
- You use User to check if the user exists (and to send a confirmation email, if necessary).

---

npm install nodemailer
1. While user register for event, will get successful confirmation email.
   Map: utils/emailSender.js ->.env -> middleware/userVerify.js -> controllers/event.js -> routes/event.js

set email pass:-
> Go to Google Account Security Settings.
> Enable 2-Step Verification (if not already enabled).
> Type in search-box: App Password
> create Project name: Virtual-Event
> Then we get password, & use it in vsCode.

2. While user cancel for event, will get successful confirmation email.
   Map: utils/emailSender.js ->.env ->controllers/event.js

---

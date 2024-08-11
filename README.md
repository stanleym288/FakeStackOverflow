[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tRxoBzS5)
Add design docs in *images/*

## Instructions to setup and run project
1. The init/js file takes in two arguments the first argument should be the admin's email and the second arguemnt takes in the password for the admins account. ex. nodemon server/init.js admin@gmail.com password
2. next start the server by running nodemon server/server.js
3. now use npm start in the client directory to run the react and load the brower
4. This will bring you too the welcome page where you can log in, continue as a guest user, or signup. If you don't have an account you can signup or continue as guest. otherwise you can log in.
5. For the guest users although the ask questions, upvote/downvote, commenting, and answer buttons are present clicking on them require a log in or a user account.
6. Notes: When dealing with the reputation, the reputation for the user in our implementation stays the same from when the user logs in or reloads the site - i.e reputation does not adpatively change. Example, user1 changes user2 reputation. If user2 is logged in the change is not reflected on user2 current log in. But on the next login attempt from user2 or a refresh of the page, the reputation change is made.
So if the reputation is not changing on the brower side a refresh or new login attempt for that user is needed. 

## Team Member 1 Contribution
- set up the profile page
- worked on the answer page and comments page
- set up the cookies and auth routes
- set up the profile page functionality
- worked on the searching
- worked on adding questions
- worked on code fixes and bugs

## Team Member 2 Contribution
 - Set up base pages with formatting
 - Set up user reputation and tags page
 - Started set up profile page
 - Cleaned up code, fixed bugs, and formatting
 - Separated Guest and Logged in user displays
 - Set up welcome page and it's functionality
 - Started on admin page 
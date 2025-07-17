IMPORTANT DISCLAIMER: Make sure to be inside of /marketplace when doing changes, wanting to make improvements and fixes and running the project. Be in GAMES-MARKETPLACE only for commits and pushes.

Steps to start the project:

- cd to marketplace by using `cd marketplace`
- Make sure you have an installed node version of 22.4 or above
- Install all dependencies by running: `npm install`
- Now cd to backend by using `cd backend`
- Repeat step 3, `npm install` to install the back-end dependencies
- Start the back-end by using `node index.js`
- cd back to marketplace using `cd ../`
- Start the front-end by using `npm start`

You need to port forward the database port in order to start it locally, so the database can work before you start the back-end, you can do so by:
`ssh -L 3306:localhost:3306 student_number@www.studenti.famnit.upr.si`

If you make changes to the sokoban files, make sure to run `npx webpack` while in the sokoban folder, so the new scripts can be executed. Delete the old ones and the new dist file.

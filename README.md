IMPORTANT DISCLAIMER: Make sure to be inside of /marketplace to start the project, when doing changes and wanting to make improvements and fixes.

First of all, You need to port forward the database port in order to start it locally, so the database can work before you start the back-end, you can do so by:
`ssh -L 3306:localhost:3306 student_number@www.studenti.famnit.upr.si`

Steps to start the project:

- cd to marketplace by using `cd marketplace`
- Make sure you have an installed node version of 22.4 or above
- Install all dependencies by running: `npm install`
- Now cd to backend by using `cd backend`
- Repeat step 3, `npm install` to install the back-end dependencies
- Start the back-end by using `node index.js`
- cd back to marketplace using `cd ../`
- Start the front-end by using `npm start`

If you make changes to the sokoban files in the backend, make sure to run `npx webpack` while in the sokoban folder, so the new scripts can be executed. Delete the old ones and the new dist file. Make sure to restart the back-end after doing changes.

TODO: See if there is a difference if the start of onslaught arena game arguments are pulled from the database or from local storage as it is now.
TODO: Implement the leaderboard system and try to reward the top 3 players with additional incentives (per day/24h?).
TODO: Add game-sessions in a sense that count the time the user spent playing each game, see what is upgraded. Maybe divide the coins into 3 different game coins and combine them into 1 for better analysis. Also a transaction table might be good aswell, what upgrade was bought, when and how many coins were spent.
TODO: Add dynamic cost per level of stats

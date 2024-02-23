# [League of Legends Leaderboard](https://lol.aillos.no)
https://lol.aillos.no
<br/>

This repository is for the web application or website; League of Legends Leaderboard.
The website is for me and my friends to track our League of Legends progress and compare our rank to eachother.
The data is being fetched from the Riot Games API and stored in an SQL Database using Azure. 
While most of the data is being fetched from the Riot Games API, I am also fetching the data for match history, as well as most played champions from OP.GG. Their site can be found here: https://op.gg . The reason for using their internal API instead of fetching and storing all of the data myself mostly comes down to the cost of running an SQL database as a student. If I am to use the database for other projects, not just this one, I simply do not have the capacity to store all of the games as well as champion data, and then calculate as opgg does. I have done this before when I had a Teamfight Tactics project that worked in a similar fashion as this website. However the number of participants were lower, as well as the data stored being lower due to less factors in each Teamfight Tactics game compared to a League of Legends game. For hosting and deployment, I am using Azure Web App Hosting and Github Pages.

## Languages:
- [Java](https://www.java.com/en/)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [SQL](https://www.microsoft.com/en-us/sql-server/)
- With use of [Maven](https://maven.apache.org/)

## Built with:
- [Vite + React](https://vitejs.dev/guide/)
- [Spring Boot](https://spring.io/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/products/azure-sql/)
- [Azure Web Hosting](https://azure.microsoft.com/en-us/products/app-service/web/)
- [AWS Secrets](https://aws.amazon.com/secrets-manager/)
- [Github Pages](https://pages.github.com)

## Modules:
- [FontAwesomeIcon](https://www.npmjs.com/package/@fortawesome/fontawesome-free)
- [React-Bootstrap](https://www.npmjs.com/package/react-bootstrap)
- [Axios](https://www.npmjs.com/package/axios)

## With use of:
- [Riot API](https://developer.riotgames.com/)
- [OP.GG](https://op.gg)
- [DDragon](http://ddragon.leagueoflegends.com/)
- [CDragon](https://raw.communitydragon.org/14.4/cdragon/)

## How does everything work?
The website tracks everyones ranks through the Riot API. Sensitive information such as database url, riot api key and email password is being stored as environment secrets. And for more privacyour fetch calls to the Riot API is being handled backend. This allows for both the API Key as well as unique identifiers to be hidden from the user themselves. The data being stored from the Riot API about each person is as follows: 
<br />
<img src="https://github.com/aillos/lolleaderboard/assets/91605277/f426dd1b-2293-40d3-84a2-9423643ff159" height="200">
<img src="https://github.com/aillos/lolleaderboard/assets/91605277/97a26ef1-7e00-4bbd-8e2c-e8ca169cad81" height="200">
<img src="https://github.com/aillos/lolleaderboard/assets/91605277/b96bb8f0-6831-49a4-b03f-f07ef6121501" height="200">
<br />
I then retrieve that information from the database using a REST API, I have made calls such as /api/update and /api/getAll for storing new data and retrieving all data.
However as I dont wish to expose all the data to the user, such as private Ids, I have created a FrontendSummoner View which excludes summonerId, puuid, and opggId from our data. 
After retrieving the data, I then render each summoner using a helper class. This helper class makes our code more organized, while removing the need for duplicate code. I have done this for other parts of the code as well, but to highlight some, I have also done it for simple functions such as formatting with spaces for numbers, calculating winrate, generating colors based on rank and so on.
For displaying certain parts of the information I am sending from the backend, I chose to use tooltips from React Bootstrap. I am styling them on my own but relying on their already exisiting component and logic for displaying it. The information I am using the tooltips for is things like winrate, mastery points, kda's, amount of games, last seasons rank and other tooltip stuff. I have provided some images of how this looks for the user. Everything marked in red is hoverable. <br />
<img src="https://raw.githubusercontent.com/aillos/lolleaderboard/master/leaderboard-frontend/src/assets/screenshot2.png" height="150">
<img src="https://raw.githubusercontent.com/aillos/lolleaderboard/master/leaderboard-frontend/src/assets/screenshot1.png" height="150">
<br />
Clicking on a player card brings you to their respective profile with a match history filled with matches as shown in image 1.



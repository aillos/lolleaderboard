# [League of Legends Leaderboard](https://lol.aillos.no)

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
The website tracks everyones ranks through the Riot API. The data being stored about each person is as follows:
![image](https://github.com/aillos/lolleaderboard/assets/91605277/b4b8647f-2cd5-469e-a02d-6288579f1a10) ![image](https://github.com/aillos/lolleaderboard/assets/91605277/b96bb8f0-6831-49a4-b03f-f07ef6121501)

**Whimsical board**
https://whimsical.com/test-technique-J8h1XRhpGBYHrcgVUEwjer

**Local environment for Postgresql**

Make sure to have postgresql installed locally (https://www.postgresql.org/download/)

Execute postgresql.script.sql to setup the database

**Environement file**

create a '.env' file in root directory with the following :

PG_HOST="localhost"
PG_USER="admin"
PG_PASSWORD="admin"
DB="test_technique"

**project organisation**

`3 main folders : domain, application, external`

`domain`: contains the definition of the business rules and object
`application`: contains the use cases for every interactions, with dependencies for the I/O functions
`external`: contains our I/O interactions, mainly the API definitions, database interactions and event listeners

We have 3 main elements: user, resource and events.
A resource reference a user so you can't create a resource without a user and the proper user Id
Use case `getResource` trigger an event, listened in infrastructure/events to increment the hit count (number of views)

Everything is put together in src/injection.ts and loaded src/index.ts, wich is our main file

**Commands**

start with a `npm i`

`npm run start`: Start the application
`npm run test`: Jest testing
`npm run lint`: Lint the all project (airbnb rules with some tweaks. I also have prettier installed within Vs Code)

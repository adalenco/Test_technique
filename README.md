**<ins>Whimsical board</ins>**

https://whimsical.com/test-technique-J8h1XRhpGBYHrcgVUEwjer

**<ins>Local environment for Postgresql</ins>**

Make sure to have postgresql installed locally (https://www.postgresql.org/download/)

Execute postgresql.script.sql to setup the database

**<ins>Environement file</ins>**

create a '.env' file in root directory with the following :

PG_HOST="localhost"
PG_USER="admin"
PG_PASSWORD="admin"
DB="test_technique"

**<ins>project organisation</ins>**

`3 main folders : domain, application, external`

`domain`: contains the definition of the business rules and object

`application`: contains the use cases for every interactions, with dependencies for the I/O functions

`external`: contains our I/O interactions, mainly the API definitions, database interactions and event listeners

We have 3 main elements: user, resource and events.

A resource reference a user so you can't create a resource without a user and the proper user Id
Use case `getResource` trigger an event, listened in infrastructure/events to increment the hit count (number of views)

Everything is put together in src/injection.ts and loaded src/index.ts, wich is our main file

**<ins>Commands</ins>**

start with a `npm i`

`npm run start`: Start the application
`npm run test`: Jest testing
`npm run lint`: Lint the all project (airbnb rules with some tweaks. I also have prettier installed within Vs Code)

**<ins>API specifications</ins>**

_`User:`_

----- `get:` /user/:id

<ins>return</ins>: [PersistedUser](src/domain/user/entities.ts)

<ins>definition:</ins> get a single user from a given id. Return 404 and error if not found

----- `post:` /user `body: {name: string, email: string}`

<ins>return:</ins> userId

<ins>definition:</ins> record a single user. Return 409 and error if email already exists

----- `put:` /user/:id `body: {name?: string, email?: string}`

<ins>return:</ins> nothing

<ins>definition:</ins> update a single user with given name, email or both. Return 409 and error if email already exists, 404 and error if user does not exists

----- `delete:` /user/:id

<ins>return:</ins> nothing

<ins>definition:</ins> delete a user from given id

_`Resource:`_

----- `get:` /resource/:id

<ins>return:</ins>[PersistedResource](src/domain/resource/entities.ts)

<ins>definition:</ins> get a single resource from a given id. Return 404 and error if not found. This request also trigger `RESOURCE_ACCESS_EVENT` [events](src/application/events/index.ts)

----- `post:` /resource `body: ${userId: number, title: string, content: string}`

<ins>return:</ins> resourceId

<ins>definition:</ins> record a single resource. Return 404 and error if not found

----- `delete:` /resource/:id

<ins>return:</ins> nothing

<ins>definition:</ins> delete a resource from given id

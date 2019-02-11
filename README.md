# Naruto API
Here lives the core of the Naruto API which constantly fetches info from the [Naruto wikia page](​http://naruto.wikia.com/wiki/Category:Characters), saves them to a Postgres DB and allows access to the info in a handy JSON format.

## Architecture
NodeJS for API endpoints
NodeJS for worker function to update the data automatically
Postgres DB to save the data
Heroku to host everything

## Features

* Versioned

* <1s response time in any endpoint

* Continuous Integration

* GitFlow

* Logs of every event

### Future Features
* TDD :soon:

* Micro service architecture :soon:

* Continuous Testing :soon:

* Events websocket stream :soon:

## HTTP Codes
This are the diferent HTTP response codes which we might use for a given response.

Code | Meaning      | Detail
---- | ------------ | ------
200  | OK           |
201  | Created      |
400  | Bad Request  | wrongly formatted request
401  | Unauthorized | missing or bad authentication
403  | Forbidden    | the user is authenticated but isn’t authorized to perform the requested operation on the given resource.
404  | Not Found    | incorrect path

## Endpoints

method | url | name          | detail | status
------ | --- | ------------- | ------ | ------
**GENERAL** |
GET    | /   | general index | useful to check that you are correctly connecting to the API (url, authentication, etc)    | :white_check_mark:
GET    | /v1 | v1 index      | useful to check that you are correctly connecting to the API V1 (url, authentication, etc) | :soon:


## Development
#### Run locally
  * **clone this repo** to your local machine
  * `npm install` to install all dependencies
  * `npm run develop`
  * open `localhost:8888` on your web browser or start making request to this url with [postman](getpostman.com)

  This will run with nodeman, which will be watching for changes in files to reload them on save.

## Devops
The app runs on [heroku](heroku.com), master branch runs on production, development runs on qa.

#### Contributing
We use [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html)
Just open your feature branch and when your changes are ready, open a Pull Request to the develop branch.

Please open issues for bugs, to request features or to ask about the implementation.

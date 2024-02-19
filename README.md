# PingPong
Solution made for DevSprint 2024 by Team PingPong. 

- [PingPong](#pingpong)
  * [Stacks Needed](#stacks-needed)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Routes](#routes)

## Stacks Needed
- Running PostgreSQL Server (port 3000 is used)
- Empty database on the PostgreSQL (with the tables needed given in ERD. Needed SQL commands are given in ``Database_PingPoing.docx``)
- `node` and `npm` installed
- Postman for testing the API

## Installation
1. Clone the repo

```bash
git clone https://github.com/ahmfuad/PingPong.git
cd PingPong/server
```
2. Install the dependencies

```bash
npm install
```

## Configuration
Update database credentials for `db.js`

|key|description|
|---|-----------|
|user| postgreSQL username (default: `postgres`)|
|host| Host address on which postgreSQL is installed. (default: `localhost`)|
|database| The DB Name of the empty DB you created in the second step of Pre-requisites|
|password| user password (default: `postgres`)|
|port| port for the database (default: `5432`)|


## Routes

### Register

URL: ``/api/register`` | Method: ``POST``

|key|description|
|---|-----------|
|firsname| First name of the user `*Required`|
|lastname| Last name of the user `*Required`|
|dob| Date of Birth of the user (year-month-day)|
|mobile| Mobile Number of the user (starting with country code) *Required|
|bio| User Bio|
|password| User Password `*Required`|
|address| User address|
|email| User email `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 401` : Email is used
- `Status: 200` : Successfully Registered

### Login
URL: ``/api/login`` | Method: ``POST``

|key|description|
|---|-----------|
|email| email of the user `*Required`|
|password| password set by the user `*Required`|'

#### Response
- `Status 400` : Internal Error
- `Status 401` : Undefined Behavior
- `Status 402` : Invalid Email/Password
- `Status 200` :
  ```json
  {
    "success": "Login Successful!",
    "user": "First Name of the user",
    "token": "generated authorization token"
  }
  ```

### Logout
URL: ``/api/logout`` | Method: ``GET``

#### Response
- ``{Logout Successful}``

### Update User

URL: ``/api/update`` | Method: ``PUT``

|key|description|
|---|-----------|
|firsname| First name of the user `*Required`|
|lastname| Last name of the user `*Required`|
|dob| Date of Birth of the user (year-month-day)|
|mobile| Mobile Number of the user (starting with country code) *Required|
|bio| User Bio|
|password| User Password `*Required`|
|address| User address|
|email| User email `*Required` (Can't be changed)|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 401` : Email is not in database and no such user
- `Status: 200` : Successfully Registered

### Get User

URL: ``/api/getUser/{id}`` | Method: ``GET``

#### Response
- `Status: 403` : No such user
- `Status: 200` : Returns every column of that user row in JSON

### Create Project
URL: ``/api/createproject`` | Method: ``POST``

|key|description|
|---|-----------|
|userID| First name of the user `*Required`|
|name| Last name of the user `*Required`|
|doc| Date of creation `*Required`|
|visibility| If the project Public or Private `*Required`|


#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Project Created


### Get Project

URL: ``/api/getProject/{id}`` | Method: ``GET``

__Here {id} is the id of an user. This route fetches every project where this user is a contributor.__ 

#### Response
- `Status: 403` : No such project
- `Status: 200` : Returns id, name, date_of_creation and user_id of the expected rows in JSON


### Create Folder
URL: ``/api/createfolder`` | Method: ``POST``

|key|description|
|---|-----------|
|name| Name of the folder `*Required`|
|user_id| id of the users who holds access to the folder `*Required`|
|project_id| id of the project of which the folder is a part `*Required`|
|parent_id| id of the parent folder (for newly created folders parent_id can't be NULL) `*Required`|


#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Folder Created

### Get Folder
URL: ``/api/folders/{id}`` | Method: ``GET``

__Here {id} is the unique folder id._

#### Response
- `Status: 403` : No such project
- `Status: 400` : Internal Error
- `Status 200` :  Returns data of the expected row in JSON

### Add Author

Adds another author/contributor to an existing project

URL: ``/api/addauthor`` | Method: ``PUT``

|key|description|
|---|-----------|
|user_id| id of the user who needs to be added `*Required`|
|project_id| id of the project where the user needs to be added `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Folder Created
- `Status: 500` : Internal Server Error

### Send Message

URL: ``api/chat/send`` | Method: ``POST``

|key|description|
|---|-----------|
|idFrom| id of the sender `*Required`|
|idTo| id of receiver `*Required`|
|message| The message needs to be sent `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Message Sent Successfully

### Get Message
URL: ``api/chat/{from}/{to}`` | Method: ``GET``

_Here {from} is the sender user id and {to} is the user id of the receiver_

#### Response
- `Status 400` : Internal Error
- `Status 403` : No messages
- `Status 200`: Returns datetime and message of the expected row in JSON


### Create Blog

URL: ``api/blogs/create`` | Method: ``POST``

|key|description|
|---|-----------|
|title| Title of the blog `*Required`|
|user_id| id of the user who created the blog `*Required`|
|maintext| Body text of the blog (markdown format) `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Blog Created Successfully

### Update Blog

URL: ``api/blogs/update/{id}`` | Method: ``POST``

|key|description|
|---|-----------|
|title| Title of the blog `*Required`|
|user_id| id of the user who created the blog `*Required`|
|maintext| Body text of the blog (markdown format) `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Blog Updated Successfully

### Get Blog

URL: ``api/blog/{id}`` | Method: ``GET``

_Here {id} is the blog id_

#### Response
- `Status: 403` : No such Blog
- `Status: 200` : Returns all data from the blog which has the {id} in JSON

### Add Comment/Reply to a blog

URL: ``api/blogreply`` | Method: ``POST``

|key|description|
|---|-----------|
|blog_id| id of the blog `*Required`|
|user_id| id of the commenter `*Required`|
|message| Comment `*Required`|

#### Response
- `Status: 400` : Undefined behavior and any required field is undefined
- `Status: 200` : Blog Updated Successfully

### Get Comment/Reply

URL: ``api/comments/{blogId}`` | Method: ``GET``

#### Response
- `Status: 403` : No Comments
- `Status: 200` : Retuns all comments/replies of the blog with id={blogId} in JSON



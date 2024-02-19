# PingPong
Solution made for DevSprint 2024 by Team PingPong. 

- [PingPong](#pingpong)
  * [Stacks Needed](#stacks-needed)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Routes](#routes)
    + [Register](#register)
    + [Update User](#update-user)
    + [Create Project](#create-project)
    + [Create Folder](#create-folder)
    + [Add Author](#add-author)
    + [Send Message](#send-message)
    + [Create Blog](#create-blog)
    + [Update Blog](#update-blog)
    + [Add Comment/Reply to a blog](#add-comment-reply-to-a-blog)


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

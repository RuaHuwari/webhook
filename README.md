# Webhook Pipeline Processing System

A **webhook-based pipeline processing system** built with **Node.js, Express, PostgreSQL, and Drizzle ORM**.
The system allows users to create pipelines that trigger actions, process jobs asynchronously, and deliver results to subscriber endpoints with retry support.

The project demonstrates backend concepts such as:

* REST API design
* asynchronous job processing
* webhook delivery systems
* retry mechanisms
* database-driven pipelines
* role-based metrics

---

# Setup

## 1. Clone the repository

```bash
git clone https://github.com/RuaHuwari/webhook.git
cd webhook
```

---

## 2. Environment Variables

Create a `.env` file in the project root.

```
DATABASE_URL=postgres://postgres:postgres@db:5432/webhook
JWT_SECRET=your_secret_key
PORT=3030
```

Explanation:

| Variable     | Description                               |
| ------------ | ----------------------------------------- |
| DATABASE_URL | PostgreSQL connection string              |
| JWT_SECRET   | Secret used to sign authentication tokens |
| PORT         | API server port                           |

---

## 3. Run with Docker

Build and start all services:

```bash
docker compose up --build
```

This starts:

* API server
* PostgreSQL database
* background worker

---

## 4. Run locally (without Docker)

Install dependencies:

```bash
npm install
```

Run the API:

```bash
npm run dev
```

Run the worker:

```bash
npm run worker
```

---
but in this case you need to change the database url accordingly 
# API Documentation

All API endpoints return **JSON responses**.

Authentication is handled using **JWT tokens**.

Authenticated routes require:

```
Authorization: Bearer <token>
```

---

# Authentication

### Register User

```
POST /auth/signup
```

Body:

```json
{
  "email": "user@email.com",
  "password": "password123"
  "role": "admin/user"
}
```
a user can be either a user or an admin, an admin can access features that a user can not
---

### Login

```
POST /auth/login
```

Response:

```json
{
  "token": "JWT_TOKEN",
  "role": "user/admin"
}
```

---

# Pipelines

A pipeline represents a workflow triggered by incoming events.

---

### Create Pipeline

```
POST /pipelines
```

Body:

```json
{
  "name": "My Pipeline",
  "source_url": ["https://source.com/","https://wource2.com/"],
  "actions": ["action_name1","action_name2"]
}
```
here the pipeline is created, pipeline data will be returned, webhook_secret along with them, save it to create signature for when you want to trigger the pipeline
---

### Get User Pipelines

```
GET /pipelines
```

Returns all pipelines owned by the authenticated user.

---

# Subscribers

Subscribers receive webhook results after a pipeline job is executed.

---

### Add Subscriber

```
POST /:pipelineId/subscribers
```

Body:

```json
{
  "url": "https://example.com/webhook"
}
```
this adds a new url to the subscribers connected to the given pipeline id
---

# Jobs

Jobs represent pipeline executions triggered by incoming data.

---

### Trigger Job

```
POST /webhook/:pipelineId
```

Body:

```json
{
  "payload": {
    "text": "Hello world"
  }
}
```
This will add the job to the database. but before adding it, there is a webhook signature middleware,
that makes sure you have x-signature in your header and the signature is correct for this requist.
There is also a rate limie middleware for the job triggering, for the same pipeline, you can not make more than 5 requists in one minute.
The job will be processed asynchronously by the worker.

### GET USER jobs
 ```
GET /jobs/myjobs?status=success|failed|pending
```
This will return a list of the jobs that are triggered for the pipelines that the user created. 
if you want all the jobs not for a specific status, just dont set the status value 

### GET ALL jobs

```
GET /jobs/all?status=success|failed|pending
```
this return all the jobs recorded in the system, and same as above, if you dont want a specific status, dont give the status value

---

# Metrics

The system provides metrics for monitoring pipeline performance.

---

### User Metrics

```
GET /metrics/
```

Returns metrics only for pipelines owned by the authenticated user.

Metrics include:

* total jobs
* successful jobs
* failed jobs
* pending jobs
* delivery attempts
* retries per subscriber

---

### Admin Metrics

```
GET /metrics/all
```

Returns system-wide statistics across all pipelines. this is for the admin only so we check the role of the user

---
# Deliveries
you can see a full history for the delivery attemps for every job 

### get deliveries for user
```
GET /deliveries/mydeliveries
```
this returns the delivery data that are for jobs related to the pipelines owned by user

### get deliveries for admin
```
GET /deliveries/all
```
this return the delivery records for all the system, this is only for admin, so we sheck the role of the user
 ### get deliveries for pipeline
 ```
GET /deliveries/:pipelineId
```
this returns the deliveries of the jobs created on the given pipeline, if the user owns the pipeline, or he is an admin.

# Actions 
### get actions 

```
GET /actions
```
this returns all the actions regestered in the system


# Architecture

The project follows a **modular layered architecture**.

```
src
│
├── actions
│   │
│   ├── StringActions
│   │   ├── uppercase.ts
│   │   ├── lowercase.ts
│   │   └── reverseText.ts
│   │
│   └── AI
│       ├── correctGrammar.ts
│       ├── summarizeText.ts
│       └── writeArticle.ts
│   └── HTTPActions
│       ├── getPageContent.ts
│
├── controllers
│   Handles request/response logic
│
├── routes
│   Defines API endpoints
│
├── middleware
│   Authentication and security middleware
│
├── db
│   │
│   ├── schema.ts
│   │   Database schema definitions
│   │
│   ├── queries
│   │   Database queries separated from controllers
│   │
│   └── index.ts
│       Database connection
│
├── workers
│   Background job processing logic
│
└── app.ts
    Main server entry point
```

---

# Actions System

The `actions/` directory contains **all executable actions that pipelines can perform**.

Each pipeline can be configured to execute one or more actions sequentially.

Examples of actions include:

### String Actions

Basic text transformations.

Examples:

* uppercase
* lowercase
* reverse text

Example:

```
hello world
```

becomes

```
HELLO WORLD
```

---

### AI Actions

Actions powered by AI APIs.

Examples:

* grammar correction
* article generation
* text summarization

Example:

```
Input text
   ↓
Correct grammar
   ↓
Send result to subscribers
```
### http actions
 * getPageContent
   this action fetch the conten of the given url
---

# Job Processing Architecture

The system uses a **database-backed job queue**.

### Job Flow

1. API receives a request.
2. A job record is created in the `jobs` table.
3. Worker polls the database for pending jobs.
4. Worker executes pipeline actions.
5. Results are stored in the database.
6. Deliveries are sent to subscribers.
7. Failed deliveries are retried 3 times.

---

# Database Schema Overview

Main tables:

| Table            | Purpose                       |
| ---------------- | ----------------------------- |
| users            | Stores user accounts          |
| pipelines        | User-defined pipelines        |
| actions          | Available system actions      |
| pipeline_actions | Actions assigned to pipelines |
| jobs             | Pipeline executions           |
| deliveries       | Webhook delivery attempts     |
| subscribers      | Subscriber endpoints          |

---

# Design Decisions

### 1. Separation of Controllers and Queries

Controllers only handle HTTP logic.

Database queries are separated into `db/queries` to:

* keep controllers clean
* improve reusability
* simplify testing

---

### 2. Database-backed Job Queue

Jobs are stored in PostgreSQL instead of using Redis or external queues.

Advantages:

* simplicity
* easier debugging
* persistent job history

---

### 3. Worker-based Processing

A background worker processes jobs asynchronously.

Benefits:

* prevents blocking API requests
* improves scalability
* enables retry mechanisms

---

### 4. Modular Action System

Actions are implemented as modular functions.

Benefits:

* easy to add new actions
* pipelines can combine multiple actions
* promotes code reuse

---

### 5. Role-based Metrics

For example, metrics are separated into:

* **User metrics** → pipelines owned by the user
* **Admin metrics** → system-wide data

This ensures proper access control.

---

# Future Improvements

Possible enhancements:

* Redis queue for distributed workers
* pipeline execution logs
* webhook signature verification
* UI dashboard
* dead-letter queue for permanently failed jobs

---

# Author

Rua Huwari
Computer Engineer
GitHub: [https://github.com/RuaHuwari](https://github.com/RuaHuwari)

---

**"System Flow Diagram"** (5 lines but makes the project look much more professional).

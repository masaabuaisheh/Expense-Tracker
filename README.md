# Expense Tracker
A full-stack Expense Tracker application that allows users to add, edit, delete, filter, and track their expenses.

## Features

- Add a new expense
- View all expenses
- Edit existing expenses
- Delete expenses
- Filter expenses by category
- Filter expenses by month
- Search expenses by title
- Sort expenses by title
- View total expenses
- View the total number of expenses
- View the highest expense
- View expenses by category using a chart
- Dark mode
- Responsive design
- Loading spinner during API requests
- Success and error alerts
- Frontend and backend validation

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap
- Chart.js

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- CORS
- dotenv

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get one expense by ID |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Expense Categories

The available expense categories are:

- Food
- Transport
- Bills
- Entertainment
- Other

## Setup Instructions

### 1. Clone or download the project

Download the project and open it in VS Code.

### 2. Create the PostgreSQL database

Create a PostgreSQL database named:

```text
expense_tracker
```

Run the provided `schema.sql` file to create the required database table.

### 3. Configure environment variables

Inside the backend folder, create a `.env` file based on `.env.example`.

Example:

```text
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

Do not upload the `.env` file because it contains private database information.

### 4. Install backend dependencies

Open the terminal inside the backend folder and run:

```bash
npm install
```

### 5. Start the backend server

Run:

```bash
node server.js
```

The server runs on:

```text
http://localhost:3000
```

The API base URL is:

```text
http://localhost:3000/api/expenses
```

### 6. Run the frontend

Open the frontend project using Live Server or open `index.html` in the browser.

Make sure the backend server is running before using the application.

## Validation

The application validates expense data before saving it.

- Title is required.
- Amount must be a number greater than zero.
- Category must be one of the available categories.
- Date is required.
- Invalid or missing data returns a `400` response.
- An expense that does not exist returns a `404` response.

## Error Handling

API requests use `fetch`, `async/await`, and `try/catch`.

The application displays Bootstrap alerts when an operation fails. It also displays a clear message when the frontend cannot connect to the backend server.

After adding, editing, or deleting an expense, the application fetches the latest data from the server again.

## Database Handling

All SQL queries that contain user input use parameterized queries such as `$1`, `$2`, and `$3`.

The database automatically generates the expense ID.

PostgreSQL `NUMERIC` values are converted to JavaScript numbers, and dates are returned in `YYYY-MM-DD` format.

## Bonus Features

Additional features implemented in the project include:

- Expenses by category chart using Chart.js
- Filter by month
- Search by title
- Sort expenses by title
- Dark mode

## Challenges and Solutions

One of the main challenges was keeping the frontend synchronized with the PostgreSQL database after adding, editing, or deleting an expense.

I solved this by creating a `refresh()` function that sends a new GET request after each successful operation. This ensures that the table, summary cards, and chart always use the latest data from the database.

Another challenge was handling different API errors correctly. I handled `400` responses for invalid data, `404` responses when an expense does not exist, and connection errors when the backend server is unavailable. Clear Bootstrap alerts are displayed to help the user understand what went wrong.

## Project Structure

```text
expense-tracker/
│
├── backend/
│   ├── server.js
│   ├── schema.sql
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
└── README.md
```

# Expense Tracker

A full-stack Expense Tracker application that allows users to add, edit, delete, filter, and track their expenses. The application stores expense data in a PostgreSQL database.

## How to run

**Backend**

1. Create a PostgreSQL database named `expense_tracker`.
2. Run the provided `schema.sql` file in the `expense_tracker` database to create the expenses table.
3. Create a `.env` file inside the backend folder based on `.env.example`:

```text
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

4. Open the backend folder in the terminal and install the dependencies:

```bash
npm install
```

5. Start the backend server:

```bash
node server.js
```

6. The backend will run on `http://localhost:3000`.

**Frontend**

1. Open the frontend folder in VS Code.
2. Open `index.html` using Live Server or directly in the browser.
3. Make sure the backend server is running before using the application.

## Features

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Bonus Features

- [x] Expenses by category chart using Chart.js
- [x] Filter expenses by month
- [x] Search expenses by title
- [x] Sort expenses by title
- [x] Dark mode

## What was the hardest part?

The hardest part was keeping the frontend synchronized with the database after adding, editing, or deleting an expense. I solved this by creating a `refresh()` function that fetches the latest expenses from the backend after each successful operation and updates the table, summary cards, and chart.

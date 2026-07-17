# Backend setup — Express + MongoDB Atlas + Mongoose

## 1. Create the project (if starting fresh)

```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv morgan
npm install -D nodemon
```

This folder already contains a ready `package.json` — you can just run
`npm install` inside it instead.

## 2. Create a MongoDB Atlas cluster

1. Sign up / log in at https://www.mongodb.com/cloud/atlas
2. Create a free (M0) cluster.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development).
5. Click **Connect -> Drivers -> Node.js** and copy the connection string.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Paste your Atlas connection string into `MONGO_URI`, e.g.:

```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

## 4. Run the server

```bash
npm install
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API will be available at `http://localhost:5000/api`.

## API reference

| Method | Route                  | Description                          |
|--------|-------------------------|---------------------------------------|
| GET    | /api/health             | Health check                          |
| GET    | /api/expenses            | List expenses (supports `?category=&from=&to=&search=`) |
| GET    | /api/expenses/summary    | Totals, this-month, top category, avg/day, category breakdown |
| GET    | /api/expenses/:id        | Get a single expense                  |
| POST   | /api/expenses            | Create an expense                     |
| PUT    | /api/expenses/:id        | Update an expense                     |
| DELETE | /api/expenses/:id        | Delete an expense                     |

### Expense shape

```json
{
  "title": "Groceries at Whole Foods",
  "amount": 84.32,
  "category": "Food",
  "date": "2026-07-15",
  "notes": "Weekly shop"
}
```

Valid categories: `Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Other`

## Folder structure

```
backend/
  server.js               entry point
  config/db.js             MongoDB Atlas connection via Mongoose
  models/Expense.js        Mongoose schema
  controllers/              route handler logic
  routes/                  Express routers
  middleware/               asyncHandler, notFound, errorHandler
  .env.example
```

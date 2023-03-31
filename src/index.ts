import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser } from './controllers/UserController';

const { PORT, DATABASE_NAME, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

const app: Express = express();

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/api/user', registerUser);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Database is called ${DATABASE_NAME}`);
});

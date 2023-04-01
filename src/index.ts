import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { createHash } from 'crypto';
import { registerUser, logIn } from './controllers/UserController';
import { shortenUrl } from './controllers/LinkController';

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

app.use(express.json());

app.post('/api/user', registerUser);
app.post('/api/login', logIn);
app.post('/api/link', shortenUrl);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Database is called ${DATABASE_NAME}`);
  const md5 = createHash('md5');
  md5.update('https://youtube.com/watch?v=dQw4w9WgXcQ');
  const urlHash = md5.digest('base64url');
  const linkId = urlHash.slice(0, 9);

  console.log(`MD5 Hash: ${urlHash}`);
  console.log(`linkId: ${linkId}`);
});

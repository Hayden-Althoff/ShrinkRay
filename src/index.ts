import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, {Express, Request, Response} from 'express';


const {PORT, DATABASE_NAME} = process.env;

const app: Express = express();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Database is called ${DATABASE_NAME}`);
});

import { Request, Response } from 'express';
import argon2 from 'argon2';
import { getUserByUserName, addNewUser } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as NewUserRequest;
  console.log(`Username: ${username}, Password: ${password}`);
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addNewUser(username, passwordHash);
    console.log(newUser);
    // res.sendStatus(201);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as NewUserRequest;

  const user = await getUserByUserName(username);

  // Check if the user account exists for that username
  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The account exists so now we can check their password
  const { passwordhash } = user;

  // If the password does not match
  if (!(await argon2.verify(passwordhash, password))) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
  }
  await req.session.clearSession();
  req.session.AuthenticatedUserData = {
    userId: user.userId,
    userName: user.username,
    isAdmin: false,
    isPro: false,
  };
  req.session.isLoggedIn = true;
  // res.sendStatus(200);
  res.redirect('/shrink');
}

export { registerUser, logIn };

import { Request, Response } from 'express';
import argon2 from 'argon2';
import { getUserByUserName, addNewUser } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as NewUserRequest;
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addNewUser(username, passwordHash);
    console.log(newUser);
    res.send(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

export { registerUser };

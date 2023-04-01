import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { createLinkId, createNewLink } from '../models/LinkModel';
import { getUserById } from '../models/UserModel';
import { User } from '../entities/User';

async function shortenUrl(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(403); // send the appropriate response
    return;
  }

  const { userId } = req.session.AuthenticatedUserData; // Get the userId from `req.session`

  const user = await getUserById(userId); // Retrieve the user's account data using their ID
  if (!user) {
    res.sendStatus(404);
    return;
  } // Check if you got back `null`
  // send the appropriate response

  if (!user.isPro || !user.isAdmin) {
    if (user.links.length >= 5) {
      res.sendStatus(403); // forbidden to generate new Link
    }
  } // Check if the user is neither a "pro" nor an "admin" account
  // check how many links they've already generated
  // if they have generated 5 links
  // send the appropriate response

  const { originalUrl } = req.body as NewLinkRequest;
  const linkId = createLinkId(originalUrl, userId); // Generate a `linkId`

  try {
    const newLink = createNewLink(originalUrl, linkId, user);
    console.log(newLink);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
  // Add the new link to the database (wrap this in try/catch)
  // Respond with status 201 if the insert was successful
}

export { shortenUrl };

import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import {
  createLinkId,
  createNewLink,
  getLinkById,
  updateLinkVisits,
  getLinksByUserId,
  getLinksByUserIdForOwnAccount,
  deleteLink,
} from '../models/LinkModel';
import { getUserById } from '../models/UserModel';
import { Link } from '../entities/Link';

async function shortenUrl(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(403); // send the appropriate response
    return;
  }

  const { userId } = req.session.AuthenticatedUserData; // Get the userId from `req.session`

  const user = await getUserById(userId); // Retrieve the user's account data using their ID
  if (!user) {
    // res.sendStatus(404);
    res.redirect('/login');
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

async function getOriginalUrl(req: Request, res: Response): Promise<void> {
  const { targetLink } = req.params as TargetLink; // Retrieve the link data using the targetLinkId from the path parameter
  const link = await getLinkById(targetLink);

  if (!link) {
    res.sendStatus(404);
    return;
  }
  // Check if you got back `null`
  // send the appropriate response

  await updateLinkVisits(link);
  // Call the appropriate function to increment the number of hits and the last accessed date

  // Redirect the client to the original URL
  res.redirect(link.originalUrl);
}

async function getAllLinks(req: Request, res: Response): Promise<Link[]> {
  const { userId } = req.params as UserIdRequest;
  if (!req.session.isLoggedIn || req.session.AuthenticatedUserData.userId !== userId) {
    const links = await getLinksByUserId(userId);
    res.json(links);
    return links;
  }

  const links = await getLinksByUserIdForOwnAccount(userId);
  res.json(links);
  return links;
}

async function deleteUserLink(req: Request, res: Response): Promise<void> {
  const { userId, linkId } = req.params as DeleteRequest;

  if (
    userId !== req.session.AuthenticatedUserData.userId ||
    !req.session.AuthenticatedUserData.isAdmin
  ) {
    res.sendStatus(403);
    return;
  }

  await deleteLink(userId, linkId);
  res.sendStatus(200);
}

export { shortenUrl, getOriginalUrl, getAllLinks, deleteUserLink };

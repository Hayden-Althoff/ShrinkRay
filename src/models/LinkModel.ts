import { createHash } from 'crypto';
import { Link } from '../entities/Link';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link | null> {
  const selectedLink = await linkRepository
    .createQueryBuilder('link')
    .where('linkId', { linkId })
    .select(['link.linkId', 'link.isPro', 'link.isAdmin', 'link.user'])
    .getOne();

  return selectedLink;
}

function createLinkId(originalUrl: string, userId: string): string {
  const md5 = createHash('md5');
  md5.update(originalUrl + userId);
  const urlHash = md5.digest('base64url');
  const linkId = urlHash.slice(0, 9);

  return linkId;
}

async function createNewLink(originalUrl: string, linkId: string, creator: User): Promise<Link> {
  let newLink = new Link();
  newLink.user = creator;
  newLink.linkId = linkId;
  newLink.originalUrl = originalUrl;

  newLink = await linkRepository.save(newLink);

  return newLink;
}

async function updateLinkVisits(link: Link): Promise<Link> {
  const updatedLink = link;
  updatedLink.numHits += 1;
  const now = new Date();
  updatedLink.lastAccessedOn = now;
  await linkRepository
    .createQueryBuilder()
    .update(Link)
    .set({ numHits: updatedLink.numHits, lastAccessedOn: updatedLink.lastAccessedOn })
    .execute();
  return updatedLink; // return the updated link
}

async function getLinksByUserId(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
    .leftJoin(User, 'user')
    .select(['link.linkId', 'link.originalUrl', 'user.userId', 'user.username', 'user.isAdmin'])
    .getMany();

  return links;
}

async function getLinksByUserIdForOwnAccount(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
    .leftJoin(User, 'user')
    .select([
      'link.linkId',
      'link.originalUrl',
      'link.numHits',
      'link.lastAccessedOn',
      'user.userId',
      'user.username',
      'user.isPro',
      'user.isAdmin',
    ])
    .getMany();

  return links;
}

export {
  getLinkById,
  createNewLink,
  createLinkId,
  updateLinkVisits,
  getLinksByUserId,
  getLinksByUserIdForOwnAccount,
};

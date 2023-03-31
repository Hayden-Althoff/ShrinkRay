import { createHash } from 'crypto';
import { Link } from '../entities/Link';
import { AppDataSource } from '../dataSource';

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

export { getLinkById };

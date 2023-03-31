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

export { getLinkById };

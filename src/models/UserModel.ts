import { User } from '../entities/User';
import { AppDataSource } from '../dataSource';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUserName(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username } });
}

async function getUserById(userId: string): Promise<User> {
  const selectedUser = await userRepository
    .createQueryBuilder('user')
    .where('userId', { userId })
    .select(['user.userId', 'user.isPro', 'user.isAdmin', 'user.links'])
    .getOne();

  return selectedUser;
}

async function addNewUser(username: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.username = username;
  newUser.passwordhash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

export { getUserByUserName, addNewUser, getUserById };

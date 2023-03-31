import { User } from '../entities/User';
import { AppDataSource } from '../dataSource';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUserName(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username } });
}

async function getUserById(userId: string): Promise<User | null> {
  return await userRepository.findOne({ where: { userId } });
}

async function addNewUser(username: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.username = username;
  newUser.passwordhash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

export { getUserByUserName, addNewUser };

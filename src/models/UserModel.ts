import { User } from '../entities/User';
import { AppDataSource } from '../dataSource';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUserName(userName: string): Promise<User | null> {
  return await userRepository.findOne({ where: { userName } });
}

async function addNewUser(username: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.userName = username;
  newUser.passwordhash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

export { getUserByUserName, addNewUser };

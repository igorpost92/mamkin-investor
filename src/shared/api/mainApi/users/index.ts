import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Session, User } from '../../../db/entities';
import { getDB } from '../../../db';
import { getFeatures } from '../features';

const scrypt = promisify(_scrypt);

interface UserPayload {
  username: string;
  password: string;
}

const isUserExists = async (username: string) => {
  const db = await getDB();
  const usersRepo = db.getRepository(User);

  const user = await usersRepo.findOne({ where: { name: username } });
  return !!user;
};

const generateSalt = () => randomBytes(8).toString('hex');

const hashPassword = async (password: string, salt: string) => {
  const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');
  const result = salt + '.' + hash;
  return result;
};

export const registerUser = async (payload: UserPayload) => {
  const db = await getDB();

  const featuresConfig = await getFeatures();

  if (!featuresConfig?.registrationEnabled) {
    throw new Error('Registration disabled');
  }

  const isExists = await isUserExists(payload.username);
  if (isExists) {
    throw new Error('User with this username is already exists');
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(payload.password, salt);

  const sessionId = await db.transaction(async tx => {
    const usersRepo = tx.getRepository(User);

    const userCreationResult = await usersRepo.insert({
      name: payload.username,
      password: hashedPassword,
    });

    const sessionsRepo = tx.getRepository(Session);

    const sessionCreationResult = await sessionsRepo.insert({
      userId: userCreationResult.identifiers[0].id,
      date: new Date(),
    });

    return sessionCreationResult.identifiers[0].id as string;
  });

  return sessionId;
};

export const signInUser = async (payload: UserPayload) => {
  const db = await getDB();
  const usersRepo = db.getRepository(User);

  const user = await usersRepo.findOne({ where: { name: payload.username } });

  if (!user) {
    throw new Error('Incorrect username or password');
  }

  const [salt] = user.password.split('.');
  const hashedPassword = await hashPassword(payload.password, salt);

  if (user.password !== hashedPassword) {
    throw new Error('Incorrect username or password');
  }

  const sessionsRepo = db.getRepository(Session);

  const sessionCreationResult = await sessionsRepo.insert({
    userId: user.id,
    date: new Date(),
  });

  return sessionCreationResult.identifiers[0].id as string;
};

export const killSession = async (sessionId: string) => {
  const db = await getDB();
  const sessionsRepo = db.getRepository(Session);
  await sessionsRepo.delete(sessionId);
};

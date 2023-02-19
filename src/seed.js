import { FriendRepository } from './repositories/friend-repository.js';
import { DbClient } from './clients/db-client.js';

// todo: add seed script
// add run script
export async function seed () {
  const dbClient = await DbClient.getInstance();
  const friendRepository = new FriendRepository(dbClient);
  await friendRepository.createTable();
  await friendRepository.loadFromFlatFile();
}
await seed();

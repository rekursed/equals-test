import { FriendRepository } from './repositories/friend-repository.js';
import { DbClient } from './clients/db-client.js';
import { config } from './config.js';
import { sendBirthdayGreeting } from './services/send-birthday-greeting.js';
import { seed } from './seed.js';

// todo: add seed script
// add run script
async function main () {
  await seed();
  // friendRepository.loadFromFlatFile();
  // console.log( await friendRepository.findByBirthday(new Date('2019-10-10')));
  await sendBirthdayGreeting();
}
await main();

import { FriendRepository } from '../repositories/friend-repository.js';
import { DbClient } from '../clients/db-client.js';
import { config } from '../config.js';
import { emailClient } from '../clients/nodemailer.js';

/**
 * Sends birthday email to friend if their birthday is today
 */
export const sendBirthdayGreeting = async () => {
  const dbClient = await DbClient.getInstance();
  const friendRepository = new FriendRepository(dbClient);
  const birthdayBuddies = await friendRepository.findByBirthday();
  console.log(birthdayBuddies.length);
  await Promise.all(birthdayBuddies.map((friend) => {
    return emailClient.sendMail({
      from: config.sender_email,
      to: friend.email,
      subject: 'Happy birthday!',
      text: `Happy birthday, dear ${friend.firstName}!`
    });
  }));
  return { success: true };
};

/* eslint-disable import/first */
import { afterEach, beforeEach, expect, jest } from '@jest/globals';
jest.mock('../../repositories/friend-repository.js');
jest.mock('../../clients/nodemailer.js');

import { sendBirthdayGreeting } from '../send-birthday-greeting.js';
import { FriendRepository } from '../../repositories/friend-repository.js';
import { emailClient } from '../../clients/nodemailer.js';

const findByBirthdayMock = jest
  .spyOn(FriendRepository.prototype, 'findByBirthday')
  .mockImplementation(() => (
    [
      {
        id: 4,
        lastName: 'Doe',
        firstName: 'John',
        dateOfBirth: '1982/10/08',
        email: 'john.doe@foobar.com'
      },
      {
        id: 29,
        lastName: 'Doe',
        firstName: 'John',
        dateOfBirth: '1982/10/08',
        email: 'john.doe1@foobar.com'
      },
      {
        id: 30,
        lastName: 'Doe',
        firstName: 'John',
        dateOfBirth: '1982/10/08',
        email: 'john.doe2@foobar.com'
      }
    ])
  );
const sendMailMock = jest.spyOn(emailClient, 'sendMail').mockImplementation((config) => {
  console.log('email sent', config);
});

describe('Friend Repository', function () {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  afterEach(() => {

  });

  it('should send email to friends if their birthday is today', async function () {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-08'));
    await sendBirthdayGreeting();

    expect(sendMailMock).toHaveBeenCalledTimes(3);
    expect(findByBirthdayMock).toHaveBeenCalledTimes(1);
  });
});

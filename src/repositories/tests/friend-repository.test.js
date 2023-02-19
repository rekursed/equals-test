/* eslint-disable import/first */
import { FriendRepository } from '../friend-repository.js';

import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';

jest.mock('fs/promises');
import fs from 'fs/promises';
import { DbClient } from '../../clients/db-client.js';

const runQueryMock = jest
  .spyOn(DbClient.prototype, 'runQuery')
  .mockImplementation(() => {
  });

const allQueryMock = jest
  .spyOn(DbClient.prototype, 'all')
  .mockImplementation(() => {
  });

const mockFileBody = `last_name, first_name, date_of_birth, email
    Doe, John, 1982/10/08, john.doe@foobar.com
    Ann, Mary, 1975/09/11, mary.ann@foobar.com`;

const dbClient = await DbClient.getInstance();
describe('Friend Repository', function () {
  const friendRepository = new FriendRepository(dbClient);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('Should insert data into database from file', async function () {
    fs.readFile = jest.fn().mockResolvedValue(mockFileBody);
    await friendRepository.loadFromFlatFile();
    expect(runQueryMock).toHaveBeenCalledTimes(2);
  });

  it('should query db if birthday is today', async function () {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-08'));
    await friendRepository.findByBirthday();
    expect(allQueryMock).toHaveBeenCalledTimes(1);
    expect(allQueryMock).toHaveBeenCalledWith("SELECT * FROM friends WHERE dateOfBirth like '%/10/08'");
  });

  it('should query db appropriately if birthday is on 29th february', async function () {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-02-28'));

    await friendRepository.findByBirthday();
    expect(allQueryMock).toHaveBeenCalledTimes(1);
    expect(allQueryMock).toHaveBeenCalledWith("SELECT * FROM friends WHERE dateOfBirth like '%/02/28'or dateOfBirth like  '%/02/29'");
  });

  it('should query db  appropriately if birthday is on 29th february on leap year', async function () {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-02-29'));
    await friendRepository.findByBirthday();
    expect(allQueryMock).toHaveBeenCalledTimes(1);
    expect(allQueryMock).toHaveBeenCalledWith("SELECT * FROM friends WHERE dateOfBirth like '%/02/29'");
  });
});

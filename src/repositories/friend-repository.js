import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { getDirname } from '../utils.js';

const headerMap = {
  last_name: 'lastName',
  first_name: 'firstName',
  date_of_birth: 'dateOfBirth',
  email: 'email'
};

export class FriendRepository {
  constructor (dbClient) {
    this.dbClient = dbClient;
  }

  createTable () {
    const sql = `CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lastName TEXT,
      firstName TEXT,
      dateOfBirth TEXT,
      email TEXT UNIQUE
      )`;
    return this.dbClient.runQuery(sql);
  }

  create ({ lastName, firstName, dateOfBirth, email }) {
    return this.dbClient.runQuery(`INSERT OR IGNORE INTO friends (lastName, firstName, dateOfBirth, email)
        VALUES (?, ?, ?, ?)
        `, [lastName, firstName, dateOfBirth, email]);
  }

  async loadFromFlatFile () {
    const body = await fs.readFile(path.join(getDirname(import.meta.url), '/../data/friend-data.csv'), 'utf-8');
    console.log(body);
    const rows = body.split(os.EOL);
    const headers = rows[0].split(',').map(string => string.trim());
    const friendList = rows.slice(1).map((row) => {
      const result = {};
      const items = row.split(',');
      items.forEach((item, index) => {
        result[headerMap[headers[index]]] = item.trim();
      });
      this.create(result);
      return result;
    });
    return friendList;
  }

  async findByBirthday (date = new Date()) {
    const datePattern = `'%/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}'`;

    let sql = `SELECT * FROM friends WHERE dateOfBirth like ${datePattern}`;
    if (date.getMonth() === 1 && date.getDate() >= 28) {
      const isLeapYear = new Date(date.getFullYear(), 1, 29).getDate() === 29;
      if (!isLeapYear) {
        sql += 'or dateOfBirth like  \'%/02/29\'';
      }
    }
    return await this.dbClient.all(sql);
  }
}

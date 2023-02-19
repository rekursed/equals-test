import sqlite3 from 'sqlite3';
import path from 'path';
import { getDirname } from '../utils.js';

sqlite3.verbose();

export class DbClient {
  // constructor (filePath = path.join(getDirname(import.meta.url), '../data/db.sqlite3')) {
  //   this.db = new sqlite3.Database(filePath, (err) => {
  //     if (err) {
  //       console.log('Error while connecting to database', err);
  //     } else {
  //       console.log('Databse connected');
  //     }
  //   });
  // }

  init (filePath) {
    this.db = new sqlite3.Database(filePath, (err) => {
      if (err) {
        console.log('Error while connecting to database', err);
      } else {
        console.log('Databse connected, init');
      }
    });
  }

  static async getInstance (filePath = path.join(getDirname(import.meta.url), '../data/db.sqlite3')) {
    if (!this.db) {
      const instance = new DbClient();
      await instance.init(filePath);
      return instance;
    }
    return this;
  }

  runQuery (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  get (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

const sqlite3 = require('sqlite3');
const path = require('path');

const dbFile = path.resolve(__dirname, '../test-chatroom.db');
const db = new sqlite3.Database(dbFile);

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS users', (err) => {
        if (err) {
          reject(err);
        }
      });
      db.run('DROP TABLE IF EXISTS messages', (err) => {
        if (err) {
          reject(err);
        }
      });

      db.run('CREATE TABLE users (username TEXT PRIMARY KEY, password TEXT)', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Users table created');
        }
      });

      db.run('CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Messages table created');
        }
      });
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
});

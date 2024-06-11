import sqlite3 from 'sqlite3';
import path from 'path';

const dbFile = process.env.NODE_ENV === 'test' ? path.resolve(__dirname, '../../test-chatroom.db') : path.resolve(__dirname, '../../chatroom.db');

// Create a connection to the database file 'chatroom.db'
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log(`Database opened successfully: ${dbFile}`);
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, room TEXT)', (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists');
    }
  });

  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, room TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
    if (err) {
      console.error('Error creating messages table:', err);
    } else {
      console.log('Messages table created or already exists');
    }
  });
});

export default db;

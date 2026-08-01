const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

module.exports = { readUsers, writeUsers };

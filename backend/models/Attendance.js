const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Attendance {
  constructor() {
    this.dbPath = path.join(__dirname, '../attendance.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.init();
  }

  init() {
    const sql = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeName TEXT NOT NULL,
        employeeID TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    this.db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Attendance table ready');
      }
    });
  }

  create(attendanceData, callback) {
    const { employeeName, employeeID, date, status } = attendanceData;
    const sql = `INSERT INTO attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)`;
    
    this.db.run(sql, [employeeName, employeeID, date, status], function(err) {
      callback(err, this);
    });
  }

  findAll(callback) {
    const sql = `SELECT * FROM attendance ORDER BY date DESC, created_at DESC`;
    this.db.all(sql, [], callback);
  }

  search(query, callback) {
    const sql = `SELECT * FROM attendance WHERE employeeName LIKE ? OR employeeID LIKE ? ORDER BY date DESC`;
    this.db.all(sql, [`%${query}%`, `%${query}%`], callback);
  }

  filterByDate(date, callback) {
    const sql = `SELECT * FROM attendance WHERE date = ? ORDER BY employeeName`;
    this.db.all(sql, [date], callback);
  }

  delete(id, callback) {
    const sql = `DELETE FROM attendance WHERE id = ?`;
    this.db.run(sql, [id], callback);
  }

  close() {
    this.db.close();
  }
}

module.exports = Attendance;
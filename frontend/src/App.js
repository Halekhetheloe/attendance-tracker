import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAttendanceSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1>Employee Attendance Tracker</h1>
          <div className="nav-links">
            <button 
              className={`nav-btn ${currentPage === 'form' ? 'active' : ''}`}
              onClick={() => setCurrentPage('form')}
            >
              Mark Attendance
            </button>
            <button 
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              View Records
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'form' && (
          <AttendanceForm onAttendanceSubmitted={handleAttendanceSubmitted} />
        )}
        {currentPage === 'dashboard' && (
          <AttendanceDashboard key={refreshKey} />
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 Employee Attendance Tracker. All rights reserved.</p>
          <div className="footer-links">
            <span>HR Management System</span>
            <span>•</span>
            <span>Developed with React & Node.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      console.log('Fetching from:', `${API_URL}/api/attendance`);
      const response = await axios.get(`${API_URL}/api/attendance`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAttendance();
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/attendance/search?query=${searchQuery}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error searching attendance:', error);
      alert('Failed to search attendance records');
    }
  };

  const handleFilterByDate = async () => {
    if (!filterDate) {
      fetchAttendance();
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/attendance/filter?date=${filterDate}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error filtering attendance:', error);
      alert('Failed to filter attendance records');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/attendance/${id}`);
      setAttendance(attendance.filter(record => record.id !== id));
      alert('Attendance record deleted successfully');
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert('Failed to delete attendance record');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDate('');
    fetchAttendance();
  };

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Attendance Records</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button onClick={handleSearch} className="submit-btn" style={{padding: '0.5rem 1rem'}}>
            Search
          </button>
          <button onClick={handleFilterByDate} className="submit-btn" style={{padding: '0.5rem 1rem'}}>
            Filter by Date
          </button>
          <button onClick={clearFilters} className="submit-btn" style={{padding: '0.5rem 1rem', background: '#6c757d'}}>
            Clear
          </button>
        </div>
      </div>

      {attendance.length === 0 ? (
        <div className="no-data">
          No attendance records found.
        </div>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeName}</td>
                <td>{record.employeeID}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td className={`status-${record.status.toLowerCase()}`}>
                  {record.status}
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceDashboard;
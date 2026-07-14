import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const API_BASE_URL = 'https://login-registration-backend01.onrender.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '', lastName: '', email: '', dob: '', gender: '', phone: '', city: '', country: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // ➡️ Corrected URL matching the backend route configuration
      const response = await fetch(`${API_BASE_URL}/api/auth/users`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob || '',
      gender: user.gender,
      phone: user.phone,
      city: user.city || '',
      country: user.country || ''
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveSubmit = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        alert('Updated inline successfully!');
        setEditingId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member profile permanently?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== id));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header-block">
          <h1 className="dashboard-title">Member Portal Directory</h1>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>

        <div className="table-responsive-wrapper">
          <table className="directory-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>City</th>
                <th>Country</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={editingId === user._id ? 'row-editing' : ''}>
                  {editingId === user._id ? (
                    <>
                      <td><input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td><input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td><input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td><input type="date" name="dob" value={editFormData.dob} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td>{user.age} <span className="auto-span">(calc)</span></td>
                      <td>
                        <select name="gender" value={editFormData.gender} onChange={handleEditFormChange} className="inline-select">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td><input type="text" name="phone" value={editFormData.phone} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td><input type="text" name="city" value={editFormData.city} onChange={handleEditFormChange} className="inline-input" /></td>
                      <td>
                        <select name="country" value={editFormData.country} onChange={handleEditFormChange} className="inline-select">
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                          <option value="China">China</option>
                          <option value="Brazil">Brazil</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Mexico">Mexico</option>
          
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button onClick={() => handleSaveSubmit(user._id)} className="action-btn save-btn">Save</button>
                          <button onClick={() => setEditingId(null)} className="action-btn cancel-btn">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.dob}</td>
                      <td>{user.age}</td>
                      <td>{user.gender}</td>
                      <td>{user.phone}</td>
                      <td>{user.city}</td>
                      <td>{user.country}</td>
                      <td>
                        <div className="action-buttons-group">
                          <button onClick={() => handleEditClick(user)} className="action-btn edit-btn">Edit</button>
                          <button onClick={() => handleDelete(user._id)} className="action-btn delete-btn">Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="10" className="no-data-text">No members registered yet. Fill out the registration form first.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

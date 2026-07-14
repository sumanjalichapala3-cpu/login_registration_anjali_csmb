import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './registration/registration';
import Login from './login/login';
import Dashboard from './dashboard/dashboard';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;

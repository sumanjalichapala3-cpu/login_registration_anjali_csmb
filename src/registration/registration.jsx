import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const API_BASE_URL = 'https://login-registration-backend01.onrender.com';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    country: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dob') {
      if (!value) {
        setFormData(prev => ({ ...prev, dob: '', age: '' }));
        return;
      }
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setFormData(prev => ({ ...prev, dob: value, age: calculatedAge >= 0 ? calculatedAge : 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the Terms and Privacy Policy to continue.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('isAuthenticated', 'true');
          alert('User registered successfully!');
          navigate('/dashboard');
        } else {
          alert('Registration successful. Please log in.');
          navigate('/login');
        }
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Could not establish contact with backend server.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="vertical-form-flow">
          <div className="input-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label>Date of Birth</label>
            <div className="icon-input-wrapper">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              <div className="input-icon-pointer">
                {/* Custom Calendar Icon SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Calculated Age</label>
            <input type="number" name="age" value={formData.age} readOnly placeholder="Auto-calculated from DOB" className="disabled-age-input" />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              <label className="radio-label"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} required /><span>Male</span></label>
              <label className="radio-label"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} required /><span>Female</span></label>
              <label className="radio-label"><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} required /><span>Other</span></label>
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="icon-input-wrapper">
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                {/* Interactive Eye Icon SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={showPassword ? "#4f46e5" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="icon-input-wrapper">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {/* Interactive Eye Icon SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={showConfirmPassword ? "#4f46e5" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Country</label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="" disabled>Select your country</option>
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
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the <span>Terms and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" className="register-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;


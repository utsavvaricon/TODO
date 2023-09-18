import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      });

      if (response.ok) {
        // Registration successful, you might want to handle this accordingly
        navigate('/login'); // Redirect to the login page
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred during registration.');
    }
  };

  return (
    <section className="row d-flex justify-content-center align-items-center pt-4"> 
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          {/* Pills navs */}
          <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="tab-login" data-mdb-toggle="pill" href="/login" role="tab"
                aria-controls="pills-login" aria-selected="true">Login</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link active" id="tab-register" data-mdb-toggle="pill" href="/register" role="tab"
                aria-controls="pills-register" aria-selected="false">Register</a>
            </li>
          </ul>
          {/* Pills navs */}

          {/* Pills content */}
          <div className="tab-content">
            <div className="tab-pane fade show active" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
              <form>
                {/* Email input */}
                <div className="form-outline mb-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                  <label className="form-label">Email</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-4">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                  <label className="form-label">Password</label>
                </div>

                {/* First Name input */}
                <div className="form-outline mb-4">
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" />
                  <label className="form-label">First Name</label>
                </div>

                {/* Last Name input */}
                <div className="form-outline mb-4">
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" />
                  <label className="form-label">Last Name</label>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary btn-block mb-4" onClick={handleRegister}>Register</button>

            
              </form>
            </div>
          </div>
        </div>
    </section>
  );
}

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const access_token = data.access;
        const refresh_token = data.refresh;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login.');
    }
  };

  return (
      <section className="row d-flex justify-content-center align-items-center pt-5"> 
              <div className="col-md-8 col-lg-12 col-xl-4 offset-xl-1">
          {/* Pills navs */}
          <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link active" id="tab-login" data-mdb-toggle="pill" href="/login" role="tab"
                aria-controls="pills-login" aria-selected="true">Login</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="tab-register" data-mdb-toggle="pill" href="/register" role="tab"
                aria-controls="pills-register" aria-selected="false">Register</a>
            </li>
          </ul>
          {/* Pills navs */}

          {/* Pills content */}
          <div className="tab-content">
            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
              <form>


                {/* Email input */}
                <div className="form-outline mb-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="loginName" className="form-control" />
                  <label className="form-label">Email</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-4">
                  <input type="password" value={password}onChange={(e) => setPassword(e.target.value)} id="loginPassword" className="form-control" />
                  <label className="form-label">Password</label>
                </div>

                {/* 2 column grid layout */}
                <div className="row mb-4">
                  <div className="col-md-6 d-flex justify-content-center">
                    {/* Checkbox */}
                    <div className="form-check mb-3 mb-md-0">
                      <input className="form-check-input" type="checkbox" value="" id="loginCheck" checked />
                      <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                    </div>
                  </div>

                  <div className="col-md-6 d-flex justify-content-center">
                    {/* Simple link */}
                    <a href="#!">Forgot password?</a>
                  </div>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary btn-block mb-4" onClick={handleLogin}>Sign in</button>

    
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Login;

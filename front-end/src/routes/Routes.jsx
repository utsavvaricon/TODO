import React from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from '../components/Login';
import HomePage from '../components/HomePage';
import Register from '../components/Register';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/home" component={HomePage} />
        <Route path="/register" component={Register} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default Routes;

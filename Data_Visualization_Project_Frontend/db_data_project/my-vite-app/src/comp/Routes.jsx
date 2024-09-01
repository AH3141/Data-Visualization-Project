// src/comp/Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { TablePage } from '../pages/TablePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ArchitectPage } from '../pages/ArchitectPage';

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/TablePage" />
        </Route>
        <Route path="/ArchitectPage" exact>
          <ArchitectPage />
        </Route>
        <Route path="/TablePage" exact>
          <TablePage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};


import React from 'react';
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Index from './page/index/index';
import {Callback} from './page/callback/index'

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Index/>
          </Route>
          <Route path="/callback" exact>
            <Callback/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;

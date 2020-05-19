import React from "react";
import { render } from "react-dom";
import { Router, Redirect } from "@reach/router";

import App from "./views/App";
import Home from "./views/Home";
import Layout from "./components/Layout";

import * as serviceWorker from "./serviceWorker";
import "./scss/index.scss";

const routes = [
  { path: "/home", name: "Home", Component: Home },
  { path: "/app", name: "Test", Component: App },
];
const menuRoutes = routes.map(({ path, name }) => ({ path, name }));

render(
  <React.StrictMode>
    <Router>
      <Redirect from="/" to="home" />
      {routes.map(({ Component, path }) => (
        <Layout key={path} path={path} routes={menuRoutes}>
          <Component path="/" />
        </Layout>
      ))}
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

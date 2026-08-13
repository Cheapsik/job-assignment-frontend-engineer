import React from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import AuthorImage from "./AuthorImage";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { user, loading } = useAuth();

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/">
                Home
              </NavLink>
            </li>
            {!loading &&
              (user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/editor">
                      <i className="ion-compose" />
                      &nbsp;New Article
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/settings">
                      <i className="ion-gear-a" />
                      &nbsp;Settings
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to={`/profile/${user.username}`}>
                      <AuthorImage src={user.image} alt={user.username} className="user-pic" />
                      &nbsp;{user.username}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/logout">
                      Log out
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/login">
                      Sign in
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/register">
                      Sign up
                    </NavLink>
                  </li>
                </>
              ))}
          </ul>
        </div>
      </nav>
      {children}
      <footer>
        <div className="container">
          <Link to="/" className="logo-font">
            conduit
          </Link>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}

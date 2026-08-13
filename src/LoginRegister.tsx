import { FormEvent, useState } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";

import { ApiError } from "./api/client";
import { useAuth } from "./auth/AuthContext";
import Layout from "./components/Layout";

export default function LoginRegister(): JSX.Element {
  const { user, login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Redirect to="/" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isRegister) {
      return;
    }

    setSubmitting(true);
    setErrors([]);
    try {
      await login(email, password);
      history.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.messages());
      } else {
        setErrors(["Could not log in."]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">{isRegister ? "Sign up" : "Sign in"}</h1>
              <p className="text-xs-center">
                {isRegister ? <Link to="/login">Have an account?</Link> : <Link to="/register">Need an account?</Link>}
              </p>

              {errors.length > 0 && (
                <ul className="error-messages">
                  {errors.map(message => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}
              {isRegister && (
                <ul className="error-messages">
                  {/* TODO: Registration is explicitly out of scope, implement it later */}
                  <li>Registration is not part of this assignment. Please sign in.</li>
                </ul>
              )}

              <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required={!isRegister}
                    disabled={isRegister}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required={!isRegister}
                    disabled={isRegister}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" disabled={submitting || isRegister}>
                  {isRegister ? "Sign up" : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

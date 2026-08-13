import { Link } from "react-router-dom";

import Layout from "./components/Layout";

export default function Settings(): JSX.Element {
  return (
    <Layout>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>
              <p>Updating settings is outside the scope of this assignment.</p>
              <hr />
              <Link className="btn btn-outline-danger" to="/logout">
                Or click here to logout.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

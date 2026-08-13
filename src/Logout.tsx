import { useLayoutEffect } from "react";

import { useHistory } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";

export default function Logout(): null {
  const { logout } = useAuth();
  const history = useHistory();

  // useLayoutEffect runs before paint so we clear the session before any child assumes auth.
  // (Redirect during render + useEffect previously raced and could skip logout.)
  useLayoutEffect(() => {
    logout();
    history.replace("/");
  }, [logout, history]);

  return null;
}

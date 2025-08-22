import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Button from "@mui/material/Button";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";

import { setCredentials } from "./store/authSlice"; // adjust path

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({
        token,
        user: tokenData,
      }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Button variant="contained" color="primary" onClick={() => {logIn()}}>
        Login
        </Button>
      ) : (
        <div>
          <pre>{JSON.stringify(tokenData, null, 2)}</pre>
          <pre>{JSON.stringify(token, null, 2)}</pre>
        </div>
      )}
      
    </Router>
  );
}

export default App;

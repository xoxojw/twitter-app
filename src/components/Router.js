import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
        <>
          <Route path="/" element={<Home userObj={userObj} />} />
          <Route path="/profile" element={<Profile userObj={userObj} />} />
        </>
        ) : (
          <Route exact path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
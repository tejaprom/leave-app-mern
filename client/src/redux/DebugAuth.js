// components/DebugAuth.js
import React from "react";
import { useSelector } from "react-redux";

const DebugAuth = () => {
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("Redux Auth State vars:", { token, user, isAuthenticated });

  const authState = useSelector((state) => state.auth);
  console.log("🔍 Redux Auth State:", authState);
  return null;
};

export default DebugAuth;

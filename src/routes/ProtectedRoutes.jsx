import supabase from "@/config/supabase";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  
  const checkUser = async () => {
    return false
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log(user)
    if (error || !user) return false;

    return true;
  };

//   useEffect(() => {
//     if (checkUser) {
//     return
//     }
//   }, []);

  return checkUser ? <div>valid user</div>
: (
    <div>not valid</div>
)
};

export default ProtectedRoutes;

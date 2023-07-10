import { useRouter } from "next/router";
import React from "react";

const Login: React.FC = () => {
  const { push } = useRouter();
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <input type="text" placeholder="Username or Email Address" />
        <input type="password" placeholder="Password" />
        <button type="submit">Log in</button>
      </form>
      <p className="create-account">
        Don't have an account?{" "}
        <a onClick={() => push("/registration")}>Create New Account</a>
      </p>
    </div>
  );
};

export default Login;

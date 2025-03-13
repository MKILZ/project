import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabaseClient";
import { AppContext } from "../context/useAppContext";

export default function Login() {
  const { theme, setTheme, session } = useContext(AppContext);
  const [makingAccount, setMakingAccount] = useState(false);
  return (
    <div className="d-flex flex-column justify-content-center w-50 mx-auto my-5">
      {!makingAccount ? (
        <div>
          <h1 className="mb-3">Sign Up</h1>
          <SignUp />
        </div>
      ) : (
        <div>
          <h1 className="mb-3">Sign In</h1>
          <SignIn />
        </div>
      )}
      <div
        className="text-primary link-underline-primary pt-1"
        onClick={() => setMakingAccount(!makingAccount)}
      >
        {makingAccount ? "Dont have an account?" : "Already have an account?"}
      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function signUpNewUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });
    console.log(data, error);
  }

  return (
    <div className="d-flex flex-column gap-3">
      <input
        type="text"
        placeholder="email"
        className="form-control"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        type="password"
        className="form-control"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button
        className="btn btn-secondary"
        onClick={() => signUpNewUser(email, password)}
      >
        Sign In
      </button>
    </div>
  );
}

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function signUpNewUser(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });
    console.log(data, error);
  }

  return (
    <div className="d-flex flex-column gap-3">
      <input
        className="form-control"
        type="text"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        className="form-control"
        type="password"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button
        className="btn btn-secondary"
        onClick={() => signUpNewUser(email, password)}
      >
        Sign Up
      </button>
    </div>
  );
}

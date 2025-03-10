import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Button } from "@chakra-ui/react";
export default function Login() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div>
        <h1>Sign Up</h1>
        <SignUp />
        <h1>Sign In</h1>
        <SignIn />
      </div>
    );
  } else {
    return <div>Logged in!</div>;
  }
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
    <>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <Button onClick={() => signUpNewUser(email, password)} />
    </>
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
    <>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <Button onClick={() => signUpNewUser(email, password)} />
    </>
  );
}

import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [newAccount, setNewAccount] = useState(true);

  const toggleAccount = () => setNewAccount(prev => !prev);

  const onChange = (event) => {
    const {
      target: { name, value }
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // async/await, try/catch
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    }
    catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h2>트위터에 처음이세요?</h2>
      <span>이메일로 가입하기</span>
      <form onSubmit={onSubmit}>
        <input name="email"
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={onChange}
        />
        <input name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
        {error}
      </form>
      <div>
        <span>가입되어 있으신가요?</span>
        <Link onClick={toggleAccount}>
          {newAccount ? "Sign In" : "Create Account"}
        </Link>
      </div>
    </>
  )
}

export default AuthForm
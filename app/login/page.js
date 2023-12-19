"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white max-w-5xl m-auto py-2 rounded-xl flex flex-col items-center">
      <h1 className="text-lg p-2 font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="p-2">
        <div>
          <label htmlFor="email" className="pr-12 font-semibold">
            Email
          </label>
          <input
            className="p-2 w-full bg-[#E8EAEE] rounded-xl"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="pt-2">
          <label htmlFor="password" className="pr-6 font-semibold">
            Password
          </label>
          <input
            className="p-2 w-full bg-[#F2F4F8] rounded-xl"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="my-1" style={{ color: "red" }}>{error}</p>}
        <button className="w-full bg-black text-white font-semibold text-lg rounded-lg mt-6" type="submit">Login</button>
      </form>
      <p className="p-2">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="cursor-pointer font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
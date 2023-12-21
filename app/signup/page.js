"use client";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to login page or dashboard

      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });

      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-5xl m-auto py-2 rounded-xl flex flex-col items-center">
      <h1 className="text-lg p-2 font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="p-2">
        <div>
          <label htmlFor="name" className="pr-12 font-semibold">
            Name:
          </label>
          <input
            className="p-2 w-full bg-[#F2F4F8] rounded-xl"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email" className="pr-12 font-semibold">
            Email:
          </label>
          <input
            className="p-2 w-full bg-[#F2F4F8] rounded-xl"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="pt-2">
          <label htmlFor="password" className="pr-6 font-semibold">
            Password:
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
        <div className="flex items-center justify-center mt-2">
          {isLoading && <div className="loader "></div>}
        </div>

        {error && (
          <p className="my-1" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <button
          className="w-full bg-black text-white font-semibold text-lg rounded-lg mt-6"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link href="/login" className="cursor-pointer font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;

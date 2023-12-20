import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout, setUser } = UserAuth();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  console.log(user);
  return (
    <div className="flex justify-between items-center py-4 px-12">
      <Link href="/" className="text-2xl font-sans font-bold">
        favGiphy
      </Link>
      {/* {user ? (
        <p>Welcome, {user}</p>
      ) : (
        <div className="flex">
          <Link href="/login" className="px-4 cursor-pointer font-semibold">
            Login
          </Link>
          <Link href="/signup" className="px-4 cursor-pointer font-semibold">
            Signup
          </Link>
        </div>
      )} */}
      {loading ? (<div class="loader"></div>) : !user ? (
        <ul className="flex gap-4">
          <li onClick={() => router.push('/login')} className="cursor-pointer font-semibold bg-black text-white px-2 rounded-lg">
            Login
          </li>
          <li onClick={() => router.push('/signup')} className="cursor-pointer font-semibold bg-black text-white px-2 rounded-lg">
            Sign up
          </li>
        </ul>
      ) : (
        <div className="px-4 flex items-center gap-4">
          <p className="text-center">Welcome, {user.email}</p>
          <p className="cursor-pointer font-semibold bg-black text-white px-2 py-1 rounded-lg" onClick={handleSignOut}>
            Sign out
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;

import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function SignIn() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validatePassword(password, confirmPassword);
  }, [password, confirmPassword]);

  function validatePassword(pass, confirmPass) {
    setPassError(pass !== confirmPass);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      setPassError(true);
      setIsLoading(false);
      return;
    }

    let userData = { name, email, password };

    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center m-auto p-3">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" type="password" placeholder="***********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {passError && <p className="text-red-500 text-xs italic">Passwords do not match!</p>}
        </div>
        {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
        <div className="flex items-center justify-between">
          <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} type="submit" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p className="text-sm text-gray-600">
        Sudah punya akun? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}

export default SignIn;

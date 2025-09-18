"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewPasswordPage({ token }) {

  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }
  
  useEffect (() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const res = await fetch(`/api/resetPassword/${token}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full bg-blue-100">
      <div className="flex mt-10 flex-col justify-center items-center w-[400px] border border-amber-100 shadow-2xl h-[500px] rounded-2xl relative">
        
        {/* Curved Text Above Logo */}
        <svg viewBox="0 0 300 150" className="absolute top-2 w-[300px] h-[150px]">
          <path
            id="curve"
            d="M 50,140 A 100,100 0 0,1 250,140"
            fill="transparent"
          />
          <text fontSize="18" className="fill-black font-semibold">
            <textPath
              href="#curve"
              startOffset="50%"
              textAnchor="middle"
            >
              set New Password for your account
            </textPath>
          </text>
        </svg>

        {/* Logo */}
        <Image
          src="/image/logo.png"
          alt="iconlogo"
          width={124}
          height={124}
          className="rounded-full object-cover p-1 border-2 border-amber-300 relative top-0"
        />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center mt-12">
            <label htmlFor="password" className="relative bottom-1 right-16">
              New password
            </label>
            <div className="flex justify-start items-center border rounded-2xl focus-within:ring-blue-300 focus-within:ring-2 focus-within:border-none w-[300px]">
              <Image
                src="/image/padlock.png"
                alt="icon"
                height={24}
                width={24}
                className="m-2"
              />
              <input
                type={showPassword ? "text" : "password"}
                className="focus:outline-none w-full"
                id="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Image
                src={showPassword ? "/image/show.png" : "/image/hide.png"}
                alt="icon"
                width={24}
                height={24}
                onClick={togglePassword}
                className="mx-1 cursor-pointer"
              />
            </div>
            <button type="submit" className="mt-5 border-1 w-full h-10 rounded-2xl hover:bg-green-500 hover:text-white hover:border-none hover:scale-110 hover:font-bold">
              reset password
            </button>
          </div>
        </form>

        {message && <p className="text-green-500 shadow-emerald-50">{message}</p>}
      </div>
    </div>
  );
}

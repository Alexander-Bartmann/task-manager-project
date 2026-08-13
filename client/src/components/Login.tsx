import { useState } from "react";
import { API_URL } from "../config";

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const savedLogin = await response.json();
    onLogin(savedLogin.token);
  };
  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-sm
           focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-sm
           focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Passwort"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
           hover:bg-blue-700 cursor-pointer"
        >
          Login
        </button>
      </form>
    </>
  );
}

export default Login;

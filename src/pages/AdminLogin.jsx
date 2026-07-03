import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "../utils/storage";

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password === Storage.getMasterPassword()) {
      Storage.setSession("super");
      navigate("/admin");
    } else if (password === Storage.getAdminPassword()) {
      Storage.setSession("admin");
      navigate("/admin");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f172a] text-3xl">
            ⚙️
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500">Bindu Home Services</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/30"
          />

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md border border-[#f59e0b] bg-[#111] py-3 font-bold text-white transition-colors hover:bg-black"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Admin &amp; Super Admin access
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;

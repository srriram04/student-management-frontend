import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { GraduationCap, Hash, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function StudentLoginPage() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ CALL AUTH LOGIN (backend handled inside)
      const user = await login("student", rollNo, dob);

      // ✅ ROLE BASED REDIRECT (IMPORTANT FIX)
      if (user.role === "student") {
        navigate("/student");
      } else {
        navigate("/admin");
      }

    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border">
          <div className="p-10">

            {/* ICON */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center">
                <GraduationCap size={40} className="text-white" />
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Student Portal Login
              </h2>
              <p className="text-slate-500">
                Access your academic information
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ROLL NO */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">
                  Roll Number
                </label>

                <div className="relative">
                  <Hash
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl"
                    placeholder="Enter your roll number"
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">
                  Date of Birth
                </label>

                <div className="relative">
                  <Calendar
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex justify-center items-center"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign In as Student"
                )}
              </button>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentLoginPage;
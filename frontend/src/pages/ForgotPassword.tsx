import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Implement actual password reset logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-3 text-blue-500">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <p className="text-sm text-gray-400 text-center mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-green-500/10 p-4 text-center border border-green-500/20">
            <p className="text-green-500 font-medium">Check your email</p>
            <p className="text-sm text-green-500/80 mt-1">
              If an account exists for {email}, you will receive a reset link shortly.
            </p>
            <Link to="/login" className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300">
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              Send reset link
            </button>
            
            <p className="mt-6 text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

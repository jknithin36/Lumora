// src/pages/Login.jsx
import React, { useState } from "react";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const isSignIn = mode === "signin";
  const pwAuto = isSignIn ? "current-password" : "new-password";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    if (!isSignIn) {
      if ((payload.password || "") !== (payload.confirm || "")) {
        setError("Passwords do not match.");
        setSubmitting(false);
        return;
      }
      if (!payload.tos) {
        setError("Please accept the Terms to continue.");
        setSubmitting(false);
        return;
      }
    }

    try {
      console.log(isSignIn ? "SIGN IN" : "SIGN UP", payload);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid w-full md:grid-cols-2 min-h-[620px] md:h-[700px]">
      {/* Left image (hidden on mobile) */}
      <div className="relative hidden md:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Welcome"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignIn
                ? "Sign in to continue to Lumora."
                : "Join Lumora in seconds—just a few details."}
            </p>
          </div>

          {/* Google button — fixed marker dot */}
          <button
            type="button"
            className="w-full h-11 rounded-full bg-muted/60 border border-muted-foreground/30 backdrop-blur-sm shadow-sm hover:bg-muted transition inline-flex items-center justify-center gap-2 list-none [&::marker]:content-['']"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="Google"
              className="h-5 w-5"
              draggable="false"
            />
            <span className="text-sm">Continue with Google</span>
          </button>

          {/* Divider — single line text */}
          <div className="my-5 flex items-center">
            <div className="h-px w-full bg-muted-foreground/30" />
            <span className="px-3 text-xs text-muted-foreground whitespace-nowrap">
              or {isSignIn ? "sign in" : "sign up"} with email
            </span>
            <div className="h-px w-full bg-muted-foreground/30" />
          </div>

          {/* Name (signup only) — no icon */}
          {!isSignIn && (
            <label className="mb-3 block">
              <span className="sr-only">Full name</span>
              <div className="flex items-center h-12 rounded-2xl px-4 border border-muted-foreground/30 bg-bg/60 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/40 transition">
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>
          )}

          {/* Email — no icon */}
          <label className="mb-3 block">
            <span className="sr-only">Email</span>
            <div className="flex items-center h-12 rounded-2xl px-4 border border-muted-foreground/30 bg-bg/60 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/40 transition">
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>

          {/* Password — no icon, keep Show/Hide */}
          <label className="mb-3 block">
            <span className="sr-only">Password</span>
            <div className="flex items-center h-12 rounded-2xl px-4 border border-muted-foreground/30 bg-bg/60 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/40 transition">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="Password"
                autoComplete={pwAuto}
                minLength={6}
                required
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="ml-2 px-2 py-1 text-xs text-muted-foreground hover:text-fg rounded-md"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {/* Confirm password (signup only) — no icon */}
          {!isSignIn && (
            <label className="mb-1 block">
              <span className="sr-only">Confirm password</span>
              <div className="flex items-center h-12 rounded-2xl px-4 border border-muted-foreground/30 bg-bg/60 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/40 transition">
                <input
                  name="confirm"
                  type={showPw2 ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((s) => !s)}
                  className="ml-2 px-2 py-1 text-xs text-muted-foreground hover:text-fg rounded-md"
                  aria-label={showPw2 ? "Hide password" : "Show password"}
                >
                  {showPw2 ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          )}

          {/* Row: remember/forgot OR ToS */}
          {isSignIn ? (
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  className="h-4 w-4 rounded accent-primary"
                  type="checkbox"
                  name="remember"
                />
                Remember me
              </label>
              <a href="#" className="underline hover:opacity-90">
                Forgot password?
              </a>
            </div>
          ) : (
            <label className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                className="h-4 w-4 rounded accent-primary"
                type="checkbox"
                name="tos"
              />
              I agree to the{" "}
              <a href="#" className="underline">
                Terms & Privacy
              </a>
            </label>
          )}

          {/* Error */}
          {error && (
            <div role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full h-11 rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
          >
            {submitting && (
              <span
                className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"
                aria-hidden
              />
            )}
            {isSignIn ? "Sign in" : "Create account"}
          </button>

          {/* Bottom switch only */}
          <p className="mt-4 text-sm text-muted-foreground text-center">
            {isSignIn ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-fg underline-offset-2 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-fg underline-offset-2 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

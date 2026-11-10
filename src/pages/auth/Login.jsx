import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";

function Login() {
  const { login, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(`/${result.user.role}/dashboard`, {
      replace: true
    });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-brand-symbol">S</span>

          <h1>Welcome back</h1>

          <p>Log in to continue to your StayEase account.</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <div className="auth-extra-links">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Log in
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-accounts">
          <h3>Demo accounts</h3>

          <p>
            Admin: admin@stayease.com / admin123
          </p>

          <p>
            Manager: manager@stayease.com / manager123
          </p>

          <p>
            Customer: customer@stayease.com / customer123
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
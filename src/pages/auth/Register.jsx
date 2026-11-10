import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";

function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(result.message);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-brand-symbol">S</span>

          <h1>Create your account</h1>

          <p>
            Join StayEase to find accommodation or manage properties.
          </p>
        </div>

        <ErrorMessage message={error} />

        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Select
            label="Account type"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: "customer", label: "Customer" },
              { value: "manager", label: "Property manager" }
            ]}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password again"
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Create account
          </Button>
        </form>

        {formData.role === "manager" && (
          <p className="form-note">
            Manager accounts require admin approval before login.
          </p>
        )}

        <p className="auth-switch">
          Already registered?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
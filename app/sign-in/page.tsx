"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { signInSchema } from "@/lib/schema";
import { z } from "zod";
import styles from "./signin.module.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const signIn = async () => {
    setGeneralError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setGeneralError(error.message);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signIn();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span>Flow Desk</span>
          </div>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your tasks</p>
        </div>

        {generalError && (
          <div className={`${styles.message} ${styles.errorMessage}`}>
            {generalError}
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={styles.input}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={styles.input}
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          <button 
            onClick={signIn} 
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className={styles.link}>
          <p>New user? <a href="/sign-up" className={styles.linkText}>Create an account</a></p>
        </div>
      </div>
    </div>
  );
}

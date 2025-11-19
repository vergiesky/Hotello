import React, { useState } from "react";
import styles from "./SignInPage.module.css";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signed in as " + form.email);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to StayScape</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            onChange={handleChange}
            value={form.email}
          />
        </label>

        <label className={styles.label}>
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
            value={form.password}
          />
        </label>

        <button type="submit" className={styles.button}>
          Sign In
        </button>

        <div className={styles.divider}>OR</div>

        <button type="button" className={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/images/branding/product/1x/google_favicon_32dp.png"
            alt="g"
          />
          Continue with Google
        </button>

        <p className={styles.switchText}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
}

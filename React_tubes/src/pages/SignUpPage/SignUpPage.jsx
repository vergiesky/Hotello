import React, { useState } from "react";
import styles from "./SignUpPage.module.css";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created for " + form.fullName);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to StayScape</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <span>Full Name</span>
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            className={styles.input}
            onChange={handleChange}
            value={form.fullName}
          />
        </label>

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
          <span>Phone Number</span>
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            className={styles.input}
            onChange={handleChange}
            value={form.phone}
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
          Sign Up
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
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </form>
    </div>
  );
}

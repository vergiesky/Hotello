import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: true,
  pauseOnHover: false,
  theme: "light",
};

export function ToastProvider() {
  return <ToastContainer {...toastConfig} />;
}

export const toastSuccess = (msg) => toast.success(msg, toastConfig);
export const toastInfo = (msg) => toast.info(msg, toastConfig);
export const toastError = (msg) => toast.error(msg, toastConfig);
export const toastWarn = (msg) => toast.warn(msg, toastConfig);

export { toast };
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form, FloatingLabel, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormLogin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({nama : "", password : ""});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (action) => {
        const { name, value } = action.target; // atribut name, dan valuenya apa
        setUser({...user, [name] : value}); // spread operator, copy seluruh isi object user
    };

    const handleSubmit = (action) => {
        action.preventDefault();

        if(user.nama === "" || user.password === "") {
            toast.error("Username dan Password harus di isi!");
            return;
        } else {
            const newUser = {
                ...user,
                loginAt: new Date(),
            };
            localStorage.setItem("nama", JSON.stringify(newUser));
            toast.success("Berhasil Login!");
            setTimeout(() => {
                navigate("/dashboard"); // tergantung route
            }, 1000);
        }
    };

    const passwordVisibility = () => {
        setShowPassword((current) => !current);
    };

    return (
        <form onSubmit={handleSubmit} action="">
            <Alert variant="info">
                <strong>Info!</strong> Username dan password harus di isi
            </Alert>
            <FloatingLabel controlId="inputNama" label="Username" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Masukkan Nama Anda"
                    name="nama"
                    onChange={handleChange}
                />
            </FloatingLabel>
            <FloatingLabel controlId="inputPassword" label="Password" className="mb-3" style={{ position: "relative" }}>
                <Form.Control
                    type={showPassword ? "text" : "password"} // Tampilkan atau sembunyikan password
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    autoComplete="off"
                />
                <span
                    onClick={passwordVisibility}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="mt-3 w-100">Login</Button>
        </form>
    );
};

export default FormLogin;
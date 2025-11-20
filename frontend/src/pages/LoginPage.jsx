import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormLogin from "../components/FormLogin";

const LoginPage = () => {

    const navigate = useNavigate();

    const [user] = useState(() => localStorage.getItem("nama"));

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    return (
        <Container className="mt-5">
            <h1 className="text-center display-4">
                <strong>Selamat datang!</strong>
            </h1>
            <p className="text-center lead">Halaman Login</p>
            <hr className="featurette-divider" />
            <FormLogin />
        </Container>
    );
};

export default LoginPage;
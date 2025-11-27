import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Container, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
    const navigate = useNavigate(); // untuk mengatur navigasi, perpindahan halaman
    
    // jika belum login, pengguna akan di arahkan ke halaman login
    const [user] = useState(() => JSON.parse(localStorage.getItem("nama")));
    // localStorage hanya perlu dibaca sekali

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const formatDate = (date) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };
        return new Date(date).toLocaleDateString("id-ID", options);
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-3 border-bottom fw-bold">Dashboard</h1>
            <Row className="mb-4">
                <Col md={10}>
                    <Card className="h-100 justify-content-center">
                        <Card.Body>
                            <h4>Selamat datang,</h4>
                            <h1 className="fw-bold display-6 mb-3">{user?.nama}</h1>
                            <p className="mb-0">Kamu sudah login sejak:</p>
                            <p className="fw-bold lead mb-0">{formatDate(user?.loginAt)}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
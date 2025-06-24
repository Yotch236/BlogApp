import { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Register() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (userName !== "" && email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [userName, email, password]);

  function registerUser(e) {
    e.preventDefault();

    fetch(`https://blogappapi-jlly.onrender.com/users/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        email: email,
        password: password
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Registered successfully") {
          setUserName("");
          setEmail("");
          setPassword("");

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registration Successful!",
            showConfirmButton: false,
            timer: 1500,
          });

          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message || "Something went wrong.",
          });
        }
      });
  }

  return (
    user.id !== null ? (
      <Navigate to="/" />
    ) : (
      <div id="wrapper" className="d-flex justify-content-center align-items-center m-0 p-0 vh-100">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <div className="p-4 shadow rounded bg-white">
                <Form onSubmit={registerUser}>
                  <h1 className="my-5 text-center">Register</h1>

                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Username"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mb-3"
                    />
                  </Form.Group>

                  {isActive ? (
                    <Button type="submit" className="custom-button-bg w-100 mt-3">
                      Register
                    </Button>
                  ) : (
                    <Button variant="danger" type="submit" className="w-100 mt-3" disabled>
                      Register
                    </Button>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  );
}

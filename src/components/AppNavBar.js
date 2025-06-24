import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import '../index.css';

export default function AppNavBar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-success">
      <Container>
        <Navbar.Brand href="/" className="fw-bold text-light">Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className="text-light fw-semibold" as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link className="text-light fw-semibold" as={NavLink} to="/blogs" end>Blogs</Nav.Link>
          </Nav>
          <Nav className="ms-3">
            {user.id !== null ? (
              <Nav.Link className="text-white fw-bold" as={NavLink} to="/logout" end>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link className="text-white fw-bold" as={NavLink} to="/login" end>Login</Nav.Link>
                <Nav.Link className="text-white fw-bold" as={NavLink} to="/register" end>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

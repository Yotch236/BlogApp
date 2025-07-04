import {useState, useEffect, useContext} from 'react';
import {Row,Col,Container,Form,Button} from 'react-bootstrap';
import {Navigate, useNavigate} from 'react-router-dom'; // Removed Link as it's not used
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2'; // Keep this one, remove the require below
import '../index.css';

export default function Login(){
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        // This useEffect now also updates isActive based on email and password presence
        if (email.length > 0 && password.length > 0) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]); // Depend on email and password changes


    function authenticate(e){
        e.preventDefault();
        fetch('https://blogappapi-jlly.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (!res.ok) { // Check for non-2xx status codes from the login endpoint
                return res.json().then(errorData => {
                    // Propagate the error with more details
                    throw new Error(errorData.message || "Login failed due to server error.");
                });
            }
            return res.json();
        })
        .then(data => {
            if(data.access !== undefined){
                console.log("Login successful, token:", data.access);
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access); // Pass the token to retrieve user details

                setEmail('');
                setPassword('');
            } else if (data.message === "Incorrect email or password" || data.message === "Incoorrect email or password") {
                // Corrected typo "Incoorrect" to "Incorrect" for robustness
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "Incorrect email or password. Please try again.",
                });
            } else {
                // Catch any other unexpected messages from the login endpoint
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.message || "An unexpected error occurred during login. Please try again later.",
                });
            }
        })
        .catch(error => {
            console.error("Authentication fetch error:", error);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: `Could not connect to the server for login. Error: ${error.message}`,
            });
        });
    }

    function retrieveUserDetails(token){
        fetch("https://blogappapi-jlly.onrender.com/users/details",{
            headers: {
                // THIS IS THE CRUCIAL CHANGE: ADD "Bearer " prefix
                Authorization: `Bearer ${token}` 
            }
        })
        .then(res => {
            if (!res.ok) { // Check for non-2xx status codes from the details endpoint
                console.error("HTTP error during user details retrieval:", res.status, res.statusText);
                return res.json().then(errorData => {
                    // Propagate the error with more details
                    throw new Error(errorData.message || "Failed to fetch user details with non-OK status");
                });
            }
            return res.json();
        })
        .then(data => {
            // Log the received data to inspect its structure
            console.log("User details received:", data); 
            if(data._id){
                Swal.fire({
                    icon: "success",
                    title: `Welcome, ${data.firstName || 'User'}`, // Added fallback for firstName
                    showConfirmButton: false,
                    timer: 1500
                });

                setUser({id: data._id, isAdmin: data.isAdmin});

                setTimeout(() => navigate("/blogs"), 500);
            } else {
                // This block is hit if the backend returns a 200 OK but data._id is missing
                console.error("User details response missing _id:", data);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to retrieve user details: User ID not found in response.",
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error fetching user details: ${error.message || "An unknown network error occurred"}`,
            });
        });
    }

    useEffect(() => {
        if(user.id !== null){
            navigate("/blogs");
        }
    },[user, navigate]);

    return(
        (user.id !== null) ?
           <Navigate to = "/blogs" />
        :
        <div id="wrapper" className="d-flex justify-content-center align-items-center m-0 p-0 vh-100">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} lg={4}>
                        <div className="p-4 shadow rounded bg-white">
                            <Form onSubmit={(e) => authenticate(e)}>
                                <h1 className="my-5 text-center">Login</h1>
                                <Form.Group>
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter email" 
                                        required
                                        value={email}
                                        className="mb-3"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                
                                { isActive ? 
                                    <Button type="submit" id="loginBtn" className="custom-button-bg w-100 mt-3">
                                        Login
                                    </Button>
                                    : 
                                    <Button variant="danger" type="submit" id="loginBtn" className="w-100 mt-3" disabled>
                                        Login
                                    </Button>
                                }
                                {/* You might want to add a link to registration here */}
                                {/* <p className="text-center mt-3">Don't have an account? <Link to="/register">Register here</Link></p> */}
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>     
    );
}
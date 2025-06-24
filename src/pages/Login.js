import {useState, useEffect, useContext} from 'react';
import {Row,Col,Container,Form,Button} from 'react-bootstrap';
import {Navigate, Link, useNavigate} from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import '../index.css';

export default function Login(){
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const Swal = require('sweetalert2');
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

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
        .then(res => res.json())
        .then(data =>{
            if(data.access !== undefined){
                console.log(data.access);
                localStorage.setItem('token', data.access)

                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');
            }else if(data.message === "Incoorrect email or password"){
                alert("Incorrect email or password");
            }else{
                alert(`${email} doest not exist`);
            }
        })
    }

    function retrieveUserDetails(token){
        fetch("https://blogappapi-jlly.onrender.com/users/details",{
            headers: {Authorization: `${token}`}
        })
        .then(res => res.json())
        .then(data => {
            if(data._id){
                Swal.fire({
                    icon: "success",
                    title: `Welcone, ${data.firstName}`,
                    showConfirmButton: false,
                    timer: 1500
                });

                setUser({id: data._id, isAdmin: data.isAdmin});

                setTimeout(() => navigate("/blogs"), 500);
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to retrieve user details",
                });
            }
        })
        .catch(() => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error fetching user details",
            });
        });
    }
    useEffect(() => {
        if(user.id !== null){
            navigate("/blogs");
        }
    },[user, navigate]);

    return(

        (user.id !== null)?
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
                    </Form>
                </div>
            </Col>
        </Row>

    </Container>
	    </div>    
    )
}
import {  Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to  AFAM Blog App</h1>
                <p>Create, Read, Update and Delete Blogs</p>
                <Link className="btn btn-primary" to={"/blogs"}>Check your blogs</Link>
            </Col>
        </Row>
    )
}
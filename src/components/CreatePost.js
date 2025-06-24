import { useState, useContext } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import UserContext from "../context/UserContext";

import Swal from "sweetalert2";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; 

export default function CreatePost({ fetchData }) {

  const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  ripple: true,
  dismissible: true
  });

  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://blogappapi-jlly.onrender.com/blogs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Post created successfully!",
          icon: "success",
          confirmButtonText: "OK"
        });

        setTitle("");
        setContent("");
        fetchData(); // ✅ Fetch the updated blog list after posting
      } else {
        notyf.error(data.message || "Failed to create post");
      }
    } catch (err) {

    }
  };

  return (
    <Container className="my-4">
      <h2>Create a New Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </Container>
  );
}
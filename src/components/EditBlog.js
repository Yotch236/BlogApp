import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { Notyf } from "notyf";
import Swal from "sweetalert2";

export default function EditPost({ blog, fetchData }) {
  const [postId] = useState(blog._id);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [showEdit, setShowEdit] = useState(false);

  const notyf = new Notyf();

  const openEdit = () => {
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    // Reset fields to original values instead of empty
    setTitle(blog.title);
    setContent(blog.content);
  };

  function editPost(e) {
    e.preventDefault(); // Prevent default form submission

    fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          Swal.fire("Success!", "Post updated successfully!", "success");
          closeEdit();
          fetchData();
        } else {
          notyf.error("Failed to update post");
        }
      })
      .catch(() => notyf.error("An error occurred while updating the post"));
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={openEdit}>
        Edit
      </Button>

      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={editPost}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="postContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
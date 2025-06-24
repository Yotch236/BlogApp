import { useState, useEffect, useContext } from "react";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import Swal from "sweetalert2";
import UserContext from "../context/UserContext";

export default function PostDetails() {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: true,
  });

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // Store comments
  const [newComment, setNewComment] = useState(""); // Handle new comment input
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);


  // Fetch post details & comments on load
  useEffect(() => {
    fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
          console.log("Fetched Comments:", data.comments); // Debugging line
          setComments(data.comments || []); // Store comments if they exist
        } else {
          notyf.error("Post not found");
          navigate("/blogs");
        }
      })
      .catch(() => {
        notyf.error("Failed to fetch post details");
      });
  }, [postId, navigate]);

  // Edit post
  function editPost() {
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
          setPost(data);
          setIsEditing(false);
          Swal.fire("Success!", "Post updated successfully!", "success");
        } else {
          notyf.error("Failed to update post");
        }
      })
      .catch(() => notyf.error("An error occurred while updating the post"));
  }


  // Delete post
  function deletePost() {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Post successfully deleted") {
              Swal.fire("Deleted!", "The post has been deleted.", "success");
              navigate("/blogs");
            } else {
              notyf.error("Failed to delete post");
            }
          })
          .catch(() => notyf.error("An error occurred while deleting the post"));
      }
    });
  }

  // Add new comment
  function addComment() {
    if (!newComment.trim()) {
      notyf.error("Comment cannot be empty");
      return;
    }

    fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}/comment`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    comment: newComment, // Ensure this contains valid text
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.error) {
      console.error("Error:", data.error);
    } else {
      setComments(data.comments); // Update state with the full comments list
      setNewComment(""); // Clear input field
    }
})
  .catch((error) => console.error("Fetch error:", error));

  }

  // Delete comment (only by author)
  function deleteComment(commentId) {
    Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}/deletecomment/${commentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Comment successfully deleted") {
              setComments(comments.filter((comment) => comment._id !== commentId)); // Remove from state
              Swal.fire("Deleted!", "The comment has been deleted.", "success");
            } else {
              notyf.error("Failed to delete comment");
            }
          })
          .catch(() => notyf.error("An error occurred while deleting the comment"));
      }
    });
  }
  

  function backToBlogs(){
    navigate("/blogs");
  }

  if (!post) return <p className="text-center mt-5">Loading post...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
                  </Form.Group>
                  <Button variant="success" onClick={editPost} className="me-2">Save</Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                </Form>
              ) : (
                <>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                  <Card.Subtitle className="text-muted">Author: {post.author}</Card.Subtitle>
                  {user && (
                    <>
                      <Button variant="primary" className="me-2 mt-3" onClick={() => setIsEditing(true)}>Edit</Button>
                      <Button variant="danger" className="mt-3" onClick={deletePost}>Delete</Button>
                    </>
                  )}
                  <h5 className="mt-4">Comments</h5>
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <div key={c._id} className="border p-2 mb-2 rounded">
                        <strong>{c.user}</strong>: <br /> {c.comment} <br />
                        <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
                        {user && user.id === c.user && (
                          <div className="mt-2">
                  <Button variant="danger" size="sm" className="ms-2" onClick={() => deleteComment(c._id)}>
                    Delete
                  </Button>
                  </div>
                )} {console.log("User:", user, "Comment:", c)}
                      </div>
                    ))
                  ) : (
                    <p>No comments found.</p>
                  )}
                  {user && (
                    <>
                      <Form.Control as="textarea" rows={2} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
                      <Button className="mt-2" onClick={addComment}>Post Comment</Button>
                      <div className="mt-5">
                      <Button variant="primary" onClick={backToBlogs}>Back to Blogs</Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
import { useState, useCallback } from "react";
import { Button } from "react-bootstrap";
import { Notyf } from "notyf";
import Swal from "sweetalert2";

export default function DeletePost({ blog, fetchData }) {
  const notyf = new Notyf();
  const [postId] = useState(blog._id);

  const deleteToggle = useCallback(() => {
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
        const token = localStorage.getItem("token");

        if (!token) {
          notyf.error("Unauthorized: Please log in again.");
          return;
        }

        fetch(`https://blogappapi-jlly.onrender.com/blogs/${postId}/delete`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Post successfully deleted") {
              Swal.fire("Deleted!", "The post has been deleted.", "success");
              fetchData(); // Refresh the blog list
            } else {
              notyf.error(data.error || "Failed to delete post");
            }
          })
          .catch(() => notyf.error("An error occurred while deleting the post"));
      }
    });
  }, [postId, fetchData]);

  return (
    <Button variant="danger" size="sm" onClick={deleteToggle}>
      Delete
    </Button>
  );
}
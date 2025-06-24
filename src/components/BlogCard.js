import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function BlogCard({ blogProp }) {
  const { user } = useContext(UserContext);

  if (!blogProp) {
    return null;
  }

  const { _id, title, content, author, createdAt } = blogProp;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Card.Text>User: {author}</Card.Text>
        <Card.Text>{new Date(createdAt).toLocaleString()}</Card.Text>
        <Link className="btn btn-primary mt-auto" to={user.id ? `/blogs/${_id}` : "/login"}>
          {user.id ? "Read more" : "Log in"}
        </Link>
      </Card.Body>
    </Card>
  );
}
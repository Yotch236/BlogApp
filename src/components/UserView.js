import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BlogCard from './BlogCard';
import CreatePost from './CreatePost';
import UserContext from '../context/UserContext'; 

export default function Userview({ blogData, fetchData }) {
  const { user } = useContext(UserContext); 
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log(blogData);

    const blogArr = blogData.map((blog) => {
      if (blog._id) {
        return (
          <Col xs={12} className="mb-2" key={blog._id}>
            <BlogCard blogProp={blog} />
          </Col>
        );
      } else {
        return null;
      }
    });

    setBlogs(blogArr);
  }, [blogData]);

  return (
    <>
      <h1 className="text-center my-5">All blogs</h1>
      

      {user.id && <CreatePost fetchData={fetchData} />}

      <Container className="my-5" fluid>
        <Row className="g-4">
          {blogData.map((blog) => (
            <Col xs={12} className="mb-2" key={blog._id}>
              <BlogCard blogProp={blog} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
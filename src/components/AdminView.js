import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import EditBlog from './EditBlog'
import DeletePost from './DeletePost'


export default function AdminView({ blogData, fetchData }) {

	const [blogs, setBlogs] = useState([])

	useEffect(() => {
		console.log("Received blogData:", blogData);

		const blogArr = blogData.map(blog => {
			return (
				<tr key={blog._id}>
                    <td>{blog._id}</td>
                    <td>{blog.title}</td>
                    <td>{blog.content}</td>
                    <td>{blog.author}</td>
                    <td> <EditBlog blog={blog} fetchData={fetchData} /> </td>
                     <td><DeletePost blog={blog} fetchData={fetchData}/></td>
                </tr>
			)
		})

		setBlogs(blogArr)

	}, [blogData, fetchData])

	return (
		<>
            <h1 className="text-center my-4"> Admin Dashboard</h1>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Title</th>
                        <th>content</th>
                        <th>author</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {blogs}
                </tbody>
            </Table>    
        </>


	)
}
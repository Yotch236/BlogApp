
import { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';

export default function Blogs() {
    const { user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);

    const fetchData = useCallback(async () => {
    try {
        const res = await fetch("https://blogappapi-jlly.onrender.com/blogs/all", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        console.log("API Response:", data); 

        if (Array.isArray(data)) {
            // Sort blogs from latest to oldest based on createdAt
            const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBlogs(sortedBlogs);
        } else {
            setBlogs([]);
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}, []);




    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    return (
        user.isAdmin
        ?    <AdminView blogData={blogs} fetchData={fetchData} />
        :    <UserView blogData={blogs} />
    );
}

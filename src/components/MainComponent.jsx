import React, {useEffect, useState} from 'react';
import axios from "axios";
import AuthModalComponent from "./AuthModalComponent.jsx";

const MainComponent = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_name: '',
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/posts')
            .then(response => {
                setPosts(response.data);
                const uniqueCategories = [...new Set(response.data.map(post => post.category.name))];
                setCategories(uniqueCategories);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logout successful');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:5000/posts', formData, {
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                setPosts([...posts, { ...response.data, category: { name: formData.category_name } }]);
                setFormData({title: '', content: '', category_name: ''});
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    }

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || post.category.name === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <h1>LAB2_BLOG</h1>
            <div className="buttons">
                <button onClick={() => setIsAuthOpen(true)}>Open Auth Modal</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            {isAuthOpen && (
                <AuthModalComponent isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}/>
            )}
            <hr/>
            <h2>Posts</h2>
            <div className="post-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />
                    <input
                        type="text"
                        name="category_name"
                        value={formData.category_name}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Content"
                        required
                    />
                    <button type="submit">Create Post</button>
                </form>
            </div>
            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />

                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="category-filter"
                >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <table className="posts-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Content</th>
                    <th>Created At</th>
                </tr>
                </thead>
                <tbody>
                {filteredPosts.map(post => (
                    <tr key={post.post_id}>
                        <td>{post.title}</td>
                        <td>{post.category.name}</td>
                        <td>{post.content}</td>
                        <td>{new Date(post.created_at).toLocaleString()}</td>
                        <td><a href={`/posts/${post.post_id}`}>View</a></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainComponent;
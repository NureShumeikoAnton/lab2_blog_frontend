import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

const PostDetailsComponent = () => {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [formData, setFormData] = useState({
        content: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/posts/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/comments/${id}`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, []);

    const handleAddComment = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const commentData = {
            content: formData.content,
            post_id: id,
        };
        axios.post('http://localhost:5000/comments', commentData, {
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                window.location.reload();
                e.target.reset();
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
    }
    return (
        <div className={'post-details-page'}>
            {post ? (
                <div>
                    <Link to={'/'}>Back</Link>
                    <h1>{post.title}</h1>
                    <h2>Category: {post.category.name}</h2>
                    <hr/>
                    <h3>Content:</h3>
                    <p>{post.content}</p>
                    <h3>Author: {post.user.login}</h3>
                    <h3>Created at: {new Date(post.created_at).toLocaleString()}</h3>
                    <hr/>
                    <h3>Comments:</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.comment_id}>
                                    <p><strong>{comment.user.login}:</strong> {comment.content}</p>
                                    <p><em>Posted at: {new Date(comment.created_at).toLocaleString()}</em></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments available.</p>
                    )}
                    <h3>Add a Comment:</h3>
                    <form onSubmit={handleAddComment} className={'add-comment-form'}>
                        <textarea
                            placeholder="Write your comment here..."
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            name="content"
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>Loading...</h1>
                </div>
            )}
        </div>
    );
};

export default PostDetailsComponent;
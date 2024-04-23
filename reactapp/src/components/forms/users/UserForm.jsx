import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';

const UserForm = ({ userId }) => {
    const [user, setUser] = useState({ name: '', email: '', role: '' });

    useEffect(() => {
        if (userId) {
            axios.get(`https://api.example.com/users/${userId}`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                });
        }
    }, [userId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    
    const handleSubmit = e => {
        e.preventDefault();
        if (userId) {
            axios.put(`https://api.example.com/users/${userId}`, user)
                .then(response => {
                    console.log('User updated:', response.data);
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                });
        } else {
            axios.post('https://api.example.com/users', user)
                .then(response => {
                    console.log('User created:', response.data);
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                });
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={user.name} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={user.email} onChange={handleChange} />
            </label>
            <label>
                Role:
                <select name="role" value={user.role} onChange={handleChange}>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </label>
            <button type="submit">{userId ? 'Update' : 'Create'} User</button>
        </form>
    );
};

export default UserForm;
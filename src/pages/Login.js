import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

import logo from '../assets/logo.png';

import api from '../services/api';

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/register', {
            username,
        });

        const { _id } = response.data;

        console.log(response);

        history.push(`/user/${_id}`);
    }

    return (
        <div className="login-container">
            <Link>
                <img src={logo} alt="Tindev"/>
            </Link>
            
            <form onSubmit={handleSubmit}>
                <input placeholder="Insira seu Login"
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

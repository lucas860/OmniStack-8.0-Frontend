import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
    const [users, setUsers] = useState([]);
    const [matchUser, setMatchUser] = useState(null);
    
    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/users', {
                headers: {
                    user: match.params.id,
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', user => {
            setMatchUser(user);
        });

        /*socket.on('world', message => {
            console.log(message);
        });

        setTimeout(() => {
            socket.emit('hello', {
                message: 'Hello World'
            })
        }, 3000);*/

    }, [match.params.id]);

    async function handleLike(id){
        await api.post(`/user/${id}/like`, null, {
            headers: { user: match.params.id },
        })

        setUsers(users.filter(user => user._id !== id ));
    }

    async function handleDislike(id){
        await api.post(`/user/${id}/dislike`, null, {
            headers: { user: match.params.id },
        })

        setUsers(users.filter(user => user._id !== id ));
    }
    
    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="logo"/>
            </Link>
            
            {users.length > 0 ? (
                <ul>
                    {users.map(user =>
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="like"/>
                                </button>

                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="dislike"/>
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            ) : (
                <div className="empty">Não existem cartazes :(</div>
            )}

            { matchUser && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match"/>

                    <img className="avatar" src={matchUser.avatar} alt=""/>
                    <strong>{matchUser.name}</strong>
                    <p>{matchUser.bio}</p>

                    <button type="button" onClick={() => setMatchUser(null)}>FECHAR</button>
                </div>
            )}
        </div>
    );
}
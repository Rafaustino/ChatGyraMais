import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

//Como cada elemento deve ter uma Key individual, tive alguns problemas ao colocar o mesmo id pra todos os elementos
//Usei esta biblioteca pra que gere id individual pra cada nova ensagem, com isso consegui renderizar as mensagens sem
//erro no console
import uuid from 'uuid/v4';

const myId = uuid();

const socket = io('http://localhost:8080');
socket.on('connect', () => console.log('Olha nós aí de novo'));

const Chat = () => {


    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');
    const [messages, setMessages] = useState([]);


    //Usar o UseEffect foi a parte onde tive mais dificuldade, para preencher o array qe contém as mensagens, o autor e o id
    useEffect ( () => 
    {
        const handleMessage = newInput => 
            setMessages([...messages, newInput]);
        socket.on('newMessage', handleMessage);
        return () => socket.off('newMessage', handleMessage);
    }, [messages])

    
    //Coloco o valor digitado na variáve message e user, utilizando o UseState
    const handleInput = event =>
        setMessage(event.target.value);
    
    const handleInputUser = event =>
        setUser(event.target.value);
    

    const handleForm = event =>
    {
        event.preventDefault();
        if (message.trim())
        {
            //envio os dados ao backend pra que o servidor posa repassar pra todas as páginas que estiverem utilizando 
            socket.emit('newMessage', {
                id :myId,
                message,
                user
            })

            //Faço o campo receber uma string vazia para que o usuário digite uma novva mensagem            
            setMessage('');
        }
    }

    return (
        <main className="container">
            <ul className="list">
                {

                    //Percorro o array de mensagens que contem as mensagens e autores e imprimo uma a uma
                    messages.map( m => (
                        <li key={m.id} className="list__item list__item--mine">
                        
                            <span className="message message--mine">{m.user} - {m.message}</span>
                        </li>
                    ))
                }
                
            </ul>
            <form className="form" onSubmit={handleForm}>

                <input className="form__field form__field--user" 
                placeholder="Type yor nickname"
                onChange = {handleInputUser}
                type="text"
                value = {user}/>

                <form className="form" >

                    <input className="form__field form__field--message" 
                    placeholder="Type yor message here"
                    onChange = {handleInput}
                    type="text"
                    value = {message}/> 
                </form>
            </form> 
                
        </main>
    )
}
export default Chat;
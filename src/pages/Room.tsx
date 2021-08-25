import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss';

import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

export function Room(){
    //os parametros da minha pagina vao ficar armazenados aqui e ja tipando ela para dizer quais parametros 
    //minha rota vai receber
    const params = useParams<RoomParams>();

    const [newQuestion, setNewQuestion] = useState('');
    const {user} = useAuth();
    const roomId = params.id;

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();

        if (newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            // se a pergunta ja esta com o destaque que o admin da
            isHighlighted: false,
            // Se a pergunta ja foi respondida
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        //limpando o campo apos a pergunta ser enviada
        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask logo" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
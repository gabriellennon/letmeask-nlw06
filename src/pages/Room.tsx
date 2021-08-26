import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss';

import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room(){
    //os parametros da minha pagina vao ficar armazenados aqui e ja tipando ela para dizer quais parametros 
    //minha rota vai receber
    const params = useParams<RoomParams>();

    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
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

    useEffect(() => {
        //buscando os daos das perguntas
        const roomRef = database.ref(`rooms/${roomId}`);
        
        //once eu escuto o evento apenas 1x, se voce varias eu colocaria apenas on
        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
            //retorna umarray com  outro array com chave e valor
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author:  value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        //toda vez que o id da sala mudar eu executo essa funcao novamente
    }, [roomId]);

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
                    <h1>Sala {title}</h1>
                    {/* Como nao tenho o else eu coloco so o if que é o && */}
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
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

                {JSON.stringify(questions)}
            </main>
        </div>
    )
}
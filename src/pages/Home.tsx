
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';
import { useHistory } from 'react-router-dom';

import '../styles/auth.scss';
import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home(){
    const history = useHistory();
    //recuperando o valor do contexto
    const { signWithGoogle, user } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        //se nao tiver autenticado
        if(!user){
            await signWithGoogle()
        }

        history.push('/rooms/new');
        
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        //pegando todos os dados dessa sala
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        //vendo se a sala existe - vendo se ela me retorna falso
        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content" >
                    <img src={logoImg} alt="Letmeask logo" />
                    <button className="create-room" onClick={handleCreateRoom} >
                        <img src={googleIconImage} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
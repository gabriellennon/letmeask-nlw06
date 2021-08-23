import { useContext } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';
import { useHistory } from 'react-router-dom';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import {auth, firebase} from '../services/firebase';
import { AuthContext } from '../App';

export function Home(){
    const history = useHistory();
    //recuperando o valor do contexto
    const { signWithGoogle, user } = useContext(AuthContext)

    async function handleCreateRoom(){
        //se nao tiver autenticado
        if(!user){
            await signWithGoogle()
        }

        history.push('/rooms/new');
        
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
                    <form>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
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
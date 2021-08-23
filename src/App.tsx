import { createContext, useState, useEffect } from 'react';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Route, BrowserRouter } from 'react-router-dom';
import { auth, firebase } from './services/firebase';

export const AuthContext = createContext({} as AuthContextoType);

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextoType = {
  user: User | undefined;
  signWithGoogle: () => Promise<void>;
}

function App() {
  const [user, setUser] = useState<User>();

  //parametros: qual funcao quero executar  e quando que eu quero
  //aqui nesse caso eu quero disparar a funcao sempre que o component for renderizado em tela 
  useEffect(() => {

    //monitorando no firebase e verificando se existia um login pre feito pelo usuario, e caso ele saia e volte tem as infos
    auth.onAuthStateChanged(user => {
      if(user){
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL){
          throw new Error("Missing informaion fromgoogle Account.");
          
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
  }, [])

  //fazendo aqui pois em varios lugares da minha aplicacao eu vou precisar faer login, entao pra facilitar
  //eu compartilho via contexto para minha aplicacao por completo a funcao de login, e ai so preciso ter ela em 1 lugar apenas
  async function signWithGoogle(){
     //autenticacao com o firebase firebase
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider)

    if(result.user){
      const { displayName, photoURL, uid } = result.user

      if(!displayName || !photoURL){
        throw new Error("Missing informaion fromgoogle Account.");
        
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
         
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signWithGoogle }}>
        <Route 
          path="/"
          component={Home}
          //falando que para acessar essa rota, o endereco precisa ser exatamente esse, que no caso é /
          exact
        />
        <Route 
          path="/rooms/new"
          component={NewRoom}
        />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;

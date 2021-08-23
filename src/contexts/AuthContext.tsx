import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from '../services/firebase';

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

type AuthContextProviderProps = {
    //quando eu passo por props um component, ele é do tipo reactnode
    children: ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    //parametros: qual funcao quero executar  e quando que eu quero
    //aqui nesse caso eu quero disparar a funcao sempre que o component for renderizado em tela 
    useEffect(() => {
  
      //monitorando no firebase e verificando se existia um login pre feito pelo usuario, e caso ele saia e volte tem as infos
      const unsubscribe = auth.onAuthStateChanged(user => {
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
  
      //tipo o ngOndestroy
      return () => {
        unsubscribe();
      }
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
        <AuthContext.Provider value={{ user, signWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}
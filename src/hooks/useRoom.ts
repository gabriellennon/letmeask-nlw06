import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function useRoom(roomId: string){
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

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

    return { questions, title }
}
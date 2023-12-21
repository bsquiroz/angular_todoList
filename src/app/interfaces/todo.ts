export interface Todo {
    id: string;
    title: string;
    desc: string;
    stateTodo: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
}

export type typeFilter =
    | 'all'
    | 'easy'
    | 'medium'
    | 'hard'
    | 'completed'
    | 'nocompleted';

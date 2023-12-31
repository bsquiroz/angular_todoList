import { Injectable } from '@angular/core';
import { Todo } from '../../interfaces/todo';

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    public todos: Todo[] = JSON.parse(localStorage.getItem('todos')!) || [];

    private updateLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    getTodos(): Todo[] {
        return this.todos;
    }

    getTodo(id: string): Todo | undefined {
        return this.todos.find((todo) => todo.id === id);
    }

    createTodo(todo: Todo) {
        this.todos.push(todo);
        this.updateLocalStorage();
    }

    updateTodo(id: string, todoUpdate: Todo) {
        this.todos = this.todos.map((todo) =>
            todo.id === id ? { ...todoUpdate } : todo
        );
        this.updateLocalStorage();
        return this.todos;
    }

    deleteTodo(id: string) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.updateLocalStorage();
        return this.todos;
    }

    completeStateTodo(id: string) {
        this.todos = this.todos.map((todo) =>
            todo.id === id ? { ...todo, stateTodo: !todo.stateTodo } : todo
        );
        this.updateLocalStorage();
        return this.todos;
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { TodosService } from './todosService.service';

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
    public todos: Todo[] = [];

    private todoService = inject(TodosService);

    ngOnInit(): void {
        this.todos = this.todoService.getTodos();
    }

    getTodos(): Todo[] {
        return this.getTodos();
    }

    getTodo(id: string): Todo | undefined {
        return this.todoService.getTodo(id);
    }

    createTodo(todo: Todo) {
        this.todoService.createTodo(todo);
    }

    updateTodo(id: string, todoUpdate: Todo) {
        this.todoService.updateTodo(id, todoUpdate);
    }

    deleteTodo(id: string) {
        this.todoService.deleteTodo(id);
    }
}

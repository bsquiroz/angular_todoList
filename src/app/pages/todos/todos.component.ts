import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Todo, typeFilter } from '../../interfaces/todo';
import { TodosService } from './todosService.service';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
    private todoService = inject(TodosService);
    private formBuilder = inject(FormBuilder);

    public todosFlag = this.todoService.getTodos();
    public todos = this.todoService.getTodos();

    public showFilters = false;

    public todoForm!: FormGroup;
    public currentTodoUpdate?: Todo;

    ngOnInit(): void {
        this.todoForm = this.initForm();
    }

    getTodos(): Todo[] {
        return this.todoService.getTodos();
    }

    getTodo(id: string): Todo | undefined {
        return this.todoService.getTodo(id);
    }

    createTodo(todo: Todo) {
        this.todoService.createTodo(todo);
    }

    updateTodo(id: string, todoUpdate: Todo) {
        this.todos = this.todoService.updateTodo(id, todoUpdate);
    }

    deleteTodo(id: string) {
        const res = confirm('Seguro que quieres eliminar esta tarea');
        if (!res) return;

        this.todos = this.todoService.deleteTodo(id);
    }

    completeStateTodo(id: string) {
        this.todos = this.todoService.completeStateTodo(id);
    }

    onSubmit() {
        if (this.currentTodoUpdate) {
            const updateTodo: Todo = {
                ...this.currentTodoUpdate,
                ...this.todoForm.value,
            };

            this.updateTodo(this.currentTodoUpdate.id, updateTodo);
            this.currentTodoUpdate = undefined;
        } else {
            const newTodo: Todo = {
                id: crypto.randomUUID(),
                stateTodo: false,
                ...this.todoForm.value,
            };

            this.createTodo(newTodo);
        }
        this.todoForm.reset();
    }

    // prueba
    onPathValue() {
        this.todoForm.patchValue({
            title: 'perro perro',
            desc: 'que mas pues',
        });
    }

    handleUpdate(todo: Todo) {
        this.currentTodoUpdate = todo;
        this.todoForm.patchValue({
            title: this.currentTodoUpdate.title,
            desc: this.currentTodoUpdate.desc,
            difficulty: this.currentTodoUpdate.difficulty,
        });
    }

    handleFilters(type: typeFilter) {
        if (type === 'easy' || type === 'medium' || type === 'hard') {
            this.todos = this.getTodos().filter(
                (todo) => todo.difficulty === type
            );
        } else if (type === 'completed') {
            this.todos = this.getTodos().filter((todo) => todo.stateTodo);
        } else if (type === 'nocompleted') {
            this.todos = this.getTodos().filter((todo) => !todo.stateTodo);
        } else if (type === 'all') {
            this.todos = this.getTodos();
        }

        this.handleShowFilters();
    }

    handleShowFilters() {
        this.showFilters = !this.showFilters;
    }

    initForm(): FormGroup {
        return this.formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            desc: ['', Validators.required],
            difficulty: ['', [Validators.required]],
        });
    }
}

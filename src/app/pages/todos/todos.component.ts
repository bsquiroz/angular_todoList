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

    public todos = signal(this.todoService.getTodos());
    public filter = signal<typeFilter>('all');

    public showFilters = false;

    public todoForm!: FormGroup;
    public currentTodoUpdate?: Todo;

    public todosFilteres = computed(() => {
        const filter = this.filter();
        const todoList = this.todos();

        if (filter === 'easy' || filter === 'medium' || filter === 'hard') {
            this.handleShowFilters(false);
            return todoList.filter((todo) => todo.difficulty === filter);
        }

        if (filter === 'completed') {
            this.handleShowFilters(false);
            return todoList.filter((todo) => todo.stateTodo);
        }

        if (filter === 'nocompleted') {
            this.handleShowFilters(false);
            return todoList.filter((todo) => !todo.stateTodo);
        }

        this.handleShowFilters(false);
        return todoList;
    });

    ngOnInit(): void {
        this.todoForm = this.initForm();
    }

    createTodo(todo: Todo) {
        this.todoService.createTodo(todo);
    }

    updateTodo(id: string, todoUpdate: Todo) {
        this.todos.update(() => this.todoService.updateTodo(id, todoUpdate));
    }

    deleteTodo(id: string) {
        const res = confirm('Seguro que quieres eliminar esta tarea');
        if (!res) return;

        this.todos.update(() => this.todoService.deleteTodo(id));
    }

    completeStateTodo(id: string) {
        this.todos.update(() => this.todoService.completeStateTodo(id));
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

    handleShowFilters(value: boolean) {
        this.showFilters = value;
    }

    initForm(): FormGroup {
        return this.formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            desc: ['', Validators.required],
            difficulty: ['', [Validators.required]],
        });
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Todo } from '../../interfaces/todo';
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
    public todos: Todo[] = [];
    public todoForm!: FormGroup;
    public currentTodoUpdate?: Todo;

    private todoService = inject(TodosService);
    private formBuilder = inject(FormBuilder);

    ngOnInit(): void {
        this.todos = this.todoService.getTodos();

        this.todoForm = this.initForm();
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
        });
    }

    initForm(): FormGroup {
        return this.formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            desc: ['', Validators.required],
        });
    }
}

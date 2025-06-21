import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Input() projectId!: number;
  @Output() taskAdded = new EventEmitter<void>();

  task: Partial<Task> = { status: TaskStatus.TODO };
  TaskStatus = TaskStatus;
  showSuccess = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private communicationService: CommunicationService
  ) {}

  submit() {
    if (this.task.title && this.task.status) {
      this.error = null;
      this.showSuccess = false;
      
      const taskToCreate = { ...this.task, projectId: this.projectId } as Task;
      console.log('Creating task:', taskToCreate);
      
      this.api.addTask(taskToCreate)
        .subscribe({
          next: (createdTask) => {
            console.log('Task created successfully:', createdTask);
            this.showSuccess = true;
            this.resetForm();
            
            // Notify other components about the new task
            this.communicationService.taskCreated(this.projectId, createdTask);
            
            // Show toast notification
            this.toastService.success(`Tâche "${createdTask.title}" créée avec succès !`);
            
            // Emit event for parent component
            this.taskAdded.emit();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.showSuccess = false;
            }, 3000);
          },
          error: (err) => {
            console.error('Failed to add task', err);
            this.error = 'Failed to create task. Please try again.';
            this.toastService.error('Erreur lors de la création de la tâche. Veuillez réessayer.');
          }
        });
    }
  }

  resetForm() {
    this.task = { status: TaskStatus.TODO };
    this.error = null;
    this.showSuccess = false;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
} 
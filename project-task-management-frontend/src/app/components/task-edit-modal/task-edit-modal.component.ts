import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task';

@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" *ngIf="isVisible" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5 class="modal-title">Modifier la tâche</h5>
          <button type="button" class="btn-close" (click)="close()"></button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="save()">
            <div class="mb-3">
              <label for="taskTitle" class="form-label">Titre *</label>
              <input 
                type="text" 
                class="form-control" 
                id="taskTitle" 
                [(ngModel)]="editedTask.title" 
                name="title"
                required
              >
            </div>
            <div class="mb-3">
              <label for="taskDescription" class="form-label">Description</label>
              <textarea 
                class="form-control" 
                id="taskDescription" 
                [(ngModel)]="editedTask.description" 
                name="description"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="taskStatus" class="form-label">Statut *</label>
              <select 
                class="form-select" 
                id="taskStatus" 
                [(ngModel)]="editedTask.status" 
                name="status"
                required
              >
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="REVIEW">En révision</option>
                <option value="DONE">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="taskDueDate" class="form-label">Date d'échéance</label>
              <input 
                type="date" 
                class="form-control" 
                id="taskDueDate" 
                [(ngModel)]="editedTask.dueDate" 
                name="dueDate"
              >
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">Annuler</button>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .modal-title {
      margin: 0;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.7;
    }

    .btn-close:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `]
})
export class TaskEditModalComponent {
  @Input() task: Task | null = null;
  @Input() isVisible = false;
  @Output() saveTask = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();

  editedTask: Partial<Task> = {};
  TaskStatus = TaskStatus;

  ngOnChanges() {
    if (this.task) {
      this.editedTask = { ...this.task };
    }
  }

  save() {
    if (this.editedTask.title && this.editedTask.status && this.task?.id) {
      const updatedTask: Task = {
        ...this.task,
        ...this.editedTask
      };
      this.saveTask.emit(updatedTask);
      this.close();
    }
  }

  close() {
    this.closeModal.emit();
  }
} 
import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task';
import { Project } from '../../models/project';
import { ApiService } from '../../services/api.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import { ToastService } from '../../services/toast.service';
import { CommunicationService, TaskUpdateEvent } from '../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent, TaskEditModalComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() project!: Project;
  @ViewChild('taskFormSection') taskFormSection!: ElementRef;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  search = '';
  statusFilter = '';
  currentProjectId: number | null = null;
  editingTask: Task | null = null;
  showEditModal = false;
  private taskUpdateSubscription: Subscription = new Subscription();

  TaskStatus = TaskStatus;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private communicationService: CommunicationService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.subscribeToTaskUpdates();
  }

  ngOnDestroy() {
    this.taskUpdateSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && changes['project'].currentValue) {
      const newProjectId = changes['project'].currentValue.id;
      console.log('Project changed:', {
        oldProjectId: this.currentProjectId,
        newProjectId: newProjectId,
        projectName: changes['project'].currentValue.name
      });

      if (newProjectId !== this.currentProjectId) {
        this.currentProjectId = newProjectId;
        this.search = '';
        this.statusFilter = '';
        this.editingTask = null;
        this.loadTasks();
      }
    }
  }

  private subscribeToTaskUpdates() {
    this.taskUpdateSubscription = this.communicationService.getTaskUpdates().subscribe(event => {
      if (event && event.projectId === this.currentProjectId) {
        switch (event.type) {
          case 'created':
            if (event.task) {
              this.tasks.push(event.task);
              this.applyFilters();
            }
            break;
          case 'updated':
            if (event.taskId && event.task) {
              const index = this.tasks.findIndex(t => t.id === event.taskId);
              if (index !== -1) {
                this.tasks[index] = event.task;
                this.applyFilters();
              }
            }
            break;
          case 'deleted':
            if (event.taskId) {
              this.tasks = this.tasks.filter(t => t.id !== event.taskId);
              this.applyFilters();
            }
            break;
        }
      }
    });
  }

  loadTasks() {
    if (!this.project || !this.project.id) {
      console.log('No project or project ID, clearing tasks');
      this.tasks = [];
      this.filteredTasks = [];
      this.currentProjectId = null;
      return;
    }

    console.log('Loading tasks for project:', {
      projectId: this.project.id,
      projectName: this.project.name
    });

    this.api.getTasksByProject(this.project.id).subscribe({
      next: (data) => {
        console.log('Tasks loaded:', data);
        this.tasks = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.tasks = [];
        this.filteredTasks = [];
        this.toastService.error('Erreur lors du chargement des tâches.');
      }
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task =>
      (!this.search ||
        task.title.toLowerCase().includes(this.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.search.toLowerCase()))) &&
      (!this.statusFilter || task.status === this.statusFilter)
    );
  }

  clearFilters() {
    this.search = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO':
        return 'status-todo';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'DONE':
        return 'status-done';
      default:
        return 'status-todo';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByTask(index: number, task: Task): number {
    return task.id || index;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.showEditModal = true;
  }

  onSaveTask(updatedTask: Task) {
    if (updatedTask.id !== undefined && this.project.id !== undefined) {
      const taskId: number = updatedTask.id;
      const projectId: number = this.project.id;
      this.api.updateTask(taskId, updatedTask).subscribe({
        next: (result) => {
          this.communicationService.taskUpdated(projectId, taskId, result);
          this.toastService.success(`Tâche "${result.title}" modifiée avec succès !`);
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Failed to update task', err);
          this.toastService.error('Erreur lors de la modification de la tâche. Veuillez réessayer.');
        }
      });
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTask = null;
  }

  deleteTask(task: Task) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`) &&
        task.id !== undefined && this.project.id !== undefined) {
      const taskId: number = task.id;
      const projectId: number = this.project.id;
      this.api.deleteTask(taskId).subscribe({
        next: () => {
          this.communicationService.taskDeleted(projectId, taskId);
          this.toastService.success(`Tâche "${task.title}" supprimée avec succès !`);
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          this.toastService.error('Erreur lors de la suppression de la tâche. Veuillez réessayer.');
        }
      });
    }
  }

  scrollToTaskForm() {
    this.taskFormSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task';
import { Project } from '../../models/project';
import { ApiService } from '../../services/api.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() project!: Project;
  @ViewChild('taskFormSection') taskFormSection!: ElementRef;
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  search = '';
  statusFilter = '';
  currentProjectId: number | null = null;
  editingTask: Task | null = null;

  TaskStatus = TaskStatus;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Only reload tasks if the project ID actually changed
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
    // For now, we'll use a simple prompt-based edit
    // In a real application, you'd want a proper modal or form
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      const updatedTask: Task = {
        ...task,
        title: newTitle.trim()
      };
      
      this.api.updateTask(task.id!, updatedTask).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to update task', err);
          alert('Failed to update task. Please try again.');
        }
      });
    }
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      this.api.deleteTask(task.id!).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          console.error('Failed to delete task', err);
          alert('Failed to delete task. Please try again.');
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
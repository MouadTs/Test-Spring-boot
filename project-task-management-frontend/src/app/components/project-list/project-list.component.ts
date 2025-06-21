import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project';
import { ApiService } from '../../services/api.service';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TaskListComponent, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  selectedProject?: Project;
  error: string | null = null;
  newProjectName = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.error = null;
    console.log('Loading projects...');
    this.api.getProjects().subscribe({
      next: (data) => {
        console.log('Projects loaded:', data);
        this.projects = data;
        if (data.length === 0) {
          this.error = 'No projects found. Please add a project.';
        }
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.error = 'Failed to load projects. Is the backend running?';
      }
    });
  }

  addProject() {
    if (!this.newProjectName.trim()) return;
    
    const project: Project = {
      name: this.newProjectName,
      startDate: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
    
    this.api.addProject(project).subscribe({
      next: () => {
        this.newProjectName = '';
        this.loadProjects();
      },
      error: (err) => {
        console.error('Failed to add project', err);
        this.error = 'Failed to add project. Is the backend running?';
      }
    });
  }

  selectProject(project: Project) {
    console.log('Selecting project:', project);
    this.selectedProject = project;
  }

  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete project "${project.name}"? This will also delete all associated tasks.`)) {
      this.api.deleteProject(project.id!).subscribe({
        next: () => {
          // If the deleted project was selected, clear the selection
          if (this.selectedProject && this.selectedProject.id === project.id) {
            this.selectedProject = undefined;
          }
          this.loadProjects();
        },
        error: (err) => {
          console.error('Failed to delete project', err);
          this.error = 'Failed to delete project. Please try again.';
        }
      });
    }
  }

  trackByProject(index: number, project: Project): number {
    return project.id || index;
  }
} 
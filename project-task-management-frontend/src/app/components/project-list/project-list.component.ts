import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project';
import { ApiService } from '../../services/api.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { ToastService } from '../../services/toast.service';
import { CommunicationService, ProjectUpdateEvent } from '../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TaskListComponent, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject?: Project;
  error: string | null = null;
  newProjectName = '';
  private projectUpdateSubscription: Subscription = new Subscription();

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private communicationService: CommunicationService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.subscribeToProjectUpdates();
  }

  ngOnDestroy() {
    this.projectUpdateSubscription.unsubscribe();
  }

  private subscribeToProjectUpdates() {
    this.projectUpdateSubscription = this.communicationService.getProjectUpdates().subscribe(event => {
      if (event) {
        switch (event.type) {
          case 'created':
            if (event.project) {
              this.projects.push(event.project);
            }
            break;
          case 'updated':
            if (event.projectId && event.project) {
              const index = this.projects.findIndex(p => p.id === event.projectId);
              if (index !== -1) {
                this.projects[index] = event.project;
                // Update selected project if it was the one updated
                if (this.selectedProject && this.selectedProject.id === event.projectId) {
                  this.selectedProject = event.project;
                }
              }
            }
            break;
          case 'deleted':
            if (event.projectId) {
              this.projects = this.projects.filter(p => p.id !== event.projectId);
              // Clear selection if the deleted project was selected
              if (this.selectedProject && this.selectedProject.id === event.projectId) {
                this.selectedProject = undefined;
              }
            }
            break;
        }
      }
    });
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
        this.toastService.error('Erreur lors du chargement des projets. Vérifiez que le backend fonctionne.');
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
      next: (createdProject) => {
        this.newProjectName = '';
        
        // Notify other components about the new project
        this.communicationService.projectCreated(createdProject);
        
        // Show toast notification
        this.toastService.success(`Projet "${createdProject.name}" créé avec succès !`);
      },
      error: (err) => {
        console.error('Failed to add project', err);
        this.error = 'Failed to add project. Is the backend running?';
        this.toastService.error('Erreur lors de la création du projet. Vérifiez que le backend fonctionne.');
      }
    });
  }

  selectProject(project: Project) {
    console.log('Selecting project:', project);
    this.selectedProject = project;
  }

  deleteProject(project: Project) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ? Cela supprimera également toutes les tâches associées.`) && project.id) {
      this.api.deleteProject(project.id).subscribe({
        next: () => {
          // Notify other components about the deleted project
          this.communicationService.projectDeleted(project.id);
          
          // Show toast notification
          this.toastService.success(`Projet "${project.name}" supprimé avec succès !`);
        },
        error: (err) => {
          console.error('Failed to delete project', err);
          this.error = 'Failed to delete project. Please try again.';
          this.toastService.error('Erreur lors de la suppression du projet. Veuillez réessayer.');
        }
      });
    }
  }

  trackByProject(index: number, project: Project): number {
    return project.id || index;
  }
} 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TaskUpdateEvent {
  type: 'created' | 'updated' | 'deleted';
  taskId?: number;
  projectId: number;
  task?: any;
}

export interface ProjectUpdateEvent {
  type: 'created' | 'updated' | 'deleted';
  projectId?: number;
  project?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private taskUpdateSubject = new BehaviorSubject<TaskUpdateEvent | null>(null);
  private projectUpdateSubject = new BehaviorSubject<ProjectUpdateEvent | null>(null);

  // Task events
  taskCreated(projectId: number, task: any) {
    this.taskUpdateSubject.next({
      type: 'created',
      projectId,
      task
    });
  }

  taskUpdated(projectId: number, taskId: number | undefined, task: any) {
    if (taskId !== undefined) {
      this.taskUpdateSubject.next({
        type: 'updated',
        projectId,
        taskId,
        task
      });
    }
  }

  taskDeleted(projectId: number, taskId: number | undefined) {
    if (taskId !== undefined) {
      this.taskUpdateSubject.next({
        type: 'deleted',
        projectId,
        taskId
      });
    }
  }

  getTaskUpdates(): Observable<TaskUpdateEvent | null> {
    return this.taskUpdateSubject.asObservable();
  }

  // Project events
  projectCreated(project: any) {
    this.projectUpdateSubject.next({
      type: 'created',
      project
    });
  }

  projectUpdated(projectId: number | undefined, project: any) {
    if (projectId !== undefined) {
      this.projectUpdateSubject.next({
        type: 'updated',
        projectId,
        project
      });
    }
  }

  projectDeleted(projectId: number | undefined) {
    if (projectId !== undefined) {
      this.projectUpdateSubject.next({
        type: 'deleted',
        projectId
      });
    }
  }

  getProjectUpdates(): Observable<ProjectUpdateEvent | null> {
    return this.projectUpdateSubject.asObservable();
  }
} 
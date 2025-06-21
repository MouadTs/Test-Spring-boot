import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProjectListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Project Task Management';
}

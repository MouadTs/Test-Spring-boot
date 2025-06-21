package com.example.projecttaskmanagement.controller;

import com.example.projecttaskmanagement.dto.TaskDto;
import com.example.projecttaskmanagement.model.TaskStatus;
import com.example.projecttaskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
    
    private final TaskService taskService;
    
    // GET /tasks : Récupérer toutes les tâches
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    // GET /tasks avec pagination (le **Bonus**)
    @GetMapping("/page")
    public ResponseEntity<Page<TaskDto>> getAllTasksWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDto> tasks = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(tasks);
    }
    
    // GET /tasks/{id} : Récupérer une tâche par ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    // GET /projects/{id}/tasks : Récupérer toutes les tâches d'un projet spécifique
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDto>> getTasksByProjectId(@PathVariable Long projectId) {
        List<TaskDto> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }
    
    // GET /projects/{id}/tasks avec pagination (Bonus)
    @GetMapping("/project/{projectId}/page")
    public ResponseEntity<Page<TaskDto>> getTasksByProjectIdWithPagination(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDto> tasks = taskService.getTasksByProjectId(projectId, pageable);
        return ResponseEntity.ok(tasks);
    }
    
    // GET /tasks/search?status=in_progress : Filtrer les tâches par statut
    @GetMapping("/search")
    public ResponseEntity<List<TaskDto>> searchTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String title) {
        
        if (status != null && title != null) {
            // Recherche combinée (bonus)
            List<TaskDto> tasks = taskService.getTasksByStatus(status);
            return ResponseEntity.ok(tasks.stream()
                    .filter(task -> task.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .toList());
        } else if (status != null) {
            List<TaskDto> tasks = taskService.getTasksByStatus(status);
            return ResponseEntity.ok(tasks);
        } else if (title != null) {
            List<TaskDto> tasks = taskService.searchTasksByTitle(title);
            return ResponseEntity.ok(tasks);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // GET /tasks/search avec pagination (Bonus)
    @GetMapping("/search/page")
    public ResponseEntity<Page<TaskDto>> searchTasksWithPagination(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        if (status != null && title != null) {
            // Recherche combinée avec pagination
            Page<TaskDto> tasks = taskService.getTasksByStatus(status, pageable);
            return ResponseEntity.ok(tasks);
        } else if (status != null) {
            Page<TaskDto> tasks = taskService.getTasksByStatus(status, pageable);
            return ResponseEntity.ok(tasks);
        } else if (title != null) {
            Page<TaskDto> tasks = taskService.searchTasksByTitle(title, pageable);
            return ResponseEntity.ok(tasks);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // POST /tasks : Créer une nouvelle tâche
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto) {
        TaskDto createdTask = taskService.createTask(taskDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    
    // PUT /tasks/{id} : Mettre à jour une tâche
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDto taskDto) {
        TaskDto updatedTask = taskService.updateTask(id, taskDto);
        return ResponseEntity.ok(updatedTask);
    }
    
    // DELETE /tasks/{id} : Supprimer une tâche
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
} 
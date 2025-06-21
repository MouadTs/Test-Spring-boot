package com.example.projecttaskmanagement.service;

import com.example.projecttaskmanagement.dto.TaskDto;
import com.example.projecttaskmanagement.model.Project;
import com.example.projecttaskmanagement.model.Task;
import com.example.projecttaskmanagement.model.TaskStatus;
import com.example.projecttaskmanagement.repository.ProjectRepository;
import com.example.projecttaskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    
    // Récupérer toutes les tâches
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Récupérer toutes les tâches avec pagination
    public Page<TaskDto> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(this::convertToDto);
    }
    
    // Récupérer une tâche par ID
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + id));
        return convertToDto(task);
    }
    
    // Récupérer toutes les tâches d'un projet
    public List<TaskDto> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Récupérer toutes les tâches d'un projet avec pagination
    public Page<TaskDto> getTasksByProjectId(Long projectId, Pageable pageable) {
        return taskRepository.findByProjectId(projectId, pageable)
                .map(this::convertToDto);
    }
    
    // Filtrer les tâches par statut
    public List<TaskDto> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Filtrer les tâches par statut avec pagination
    public Page<TaskDto> getTasksByStatus(TaskStatus status, Pageable pageable) {
        return taskRepository.findByStatus(status, pageable)
                .map(this::convertToDto);
    }
    
    // Rechercher les tâches par titre
    public List<TaskDto> searchTasksByTitle(String title) {
        return taskRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Rechercher les tâches par titre avec pagination
    public Page<TaskDto> searchTasksByTitle(String title, Pageable pageable) {
        return taskRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(this::convertToDto);
    }
    
    // Créer une nouvelle tâche
    public TaskDto createTask(TaskDto taskDto) {
        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + taskDto.getProjectId()));
        
        Task task = convertToEntity(taskDto);
        task.setProject(project);
        
        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }
    
    // Mettre à jour une tâche
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + id));
        
        // Vérifier si le projet a changé
        if (!existingTask.getProject().getId().equals(taskDto.getProjectId())) {
            Project newProject = projectRepository.findById(taskDto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + taskDto.getProjectId()));
            existingTask.setProject(newProject);
        }
        
        existingTask.setTitle(taskDto.getTitle());
        existingTask.setDescription(taskDto.getDescription());
        existingTask.setStatus(taskDto.getStatus());
        existingTask.setDueDate(taskDto.getDueDate());
        
        Task updatedTask = taskRepository.save(existingTask);
        return convertToDto(updatedTask);
    }
    
    // Supprimer une tâche
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tâche non trouvée avec l'ID: " + id);
        }
        taskRepository.deleteById(id);
    }
    
    // Convertir Entity vers DTO
    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setProjectId(task.getProject().getId());
        return dto;
    }
    
    // Convertir DTO vers Entity
    private Task convertToEntity(TaskDto dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setDueDate(dto.getDueDate());
        return task;
    }
} 
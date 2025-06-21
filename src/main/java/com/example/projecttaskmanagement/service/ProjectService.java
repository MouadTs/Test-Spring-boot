package com.example.projecttaskmanagement.service;

import com.example.projecttaskmanagement.dto.ProjectDto;
import com.example.projecttaskmanagement.model.Project;
import com.example.projecttaskmanagement.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    
    // Récupérer tous les projets
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Récupérer un projet par ID
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
        return convertToDto(project);
    }
    
    // Créer un nouveau projet
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = convertToEntity(projectDto);
        Project savedProject = projectRepository.save(project);
        return convertToDto(savedProject);
    }
    
    // Mettre à jour un projet
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
        
        existingProject.setName(projectDto.getName());
        existingProject.setDescription(projectDto.getDescription());
        existingProject.setStartDate(projectDto.getStartDate());
        existingProject.setEndDate(projectDto.getEndDate());
        
        Project updatedProject = projectRepository.save(existingProject);
        return convertToDto(updatedProject);
    }
    
    // Supprimer un projet
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));
        
        // Clear tasks to ensure proper deletion
        project.getTasks().clear();
        
        // Delete the project
        projectRepository.delete(project);
    }
    
    // Convertir Entity vers DTO
    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        return dto;
    }
    
    // Convertir DTO vers Entity
    private Project convertToEntity(ProjectDto dto) {
        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        return project;
    }
} 
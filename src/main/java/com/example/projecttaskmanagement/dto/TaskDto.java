package com.example.projecttaskmanagement.dto;

import com.example.projecttaskmanagement.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    
    private Long id;
    
    @NotBlank(message = "Le titre de la tâche est obligatoire")
    private String title;
    
    private String description;
    
    @NotNull(message = "Le statut de la tâche est obligatoire")
    private TaskStatus status;
    
    private LocalDate dueDate;
    
    @NotNull(message = "L'ID du projet est obligatoire")
    private Long projectId;
} 
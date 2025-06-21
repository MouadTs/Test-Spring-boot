package com.example.projecttaskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    
    private Long id;
    
    @NotBlank(message = "Le nom du projet est obligatoire")
    private String name;
    
    private String description;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
} 
package com.example.projecttaskmanagement.repository;

import com.example.projecttaskmanagement.model.Task;
import com.example.projecttaskmanagement.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Récupérer toutes les tâches d'un projet
    List<Task> findByProjectId(Long projectId);
    
    // Récupérer toutes les tâches d'un projet avec pagination
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    
    // Filtrer les tâches par statut
    List<Task> findByStatus(TaskStatus status);
    
    // Filtrer les tâches par statut avec pagination
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    
    // Recherche des tâches par titre (contient)
    List<Task> findByTitleContainingIgnoreCase(String title);
    
    // Recherche des tâches par titre avec pagination
    Page<Task> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // Recherche combinée : statut et titre
    @Query("SELECT t FROM Task t WHERE t.status = :status AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Task> findByStatusAndTitleContaining(@Param("status") TaskStatus status, @Param("title") String title);
    
    // Recherche combinée avec pagination
    @Query("SELECT t FROM Task t WHERE t.status = :status AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Task> findByStatusAndTitleContaining(@Param("status") TaskStatus status, @Param("title") String title, Pageable pageable);
} 
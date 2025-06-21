# Système de Gestion de Projets et Tâches :

Une application web full-stack pour gérer des projets et des tâches avec une interface moderne construite avec Spring Boot backend et Angular frontend.

## 🚀 Fonctionnalités

- **Gestion de Projets** : Créer, lire, modifier et supprimer des projets
- **Gestion de Tâches** : Créer, lire, modifier et supprimer des tâches dans les projets
- **Relation One-to-Many** : Les projets peuvent avoir plusieurs tâches
- **Interface Moderne** : Design responsive basé sur Bootstrap avec animations
- **Mises à Jour en Temps Réel** : Les tâches sont automatiquement filtrées par projet sélectionné
- **Gestion des Statuts** : Les tâches peuvent avoir différents statuts (À FAIRE, EN COURS, TERMINÉ)
- **Gestion des Dates** : Les projets et tâches supportent les dates de début/fin et d'échéance

## 🛠️ Stack Technologique

### Backend
- **Spring Boot 3.x** : Framework principal
- **Spring Data JPA** : Opérations de base de données
- **Base de Données H2** : Base de données en mémoire (configurable pour la production)
- **Maven** : Outil de build
- **Java 17+** : Langage de programmation

### Frontend
- **Angular 17** : Framework frontend
- **Bootstrap 5** : Framework UI
- **TypeScript** : Langage de programmation
- **Node.js** : Environnement d'exécution

## 📋 Prérequis

- Java 17 ou supérieur
- Node.js 18 ou supérieur
- Maven (ou utiliser le wrapper Maven inclus)
- Git

## 🚀 Démarrage Rapide

### Configuration du Backend

1. **Naviguez vers le répertoire racine du projet**
   ```bash
   cd "C:\Users\PREDATOR HELIOS 300\Desktop\Test SpringBoot"
   ```

2. **Lancez l'application Spring Boot**
   ```bash
   # Utilisation du wrapper Maven
   .\mvnw.cmd spring-boot:run
   
   # Ou utilisation directe de Maven
   mvn spring-boot:run
   ```

3. **Accédez à l'API backend**
   - L'application démarrera sur `http://localhost:8080`
   - Les endpoints API sont disponibles sur `http://localhost:8080/api/`

### Configuration du Frontend

1. **Naviguez vers le répertoire du projet Angular**
   ```bash
   cd project-task-management-frontend
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Démarrez le serveur de développement**
   ```bash
   npm start
   ```

4. **Accédez à l'application**
   - Le frontend sera disponible sur `http://localhost:4200`

## 📚 Endpoints API

### Projets
- `GET /api/projects` - Obtenir tous les projets
- `POST /api/projects` - Créer un nouveau projet
- `PUT /api/projects/{id}` - Modifier un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Tâches
- `GET /api/tasks` - Obtenir toutes les tâches
- `GET /api/tasks/project/{projectId}` - Obtenir les tâches par ID de projet
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/{id}` - Modifier une tâche
- `DELETE /api/tasks/{id}` - Supprimer une tâche

## 🗄️ Schéma de Base de Données

### Entité Projet
- `id` (Long, Clé Primaire)
- `name` (String, Obligatoire)
- `description` (String)
- `startDate` (LocalDate)
- `endDate` (LocalDate)

### Entité Tâche
- `id` (Long, Clé Primaire)
- `title` (String, Obligatoire)
- `description` (String)
- `status` (TaskStatus enum: TODO, IN_PROGRESS, COMPLETED)
- `dueDate` (LocalDate)
- `project` (Project, Relation Many-to-One)

## 🎨 Fonctionnalités UI

- **Design Responsive** : Fonctionne sur desktop, tablette et mobile
- **Animations Modernes** : Transitions fluides et effets de survol
- **Composants Bootstrap** : Cartes, modales, formulaires et navigation
- **Éléments Interactifs** : Dialogues de confirmation pour les opérations de suppression
- **Filtrage en Temps Réel** : Les tâches se mettent à jour automatiquement lors du changement de projet

## 🔧 Configuration

### Configuration Backend
L'application utilise `application.properties` pour la configuration :
- Paramètres de connexion à la base de données
- Configuration CORS
- Niveaux de logging

### Configuration Frontend
- Configuration de l'URL de base de l'API dans `api.service.ts`
- Configuration Bootstrap et Angular dans leurs fichiers de configuration respectifs

## 🚀 Déploiement

### Déploiement Backend
1. Construisez le fichier JAR :
   ```bash
   .\mvnw.cmd clean package
   ```
2. Exécutez le fichier JAR :
   ```bash
   java -jar target/project-task-management-0.0.1-SNAPSHOT.jar
   ```

### Déploiement Frontend
1. Construisez la version de production :
   ```bash
   cd project-task-management-frontend
   npm run build
   ```
2. Déployez le dossier `dist` sur votre serveur web

## 🤝 Contribution

1. Forkez le repository
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications
4. Testez minutieusement
5. Soumettez une pull request


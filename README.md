# Project Task Management System

A full-stack web application for managing projects and tasks with a modern UI built using Spring Boot backend and Angular frontend.

## 🚀 Features

- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Create, read, update, and delete tasks within projects
- **One-to-Many Relationship**: Projects can have multiple tasks
- **Modern UI**: Bootstrap-based responsive design with animations
- **Real-time Updates**: Tasks are automatically filtered by selected project
- **Status Management**: Tasks can have different statuses (TODO, IN_PROGRESS, COMPLETED)
- **Date Management**: Projects and tasks support start/end dates and due dates

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x**: Main framework
- **Spring Data JPA**: Database operations
- **H2 Database**: In-memory database (can be configured for production)
- **Maven**: Build tool
- **Java 17+**: Programming language

### Frontend
- **Angular 17**: Frontend framework
- **Bootstrap 5**: UI framework
- **TypeScript**: Programming language
- **Node.js**: Runtime environment

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Maven (or use the included Maven wrapper)
- Git

## 🚀 Getting Started

### Backend Setup

1. **Navigate to the project root directory**
   ```bash
   cd "C:\Users\PREDATOR HELIOS 300\Desktop\Test SpringBoot"
   ```

2. **Run the Spring Boot application**
   ```bash
   # Using Maven wrapper
   .\mvnw.cmd spring-boot:run
   
   # Or using Maven directly
   mvn spring-boot:run
   ```

3. **Access the backend API**
   - The application will start on `http://localhost:8080`
   - API endpoints are available at `http://localhost:8080/api/`

### Frontend Setup

1. **Navigate to the Angular project directory**
   ```bash
   cd project-task-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - The frontend will be available at `http://localhost:4200`

## 📚 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/{id}` - Update a project
- `DELETE /api/projects/{id}` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/project/{projectId}` - Get tasks by project ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## 🗄️ Database Schema

### Project Entity
- `id` (Long, Primary Key)
- `name` (String, Required)
- `description` (String)
- `startDate` (LocalDate)
- `endDate` (LocalDate)

### Task Entity
- `id` (Long, Primary Key)
- `title` (String, Required)
- `description` (String)
- `status` (TaskStatus enum: TODO, IN_PROGRESS, COMPLETED)
- `dueDate` (LocalDate)
- `project` (Project, Many-to-One relationship)

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Animations**: Smooth transitions and hover effects
- **Bootstrap Components**: Cards, modals, forms, and navigation
- **Interactive Elements**: Confirmation dialogs for delete operations
- **Real-time Filtering**: Tasks automatically update when switching projects

## 🔧 Configuration

### Backend Configuration
The application uses `application.properties` for configuration:
- Database connection settings
- CORS configuration
- Logging levels

### Frontend Configuration
- API base URL configuration in `api.service.ts`
- Bootstrap and Angular configuration in respective config files

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   .\mvnw.cmd clean package
   ```
2. Run the JAR file:
   ```bash
   java -jar target/project-task-management-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build the production version:
   ```bash
   cd project-task-management-frontend
   npm run build
   ```
2. Deploy the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🎯 Future Enhancements

- User authentication and authorization
- File attachments for tasks
- Email notifications
- Advanced filtering and search
- Task dependencies
- Time tracking
- Reporting and analytics 
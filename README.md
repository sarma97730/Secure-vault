# ClassVault – Academic Notes and Assignment Management System

A full-stack MVC web application using **Node.js + Express**, **SQLite**, **EJS**, **Bootstrap 5**, and **Multer**.

## Features

### Authentication & Roles
- Session-based login
- Role-based redirect and route protection for:
  - Admin
  - Teacher
  - Student

### Admin
- Manage users (create, update, delete)
- Assign roles (teacher/student)
- Manage subjects
- Monitor activity logs
- Dashboard stats:
  - Total users, teachers, students, subjects, assignments

### Teacher
- Upload notes (PDF/DOC/PPT or any file)
- Delete notes
- Create assignments with deadline, max marks, late penalty and optional file
- View submissions
- Enter marks with automatic late penalty deduction
- Mark attendance

### Student
- View and download notes
- View assignments and deadlines
- Submit assignments
- View marks
- View attendance history and percentage
- Late-submission indicator when penalty applies

## Project Structure

```
classvault/
  server.js
  config/
    database.js
  models/
    userModel.js
    subjectModel.js
    notesModel.js
    assignmentModel.js
    submissionModel.js
    attendanceModel.js
    marksModel.js
  routes/
    authRoutes.js
    adminRoutes.js
    teacherRoutes.js
    studentRoutes.js
  controllers/
    authController.js
    adminController.js
    teacherController.js
    studentController.js
  middleware/
    authMiddleware.js
    roleMiddleware.js
  public/
    css/styles.css
    js/app.js
    uploads/
  views/
    login.ejs
    adminDashboard.ejs
    teacherDashboard.ejs
    studentDashboard.ejs
    error.ejs
```

## SQL Schema
The app creates these tables automatically on startup:
- users
- subjects
- notes
- assignments
- submissions
- attendance
- marks
- activity_logs

Database file: `classvault.db`

## Run Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open:
   ```
   http://localhost:3000/login
   ```

Default admin account:
- **Email:** `admin@classvault.com`
- **Password:** `admin123`

## Notes
- File uploads are stored in:
  - `public/uploads/notes`
  - `public/uploads/assignments`
  - `public/uploads/submissions`
- Unauthorized role access returns HTTP 403.

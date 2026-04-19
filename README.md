# 🎓 Campus Issue Management System

A web-based platform that allows students to report, track, and vote on campus issues while enabling administrators to manage and resolve them efficiently.

---

## 🚀 Features

### 👩‍🎓 Student Panel
- Register complaints by department:
  - Hostel/Mess
  - Academics
  - Campus Infrastructure
- View complaint status:
  - Pending
  - In Progress
  - Resolved
- Vote on existing complaints (poll system)
- Avoid duplicate complaints by selecting existing ones

---

### 👨‍💼 Admin Panel
- View complaints department-wise
- Complaints sorted by highest votes
- Update complaint status:
  - In Progress
  - Resolved
- Real-time updates using Firebase

---

### 📊 Performance-Based Reward System
- Departments are ranked based on:
  
  Performance = (Resolved Complaints / Total Complaints) × 100

- Displays:
  - Total complaints
  - Resolved complaints
  - Performance percentage
  - Department ranking 🏆

---

### 🔐 Authentication System
- Email & password-based login/signup using Firebase Auth
- Role-based access:
  - Student
  - Admin
- Only authorized users can register

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend (Database):** Firebase Realtime Database  
- **Authentication:** Firebase Authentication  

---

## 📂 Project Structure

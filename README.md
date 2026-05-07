# CODEB: MIS & Invoicing System

## 🚀 Overview
The **MIS & Invoicing System** is a robust platform designed to streamline client data management, sales activities, and invoicing processes. The system enables the Sales Team to efficiently create, monitor, and update estimates and invoices, ensuring smooth financial transactions while adhering to **GST regulations**.

## 🎯 Key Features

### 🔐 User Authentication & Access Control
- **Secure Registration & Login**: Email-based user authentication with email verification.
- **Role-Based Access**:
  - **Admin**: Full control over the system, including user and invoice management.
  - **Salesperson**: Restricted access to invoicing and sales-related functionalities.
- **Session Management**: JWT-based authentication with auto-logout after inactivity.
- **Password Recovery**: Reset password via email.

### 📊 Dashboard & Navigation
- **Clean & Intuitive Layout**: A user-friendly interface for seamless navigation.
- **Comprehensive Dashboard**: Provides insights into key stats (e.g., estimates, invoices, payments).
- **Responsive Design**: Works across desktops, tablets, and mobile devices (powered by Tailwind CSS).

### 📜 Client & Sales Management
- **Client Data Management**: Store and manage client details efficiently.
- **Chain & Brand Tracking**: Monitor client groupings, chains, and related brands.
- **Estimate Management**: Create and update sales estimates.
- **Invoice Management**: Link estimates to invoices and track payments.

### 💳 Invoice & Payment Automation
- **Invoice Generation**: Automatically generate PDF invoices upon successful payment.
- **Payment Tracking**: Map payments to invoices with real-time updates.
- **GST Compliance**: Ensure all invoices adhere to GST regulations.

---

## 🏗 Tech Stack

### 🌐 Frontend
- **React.js 19**
- **Tailwind CSS** for responsive UI and modern design principles
- **React Router** for navigation
- **Axios** for API requests

### 🖥 Backend
- **Spring Boot 3.2.1** (RESTful APIs)
- **Spring Security & JWT** (Authentication and Authorization)
- **MySQL** (Relational Database)
- **Java Mail Sender** (Email Notifications)
- **iText** (PDF Generation for Invoices)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **npm** or **yarn**
- **Java 17** (JDK 17)
- **Maven**
- **MySQL Server**

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/bhumikajain54/CODEB.git
cd CODEB
```

### 2️⃣ Backend Setup (Spring Boot)
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Configure your environment variables. Ensure you have a `.env` file with your database and email credentials (this is ignored by Git for security):
   ```properties
   DB_URL=jdbc:mysql://localhost:3306/your_database_name
   DB_USERNAME=root
   DB_PASSWORD=your_password
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### 3️⃣ Frontend Setup (React)
1. Open a new terminal window and navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

The application should now be running. The frontend will typically be accessible at `http://localhost:3000` and the backend APIs at `http://localhost:8080`.

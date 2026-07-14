# 🚗 Valet Parking System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

## 📖 Project Description
A modern, full-stack Valet Parking Management System built with the MERN Stack for managing vehicle check-in, parking slot allocation, QR-based vehicle retrieval, payments, and administrative operations.

---

## ✨ Features
- **Customer Registration & Login**: Secure sign-up and sign-in processes.
- **Firebase Authentication**: Support for both Email/Password and Google OAuth.
- **Role-Based Access Control**: Dedicated interfaces for Admin, Valet Staff, and Customer.
- **Admin Dashboard**: Oversee operations, manage staff, and monitor live parking.
- **Valet Staff Dashboard**: Streamlined interface for check-ins and check-outs.
- **Customer Dashboard**: View parked vehicles, initiate retrieval, and process payments.
- **Vehicle Check-In & Check-Out**: End-to-end digital tracking of vehicle status.
- **QR Code Integration**: Automatic QR code generation and scanning for quick vehicle retrieval.
- **Parking Slot Management**: Real-time tracking and allocation of parking slots.
- **Live Parking Slot Status**: Visual indicators for occupied and available spots.
- **Payment Management**: Secure billing using Indian Rupees (₹).
- **Reports & Analytics**: Comprehensive insights into revenue and daily operations.
- **Responsive Design**: Flawless experience across desktops, tablets, and mobile devices.
- **Dark Mode & Light Mode**: Premium UI with global theme toggling (Landing page strictly Dark Mode).
- **MongoDB Atlas Integration**: Cloud-based scalable database.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **React Router**
- **Axios**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB Atlas**
- **Mongoose**

### Authentication
- **Firebase Authentication**

### Other
- **QR Code**
- **Git**
- **GitHub**

---

## 📂 Folder Structure

```text
Valet Parking System
├── Client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   │   ├── admin
│   │   │   ├── customer
│   │   │   └── valet
│   │   ├── services
│   │   └── utils
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── server
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── utils
    ├── index.js
    ├── package.json
    ├── seedAdmin.js
    └── seedValet.js
```

---

## 🚀 Installation Guide

Follow these steps to run the project locally.

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/valet-parking-system.git
cd valet-parking-system
```

### 2. Install Dependencies

**Client Dependencies:**
```bash
cd Client
npm install
```

**Server Dependencies:**
```bash
cd ../server
npm install
```

### 3. Configure Environment Variables
Create `.env` files in both the `Client` and `server` directories (see section below for required variables).

### 4. Run the Application

**Run Backend (from `server` directory):**
```bash
npm start
# or
npm run dev
```

**Run Frontend (from `Client` directory):**
```bash
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`Client/.env`)
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
VITE_API_URL="http://localhost:5000/api"
```

---

## 🔄 Application Workflow

1. **Customer Registration** → Users sign up through the application.
2. **Login** → Authentication via Firebase (Email/Google).
3. **Vehicle Check-In** → Valet staff records the vehicle details.
4. **Parking Slot Assignment** → The system allocates an available slot.
5. **QR Code Generation** → A unique QR code is generated for the parked vehicle.
6. **Vehicle Retrieval** → Customer initiates a retrieval request from their dashboard.
7. **QR Code Scan** → Valet scans the QR code to verify the vehicle.
8. **Payment** → Customer pays the calculated parking fee (₹).
9. **Vehicle Check-Out** → Vehicle is officially marked as retrieved.
10. **Reports** → Admin reviews daily performance and revenue analytics.

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Admin** | Full system access. Can manage staff, oversee all parked vehicles, configure parking slots, and view comprehensive financial reports. |
| **Valet Staff** | Operational access. Responsible for checking vehicles in, assigning slots, generating/scanning QR codes, and processing check-outs. |
| **Customer** | End-user access. Can view their currently parked vehicles, request retrieval, and complete payments securely. |

---

## 📸 Screenshots

### Landing Page
<!-- Add Landing Page screenshot here -->

### Admin Dashboard
<!-- Add Admin Dashboard screenshot here -->

### Valet Check-In Flow
<!-- Add Valet Check-In Flow screenshot here -->

### Customer Dashboard
<!-- Add Customer Dashboard screenshot here -->

---

## ⚙️ CI/CD Setup Guide

This project is configured with a fully automated CI/CD pipeline using **GitHub Actions**.

### How It Works
1. **Continuous Integration (CI)**: On every push or pull request, GitHub Actions automatically:
   - Installs all dependencies for both Frontend and Backend.
   - Runs `eslint` and verifies the React build.
   - Spins up a temporary MongoDB Docker container.
   - Boots up the Backend server and executes the full **End-to-End Test Suite** (`e2e_test.js`).
2. **Continuous Deployment (CD)**: On every successful push to the `main` branch (after CI passes):
   - GitHub triggers a **Vercel Deploy Hook** to deploy the Frontend.
   - GitHub triggers a **Render Deploy Hook** to deploy the Backend.

### Configuration Instructions

To enable automatic deployments, you must configure the following **GitHub Repository Secrets** (`Settings > Secrets and variables > Actions`):

#### 1. Deployment Hooks
- `VERCEL_DEPLOY_HOOK`: Create a Deploy Hook in your Vercel Project Settings (Git > Deploy Hooks).
- `RENDER_DEPLOY_HOOK`: Create a Deploy Hook in your Render Web Service Settings (Settings > Deploy Hook).

#### 2. Application Secrets (For CI Tests & Build)
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `VITE_API_URL`
- `JWT_SECRET`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

*Note: The CI testing pipeline spins up its own local MongoDB instance automatically, so you do not need to provide a `MONGO_URI` secret for GitHub Actions unless you wish to test against Atlas directly.*

---

## 🔮 Future Enhancements
- 📱 Native Mobile Application (React Native).
- 🔔 SMS / Push Notifications for vehicle retrieval status.
- 💳 Integration with Payment Gateways (Stripe / Razorpay).
- 📍 GPS Tracking for Valet routes (if off-site parking is used).
- 🤖 AI-based license plate recognition (ALPR).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

## ✍️ Author
**[Your Name / Organization]**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Website](https://yourwebsite.com)

---

## 🤝 Contribution Guide
Contributions, issues, and feature requests are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📫 Contact
For inquiries, please contact:
**Email:** your.email@example.com  
**Project Link:** [https://github.com/yourusername/valet-parking-system](https://github.com/yourusername/valet-parking-system)

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

## ⚙️ Continuous Deployment (CD) Setup Guide

This project is fully automated for Continuous Integration and Continuous Deployment (CI/CD) via **GitHub Actions**. Every push to the `main` branch will automatically deploy the Backend to Render and the Frontend to Vercel, provided the CI tests pass.

### 1. Backend Deployment (Render) & MongoDB Atlas Migration
The backend is deployed as a Web Service on Render using the `render.yaml` Blueprint. Render requires a cloud database (MongoDB Atlas) to function.

#### 1a. Migrate Local Data to MongoDB Atlas
If you have data in your local MongoDB that you want to preserve (like Admin users):
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Go to **Network Access** and add IP Address `0.0.0.0/0` (Allow access from anywhere).
3. Go to **Database Access** and create a user.
4. Click **Connect > Drivers**, and copy your connection string (`mongodb+srv://...`).
5. Open your `server/.env` file and paste the string into `MONGO_URI_ATLAS`.
6. Run the migration script to seamlessly copy your local data to Atlas:
   ```bash
   cd server
   node scripts/migrate_to_atlas.js
   ```
7. Once complete, change your `MONGO_URI` in `server/.env` to the Atlas connection string permanently.

#### 1b. Deploy to Render

1. Create an account on [Render](https://render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and configure the service (Root Dir: `server`, Build: `npm install`, Start: `npm start`).
5. **Environment Variables**: In the Render Dashboard for your new Web Service, go to **Environment** and set the following required variables:
   - `MONGO_URI`: Your MongoDB Atlas Connection String.
   - `JWT_SECRET`: A strong random string for JWT signing.
   - `FIREBASE_PROJECT_ID`: From Firebase Console.
   - `FIREBASE_CLIENT_EMAIL`: From Firebase Service Account.
   - `FIREBASE_PRIVATE_KEY`: From Firebase Service Account (Ensure line breaks `\n` are handled properly).
   - `CLIENT_URL`: The production URL of your Vercel frontend (e.g., `https://your-frontend.vercel.app`).
6. Go to **Settings > Deploy Hook** and copy the webhook URL.

### 2. Frontend Deployment (Vercel)
The frontend is a React SPA built with Vite. It requires a `vercel.json` file for proper routing, which is already included.

1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project** and import your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `Client`
   - **Build Command**: `npm run build`
4. **Environment Variables**: Add the following in the Vercel Dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_API_URL`: The production URL of your Render backend (e.g., `https://valet-parking-backend.onrender.com/api`).
5. Go to **Settings > Git > Deploy Hooks**, create a hook named "GitHub Actions", and copy the URL.

### 3. GitHub Actions Configuration (Automatic Deployment)
To securely trigger deployments only when the CI pipeline passes, configure the following **GitHub Repository Secrets** (`Settings > Secrets and variables > Actions`):

#### Deployment Hooks (Required for CD)
- `VERCEL_DEPLOY_HOOK`: Paste the webhook URL from Vercel.
- `RENDER_DEPLOY_HOOK`: Paste the webhook URL from Render.

#### Application Secrets (Required for CI Testing)
These secrets are required so the GitHub Actions environment can run the automated tests against real Firebase APIs before deploying.
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `VITE_API_URL`: Use `http://127.0.0.1:5001/api` for the GitHub Actions environment.
- `JWT_SECRET`: Any random string (e.g. `test_jwt_secret`).
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

*Note: The CI pipeline spins up its own local MongoDB instance automatically, so you do not need to provide a `MONGO_URI` secret for GitHub Actions.*

### 4. Post-Deployment Verification
Once the pipeline deploys your application, manually verify the following in the live environment:
1. **Authentication**: Sign in to the Customer and Admin portals.
2. **WebSockets**: Ensure real-time slot updates work without CORS errors.
3. **Database**: Create a test check-in and verify it appears in your MongoDB Atlas dashboard.
4. **Routing**: Refresh the `/admin/dashboard` page on Vercel to ensure SPA rewrites are working correctly (no 404s).

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

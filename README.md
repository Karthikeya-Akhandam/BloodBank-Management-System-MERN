# 🩸 BloodConnect

### *Save Lives In Real-Time.*

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

**BloodConnect** is a next-generation, real-time blood management ecosystem designed to bridge the gap between donors, hospitals, and blood banks. Built with a focus on speed, transparency, and reliability, it ensures that life-saving resources reach those in need when seconds count.

---

## 🏛️ The Four Pillars

The platform orchestrates a seamless lifecycle through four specialized interfaces:

| Role | Responsibility | Key Features |
| :--- | :--- | :--- |
| **Donors** | The Life-Line | Slot booking, donation history, and digital certification. |
| **Hospitals** | The Front-Line | Instant blood requests and real-time inventory visibility. |
| **Organizations** | The Warehouse | Automated inventory management and request fulfillment. |
| **Admins** | The Orchestrators | Network oversight, user verification, and global analytics. |

---

## ✨ Core Features

- **⚡ Real-Time Infrastructure:** Powered by Socket.io, requests and notifications are delivered instantly across the network.
- **📊 Dynamic Inventory Tracking:** Automated updates to blood stock levels across multiple organizations.
- **📜 Digital Certification:** Automatic generation of donation certificates via PDF for donors.
- **🔐 Secure Authentication:** Multi-role JWT-based security with encrypted data handling.
- **🎨 Modern UI/UX:** A high-performance interface built with React 19, Tailwind CSS v4, and Framer Motion for fluid animations.
- **🐳 Containerized Deployment:** Fully Dockerized for "one-command" setup across any environment.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose ODM)
- **Communication:** Socket.io
- **Utilities:** PDFKit (Report Generation), Bcrypt.js (Security)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (or Docker)

### Quick Start with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blood-bank.git
   cd blood-bank
   ```

2. Spin up the entire stack:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000`

---

<p align="center">
  Built with ❤️ for a safer, more connected world.
</p>

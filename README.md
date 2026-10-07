# Student Crypto Wallet — React + Spring Boot + MySQL

A college-project prototype of a student-centric crypto wallet with campus payments, QR payments and a simple merchant dashboard.

## Stack
- Frontend: React + Vite
- Backend: Java + Spring Boot REST API
- Database: MySQL

## Features
- Student signup/login
- Student profile: ID, department, year, college
- Wallet balance and wallet address
- Demo wallet top-up
- Student-to-student transfers
- Campus payment categories
- Payment notes
- Transaction history and spending summary
- Wallet QR and payment QR
- QR scanner
- Campus merchant dashboard

## Run backend
1. Start MySQL and make sure the `backend` database exists.
2. Check `backend/src/main/resources/application.properties` for your MySQL username/password.
3. In a terminal:

```cmd
cd backend
mvn spring-boot:run
```

Backend API: `http://localhost:8080/api`

## Run React frontend
Open a second terminal:

```cmd
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

The React app calls the Spring Boot API at `http://localhost:8080/api`.

## Important project note
This is a prototype. Wallet balances and transactions are stored in MySQL; the current version does not connect to a real blockchain network or cryptocurrency exchange.

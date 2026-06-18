# Inventory & Order Management System

A full-stack, fully containerized Inventory and Order Management System built with a modern tech stack. This application provides robust CRUD operations, real-time inventory stock tracking, and strict business logic enforcement.

## 🚀 Tech Stack

- **Frontend**: React, Vite, React Router, Lucide Icons, Vanilla CSS
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL (Persisted with Docker Volumes)
- **Infrastructure**: Docker & Docker Compose
- **Web Server (Frontend)**: Nginx (Alpine)

## ✨ Features

- **Dashboard**: Real-time summary metrics and low-stock warning alerts.
- **Product Management**: Track inventory with strict business logic (SKUs must be unique, prices/stock cannot be negative).
- **Customer Management**: Register customers with unique email validation.
- **Order Management**: Create multi-item orders. The backend securely computes total amounts and automatically deducts stock upon creation. Canceling orders restores the stock.
- **UI/UX**: Responsive dark-mode aesthetics, dynamic hover animations, and comprehensive error/success feedback banners.

## 🛠 Prerequisites

Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## ⚙️ Getting Started

### 1. Setup Environment Variables
Create a `.env` file in the root of the project with your database secrets:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=YourSecurePassword@
POSTGRES_DB=inventory_db
DATABASE_URL=postgresql://user:YourSecurePassword%40@db:5432/inventory_db
```
*(Note: If your password contains a special character like `@`, make sure it is URL-encoded in the `DATABASE_URL` as `%40`)*.

### 2. Run with Docker Compose
To build and start the entire stack, simply run:

```bash
docker-compose up -d --build
```

### 3. Access the Application
Once the containers are running, you can access:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Alternative Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🛑 Stopping the Application
To stop the application and clean up the containers:
```bash
docker-compose down
```
*(Note: Your database data is safely persisted in the `postgres_data` Docker volume. It will still be there the next time you start the containers).*

## 💼 Business Logic Implemented
- Unique constraints on Product SKU and Customer Email.
- Backend prevents order placement if requested quantity exceeds available stock.
- Client payloads for prices are ignored; the backend fetches real-time prices from the database to compute order totals securely.
- Proper standard HTTP status codes (`201 Created`, `400 Bad Request`, `404 Not Found`).

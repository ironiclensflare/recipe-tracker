# Recipe Tracker

A web application for tracking recipes and ingredients, built with React frontend and ASP.NET Core Web API backend, using MongoDB as the database.

## Features

- Create, Read, Update, and Delete (CRUD) recipes
- Store ingredients within each recipe (embedded documents in MongoDB)
- Modern React frontend with TypeScript
- YouTube video integration with embedded player
- Video indicators on recipe cards
- Bootstrap 5 for responsive design
- MongoDB for NoSQL data storage
- RESTful API
- Fully containerized with Docker

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- OR Node.js and .NET 9.0 SDK (for local development)

## Running the Application

### Option 1: Docker Compose (Recommended)

1. Build and start the containers:
```bash
docker-compose up -d
```

2. Access the application at: `http://localhost:8080`

3. To stop the application:
```bash
docker-compose down
```

### Option 2: Local Development

1. Start the backend API:
```bash
dotnet run
```

2. In a separate terminal, start the React frontend:
```bash
cd ClientApp
npm install
npm run dev
```

3. Access the application at: `http://localhost:3000`

## Project Structure

- `ClientApp/` - React frontend (Vite + TypeScript)
  - `src/components/` - React components
  - `src/services.ts` - API service layer
  - `src/types.ts` - TypeScript type definitions
- `Controllers/` - ASP.NET Core Web API controllers
- `Models/` - Data models (Recipe, Ingredient)
- `Services/` - MongoDB service for database operations

## Technologies

- **Frontend:** React 18, TypeScript, Vite, React Router, Bootstrap 5
- **Backend:** .NET 9.0, ASP.NET Core Web API
- **Database:** MongoDB
- **Containerization:** Docker & Docker Compose

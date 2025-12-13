# Recipe Tracker

A simple .NET 9.0 web application for tracking recipes and ingredients, using MongoDB as the database.

## Features

- Create, Read, Update, and Delete (CRUD) recipes
- Store ingredients within each recipe (embedded documents in MongoDB)
- Simple and clean web interface built with ASP.NET Core Razor Pages
- Bootstrap 5 for responsive design
- MongoDB for NoSQL data storage
- Fully containerized with Docker

## Prerequisites

- Docker
- Docker Compose

## Running the Application

1. Build and start the containers:
```bash
docker-compose up -d
```

2. Access the application at: `http://localhost:8080`

3. To stop the application:
```bash
docker-compose down
```

4. To stop and remove data:
```bash
docker-compose down -v
```

## Project Structure

- `Models/` - Data models (Recipe, Ingredient)
- `Services/` - MongoDB service for database operations
- `Pages/` - Razor Pages for the UI
- `Pages/Recipes/` - Recipe CRUD pages

## Technologies

- .NET 9.0
- ASP.NET Core Razor Pages
- MongoDB 
- Bootstrap 5
- Docker & Docker Compose

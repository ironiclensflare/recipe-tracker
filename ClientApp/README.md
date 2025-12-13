# Recipe Tracker - React Frontend

This application has been converted to use React with TypeScript for the frontend and ASP.NET Core Web API for the backend.

## Structure

- **ClientApp/** - React frontend (Vite + TypeScript)
- **Controllers/** - ASP.NET Core Web API controllers
- **Models/** - Shared data models
- **Services/** - MongoDB service

## Running the Application

### Backend (ASP.NET Core)

```bash
dotnet run
```

The API will run on `http://localhost:5000` (or `https://localhost:5001`)

### Frontend (React)

```bash
cd ClientApp
npm install
npm run dev
```

The React app will run on `http://localhost:3000` and proxy API requests to the backend.

## Building for Production

```bash
cd ClientApp
npm run build
```

This builds the React app and outputs it to `wwwroot/`, which the ASP.NET Core app will serve.

Then run the backend:

```bash
dotnet run
```

The application will be available at `http://localhost:5000`

## Features

- List all recipes with video indicators
- Create new recipes
- Edit existing recipes
- View recipe details with embedded YouTube videos
- Delete recipes
- Full CRUD operations via REST API

# ARGUS Frontend

### React Dashboard | Automated Risk & Guard Unified System

The ARGUS frontend is the user-facing application of ARGUS, an Industrial Internet of Things (IIoT) condition monitoring and automated safety system. Built with **React and Vite**, it provides the interface through which users interact with the platform, manage application resources, and access machine monitoring information supplied by the Django REST API backend.

## Overview

The frontend is responsible for presenting ARGUS functionality through an interactive web interface. It communicates with the backend through HTTP requests, receives structured API responses, and displays relevant information to users.

The frontend is designed to support:

- **Authentication and user management** — Registration, login, and profile access.
- **Vehicle and asset management** — Access to registered vehicles and monitored assets.
- **Condition monitoring** — Presentation of machine health information and sensor readings.
- **Alert management** — Display and management of monitoring alerts.
- **Data visualisation** — Visual representation of machine conditions, risk levels, and historical monitoring data.

Feature availability depends on the current implementation and the corresponding backend API endpoints.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build tooling |
| JavaScript | Application logic and interactivity |
| React Router | Client-side navigation |
| Axios | HTTP communication with the backend |
| Recharts | Data visualisation |
| Framer Motion | Interface animations |

## System Architecture

The frontend operates as the presentation layer of ARGUS and communicates with the Django REST API rather than accessing the database directly.

```text
                 USER
                   |
                   v
            React Interface
                   |
                   v
          Pages and Components
                   |
                   v
           API Service Layer
                   |
                   v
             Axios Client
                   |
             HTTP Requests
                   |
                   v
           Django REST API
                   |
                   v
        Business Logic and Models
                   |
                   v
               Database
```

React manages the interface, navigation, and user interactions. Axios handles communication with the backend, while Django processes requests, applies application logic, enforces permissions, and interacts with the database. The backend returns responses that the frontend uses to update the interface.

## Project Structure

The frontend is organised around the main application entry points, reusable interface components, pages, and API communication.

```text
frontend/
├── public/
├── src/
│   ├── api/          # API client configuration
│   ├── assets/       # Static assets
│   ├── components/   # Reusable UI components
│   ├── context/      # Shared application state
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Application pages
│   ├── services/     # API and application services
│   ├── App.jsx       # Root application component
│   └── main.jsx      # Application entry point
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md
```

This structure describes the intended organisation; directories and files may vary according to the current implementation.

## Prerequisites

Before running the frontend, ensure that the following are installed:

- Node.js
- npm
- Git
- The ARGUS backend for features that require API access

## Installation and Setup

Clone the repository and navigate to the frontend directory.

```bash
git clone https://github.com/amorsaralynn08-arch/_ARGUS.git
cd _ARGUS/frontend
```

Install the project dependencies:

```bash
npm install
```

Configure the backend API base URL using a `.env` file in the frontend directory, if required by the existing API client configuration.

```ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

The Axios client must reference this environment variable for the configuration to take effect. Variables prefixed with `VITE_` are exposed to client-side code and must not contain private credentials or server-side secrets.

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically `http://localhost:5173/`.

For API-dependent functionality, ensure the Django backend is running and the configured API URL matches the backend environment.

## API Communication

The frontend communicates with ARGUS through the Django REST API using Axios. A shared API client provides a central location for configuring the backend URL and common HTTP settings.

For example:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

Application services can use this client to send requests to backend endpoints without repeatedly specifying the full URL. The exact configuration and endpoint paths should match the existing implementation.

## Authentication

Authentication connects the frontend to the backend's user authentication endpoints. The frontend collects user input, submits authentication requests, and handles the responses returned by Django.

The authentication architecture may include registration, login, access-token handling, authenticated API requests, profile retrieval, and password-reset functionality as these features are implemented and integrated.

Authentication state and protected navigation are managed on the frontend according to the application's authentication design, while credential validation and authorization remain the responsibility of the backend.

## Monitoring Dashboard

The monitoring dashboard is intended to present the condition information generated and processed by ARGUS. Depending on the available backend data and implemented interface components, this includes:

- Machine health indicators and sensor readings.
- Risk classifications and equipment status.
- Active and resolved monitoring alerts.
- Historical readings and condition trends.

Recharts supports the visualisation of numerical data and monitoring trends. The interface consumes data supplied by the backend, which connects the dashboard to the platform's monitoring and analysis logic.

## Development Commands

Run these commands from the frontend directory.

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Generate a production build |
| `npm run preview` | Preview the production build locally |

These commands depend on the scripts configured in `package.json`.

## Development Status

The ARGUS frontend is under active development alongside the backend API and hardware integration. Application features are being developed and integrated progressively, with the objective of providing a unified interface for user management, asset access, and condition monitoring.

## Related Documentation

For the overall system architecture, backend implementation, hardware integration, and project roadmap, refer to the main ARGUS repository README.



**Developer:** Amor


# ARGUS Backend
### Django REST API | Automated Risk & Guard Unified System

The ARGUS backend is the server-side component of ARGUS, an Industrial Internet of Things (IIoT) condition monitoring and automated safety system.

Built with **Python, Django, and Django REST Framework**, it provides the API layer responsible for handling application requests, managing data, processing machine monitoring information, and communicating with the ARGUS frontend and, as integration progresses, IoT hardware.

## Overview

The backend acts as the central processing and data management layer of ARGUS. It exposes RESTful API endpoints that allow the frontend to interact with backend services without directly accessing the database.

The backend is designed to support:

- User registration and authentication
- User profile management
- Vehicle and machine-related data management
- Sensor data collection and storage
- Machine health assessment
- Alert generation and resolution
- Historical monitoring data
- Future integration with ESP32-based hardware

Features are developed incrementally as the project progresses.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| Django | Web framework |
| Django REST Framework | REST API development |
| PostgreSQL | Relational database |
| Django CORS Headers | Cross-origin request support |
| DRF Spectacular | OpenAPI schema and API documentation |
| Python Decouple | Environment variable configuration |
| Django Filter | API filtering |

## Architecture

```text
React Frontend / IoT Hardware
             |
             | HTTP / REST API
             v
      Django REST Framework
             |
             v
       Django Application
             |
             v
          Database
```

The frontend communicates with the backend through API endpoints. Hardware integration is intended to enable sensor readings to enter the same monitoring workflow.

## Project Structure

```text
Argus-backend/
├── apps/
│   ├── authentication/
│   ├── vehicles/
│   ├── alerts/
│   └── ...
├── config/
├── manage.py
├── requirements.txt
├── .env
└── README.md
```

*The application names and layout above are illustrative. Keep this tree aligned with the actual repository structure.*

## Prerequisites

Install the following before setting up the backend:

- Python 3.12 or newer
- pip
- Git
- PostgreSQL, if using the PostgreSQL configuration

Verify your Python installation:

```bash
python --version
```

## Installation and Setup

Run the following commands from the repository root.

### 1. Enter the backend directory

```bash
cd Argus-backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it using the appropriate command.

**Windows — Command Prompt**

```cmd
venv\Scripts\activate
```

**Windows — PowerShell**

```powershell
venv\Scripts\Activate.ps1
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the backend directory and provide the configuration required by the Django settings.

Example for a local PostgreSQL database:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=argus_db
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
```

These names are examples; use the exact variable names expected by the project's settings.

**Security:** Never commit real secrets, passwords, or production credentials to version control. Keep `.env` excluded through `.gitignore`.

### 5. Prepare the database

Create the PostgreSQL database configured in your environment variables, then apply the migrations:

```bash
python manage.py migrate
```

If you have changed Django models and need to generate migrations, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create an administrator account

```bash
python manage.py createsuperuser
```

Follow the prompts to create the account.

### 7. Start the development server

```bash
python manage.py runserver
```

The local development server runs at:

`http://127.0.0.1:8000/`

## API Documentation

When the API documentation routes are configured, access them at:

- **Swagger UI:** `http://127.0.0.1:8000/api/docs/`
- **OpenAPI schema:** `http://127.0.0.1:8000/api/schema/`

These routes may differ depending on the project's URL configuration.

## API Responsibilities

The backend provides the foundation for the following application workflows:

### Authentication and User Management

Handles user-related requests, authentication, and profile access through API endpoints.

### Vehicle and Machine Management

Provides the application layer for managing monitored assets and their associated information.

### Monitoring and Sensor Data

Supports the storage and processing of machine monitoring data, with physical sensor integration being developed as part of the wider ARGUS system.

### Alerts and Maintenance

Supports the alert-management workflow, including the tracking and resolution of detected issues as these features are implemented.

## Development Guidelines

- Keep business logic separate from request handling where appropriate.
- Validate incoming API data before processing or storing it.
- Use environment variables for sensitive configuration.
- Apply database migrations whenever model changes require them.
- Maintain consistent API response formats and meaningful HTTP status codes.
- Test API endpoints before integrating them with the frontend.
- Never commit virtual environments, database credentials, or secret keys.

## Running Tests

Run the Django test suite with:

```bash
python manage.py test
```

Add application-specific tests as backend functionality expands.

## Related Documentation

For the complete project overview, system architecture, hardware plans, and full-stack development roadmap, see the main repository's `README.md`.

## Project

**ARGUS — Automated Risk & Guard Unified System**

Developed by Amor.

Repository: https://github.com/amorsaralynn08-arch/_ARGUS_


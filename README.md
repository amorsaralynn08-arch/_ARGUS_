# ARGUS
### Automated Risk & Guard Unified System

ARGUS is a full-stack Industrial IoT (IIoT) condition monitoring and automated safety system designed to monitor machine health, detect potential faults, and provide real-time operational insights.

The system integrates IoT sensors, a Django REST API backend, and a React frontend to simulate modern predictive maintenance solutions used in manufacturing, automation, and industrial environments.

---

# Overview

ARGUS continuously collects sensor readings such as temperature, vibration, and load values from either simulated data or physical hardware. The backend processes these readings, stores them in a database, evaluates overall machine health, and exposes the processed information through RESTful APIs.

The React frontend consumes these APIs to display interactive dashboards, live sensor metrics, machine health scores, alerts, and historical trends.

The project is designed with scalability in mind, allowing future integration with cloud services, machine learning models, and industrial IoT devices.

---

# Features

## Current

- RESTful API built with Django REST Framework
- Structured backend architecture
- Machine health data management
- Sensor data storage
- Database integration
- API documentation
- Cross-Origin Resource Sharing (CORS) support
- Environment variable configuration

## Planned

- Real-time sensor monitoring
- Machine health scoring system
- Risk level classification (Normal / Warning / Critical)
- Live alert generation
- Interactive React dashboard
- Predictive maintenance recommendations
- User authentication and authorization
- Historical analytics
- AI-assisted anomaly detection
- Cloud deployment
- Hardware integration with ESP32 / Arduino

---

# System Architecture

```
                 +----------------------+
                 |  ESP32 / Arduino     |
                 |  Sensors             |
                 +----------+-----------+
                            |
                            |
                            v
                 +----------------------+
                 | Django REST API      |
                 | (Backend)            |
                 +----------+-----------+
                            |
             PostgreSQL Database
                            |
                            |
                            v
                 +----------------------+
                 | React Dashboard      |
                 | (Frontend)           |
                 +----------------------+
```

---

# Technology Stack

## Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Django CORS Headers
- DRF Spectacular (OpenAPI Documentation)
- Python Decouple
- Django Filter

## Frontend (Coming Soon)

- React
- Vite
- JavaScript
- React Router
- Recharts
- Framer Motion

## Hardware (Future)

- ESP32
- Arduino
- Temperature Sensor
- Vibration Sensor
- Potentiometer
- Buzzer
- LEDs

---

# Project Structure

The repository will eventually contain both the backend and frontend applications.

```
_ARGUS_/
│
├── backend/
│   ├── apps/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── frontend/                 # Coming Soon
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# Backend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/amorsaralynn08-arch/_ARGUS_.git
```

Move into the project directory.

```bash
cd _ARGUS_
```

Move into the backend folder.

```bash
cd Argus-backend
```

---

# Python Requirements

Before running the project, ensure the following are installed:

- Python 3.12 or newer
- Git
- PostgreSQL (recommended)
- pip (Python package manager)

Verify installation:

```bash
python --version
```

or

```bash
python3 --version
```

---

# Virtual Environment

Creating a virtual environment is highly recommended to isolate project dependencies.

## Windows (Command Prompt)

```cmd
python -m venv venv
```

Activate:

```cmd
venv\Scripts\activate
```

---

## Windows (PowerShell)

```powershell
python -m venv venv
```

Activate:

```powershell
venv\Scripts\Activate.ps1
```

If PowerShell prevents activation:

```powershell
Set-ExecutionPolicy -Scope Process RemoteSigned
```

---

## Windows (Git Bash)

```bash
python -m venv venv
```

Activate:

```bash
source venv/Scripts/activate
```

---

## macOS

```bash
python3 -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

---

## Linux

```bash
python3 -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

---

# Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

# Install Project Dependencies

Install Django:

```bash
pip install django
```

Install Django REST Framework:

```bash
pip install djangorestframework
```

Install PostgreSQL database adapter:

```bash
pip install psycopg2-binary
```

Install CORS support:

```bash
pip install django-cors-headers
```

Install environment variable support:

```bash
pip install python-decouple
```

Install API documentation support:

```bash
pip install drf-spectacular
```

Install filtering support:

```bash
pip install django-filter
```

---

# Install All Dependencies at Once

Alternatively, install everything together:

```bash
pip install django djangorestframework psycopg2-binary django-cors-headers python-decouple drf-spectacular django-filter
```

---

# Save Installed Packages

Generate the requirements file.

```bash
pip freeze > requirements.txt
```

Install from the requirements file.

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=your_secret_key_here

DEBUG=True

DB_NAME=argus_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Never commit the `.env` file.

The `.env` file should remain listed inside `.gitignore`.

---

# Database Setup

Create a PostgreSQL database.

Example:

```
Database Name:
argus_db
```

Update the database credentials inside the `.env` file.

---

# Apply Database Migrations

```bash
python manage.py makemigrations
```

```bash
python manage.py migrate
```

---

# Create an Administrator Account

```bash
python manage.py createsuperuser
```

Follow the prompts to create the administrator credentials.

---

# Run the Development Server

```bash
python manage.py runserver
```

The backend will be available at:

```
http://127.0.0.1:8000/
```

---

# API Documentation

Interactive API documentation will be available after configuration.

Swagger UI

```
http://127.0.0.1:8000/api/docs/
```

OpenAPI Schema

```
http://127.0.0.1:8000/api/schema/
```

---

# API Endpoints

Example endpoints that will be implemented throughout the project.

```
GET    /api/sensors/
GET    /api/readings/
GET    /api/health/
GET    /api/alerts/

POST   /api/readings/
POST   /api/alerts/
```

---

# Frontend

The React frontend will be added during a later phase of development.

Once implemented, it will communicate with the Django backend through the REST API.

The frontend directory and setup instructions will be added as development progresses.

---

# Development Workflow

1. ESP32 or simulated sensors generate readings.
2. Django receives the data through REST API endpoints.
3. Sensor readings are validated and stored in PostgreSQL.
4. Machine health is calculated.
5. Risk levels and alerts are generated.
6. React retrieves processed data through the API.
7. Users monitor system status from the dashboard.

---



Amor

---

# License

This project is licensed under the MIT License.

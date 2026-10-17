# ARGUS
### Automated Risk & Guard Unified System

ARGUS is an Industrial Internet of Things (IIoT) project focused on machine condition monitoring and predictive maintenance. It combines sensor data, backend processing, and a web-based dashboard to help identify abnormal machine conditions, assess potential risks, and manage maintenance alerts.

## Features

- **Machine monitoring:** Monitors temperature, vibration, and load-related readings.
- **Risk assessment:** Evaluates machine conditions using configured rules.
- **Alert management:** Supports alert tracking and resolution workflows.
- **Web dashboard:** Provides an interface for viewing operational data.
- **Authentication:** Supports user registration, login, and password recovery.
- **API integration:** Connects the React frontend to the Django REST API.
- **IoT integration:** Uses an ESP32-based hardware design for sensor monitoring and local warning indicators.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| API communication | REST API, Axios |
| Authentication | JSON Web Tokens (JWT) |
| API documentation | OpenAPI / DRF Spectacular |
| Hardware | ESP32, Arduino-compatible sensors |

## System Architecture

ARGUS consists of four main components:

1. **Hardware:** Collects machine-condition readings.
2. **Backend:** Validates requests, processes application data, and manages alerts.
3. **Database:** Stores application and operational records.
4. **Frontend:** Displays available information through the React dashboard.

```text
ESP32 / Sensors
       |
       v
  Django REST API
       |
       v
   PostgreSQL
       |
       v
 React Dashboard
```

## Getting Started

### Prerequisites

Install the following:

- Python
- Node.js and npm
- Git
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/amorsaralynn08-arch/_ARGUS_.git
cd _ARGUS_
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd Argus-backend
```

Create and activate a virtual environment.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Configure the required environment variables and database credentials according to the Django settings.

Apply database migrations:

```bash
python manage.py migrate
```

Create an administrator account if required:

```bash
python manage.py createsuperuser
```

Start the backend server:

```bash
python manage.py runserver
```

The backend development server runs at:

`http://127.0.0.1:8000/`

### 3. Set Up the Frontend

Open a separate terminal in the repository root and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend API base URL to point to the Django backend, using the variable expected by the project's Axios configuration.

Start the development server:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal, typically:

`http://localhost:5173/`

Keep both development servers running while testing the application.

## Hardware

The hardware design uses an ESP32-based setup with sensors and local indicators for machine-condition monitoring.

| Component | Purpose |
|---|---|
| ESP32 DevKit | Microcontroller and connectivity |
| DS18B20 | Temperature measurement |
| SW-420 | Vibration detection |
| Potentiometer or load-sensing circuit | Load input or simulation |
| LEDs | Visual status indication |
| Buzzer | Audible warnings |

The intended status indicators are green for normal conditions, yellow for warnings, and red for critical conditions. Actual behavior depends on the implemented firmware and configured thresholds.

## Security

- Keep credentials and secret keys out of version control.
- Use appropriate authentication and permissions for protected endpoints.
- Validate incoming requests and sensor data.
- Restrict CORS origins in production.
- Disable Django debug mode in production.
- Use HTTPS for deployed applications.

## Project Scope

ARGUS demonstrates the integration of software engineering, embedded systems, and industrial monitoring concepts. Its capabilities depend on the implemented application logic and hardware integration.

The project is intended for educational and engineering purposes. It is not a certified industrial safety system or a replacement for validated industrial safety equipment.

## Author

**Saralynn Amor**


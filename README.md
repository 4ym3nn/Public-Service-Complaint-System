The public service complaint system is an idea I developed to centralize problem reporting in Algeria. Citizens (mwatin - those who belong to Algeria) can submit complaints by providing the location, detailed information, photos, and identifying the target audience.
We also provide an admin dashboard for officials to control and track these problems. The idea is currently scaling up.
so 
Front-end demo: https://complaint-system-pi.vercel.app
Back-end: Can be built with Docker using docker build -t complaint .

Project Structure:
Front-end (Next.js/React):

/app - Main application directory using App Router

/admin - Admin dashboard interface
/analytics - Analytics and reporting views
/dashboard - User dashboard for viewing complaints
/login - Authentication login page
/register - User registration page
/unauthorized - Access denied page
layout.tsx - Root layout component
page.tsx - Home page
globals.css - Global styles



Back-end (Django/Python):

manage.py - Django management script
requirements.txt - Python dependencies
Dockerfile - Container configuration
db.sqlite3 - SQLite database

Apps:

/admin - Django admin configuration (settings, URLs, WSGI/ASGI)
/users - User authentication and management

Models, serializers, views for user operations
Custom migrations


/complaints - Core complaint management system

Models for complaint data
Permissions and access control
Serializers for API responses
Signal handlers for automated actions
API views and URL routing
```mermaid
erDiagram
    USER ||--o{ COMPLAINT : submits
    USER ||--o{ COMPLAINT : manages
    COMPLAINT ||--o{ MEDIA : contains
    COMPLAINT }o--|| LOCATION : has
    COMPLAINT }o--|| STATUS : has

    USER {
        int id PK
        string username
        string email
        string password_hash
        string role
        datetime created_at
        boolean is_active
    }

    COMPLAINT {
        int id PK
        int user_id FK
        int assigned_to FK
        string title
        text description
        string status
        string priority
        string target_audience
        datetime created_at
        datetime updated_at
        datetime resolved_at
    }

    LOCATION {
        int id PK
        int complaint_id FK
        string wilaya
        string commune
        string address
        float latitude
        float longitude
    }

    MEDIA {
        int id PK
        int complaint_id FK
        string file_path
        string file_type
        datetime uploaded_at
    }

    STATUS {
        string value PK
        string display_name
    }
```


/myapp - Additional application module
/bruno - API testing collection (Bruno API client)"
    ``

# ⚙️ AI-Dev Stack — Backend

Spring Boot REST API for the AI-Dev Stack platform.

## 🛠️ Tech Stack

- **Java 21** — Programming language
- **Spring Boot 4** — Application framework
- **Spring Security** + **JWT** — Authentication and authorization
- **Spring Data JPA** + **Hibernate** — ORM and database access
- **PostgreSQL** — Relational database
- **Docker** + **Docker Compose** — Containerization
- **Springdoc OpenAPI** — API documentation (Swagger UI)

## 📁 Project Structure

```
src/main/java/kaua/AI_Dev_Stack/
├── controller/        # REST controllers
├── service/           # Business logic
├── repository/        # Data access layer
├── mapper/            # Entity to DTO mappers
├── model/             # JPA entities and enums
├── dto/
│   ├── request/       # Request DTOs
│   └── response/      # Response DTOs
├── security/          # JWT filter and service
├── exception/         # Custom exceptions and global handler
└── config/            # Security and data initializer config
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login and receive JWT token | Public |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users` | Register new user | Public |
| GET | `/users/me` | Get authenticated user profile | Required |
| PUT | `/users/me` | Update user profile | Required |
| DELETE | `/users/me` | Delete user account | Required |

### Tools
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tools` | List approved tools with filters and pagination | Public |
| POST | `/tools` | Suggest a new tool | Required |
| GET | `/tools/search` | Find tool by name | Public |
| GET | `/tools/filters` | Get available filter options | Public |
| GET | `/tools/pending` | List pending tools | Admin |
| POST | `/tools/{id}/upvote` | Toggle upvote on a tool | Required |
| PATCH | `/tools/{id}/approve` | Approve a tool suggestion | Admin |
| PATCH | `/tools/{id}/feature` | Toggle featured status | Admin |
| PUT | `/tools/{id}` | Update tool data | Admin |
| DELETE | `/tools/{id}` | Delete a tool | Admin |

### Tags
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tags` | List all tags | Public |
| POST | `/tags` | Create a new tag | Admin |
| PUT | `/tags/{id}` | Update a tag | Admin |
| DELETE | `/tags/{id}` | Delete a tag | Admin |

## ⚙️ Environment Variables

Create a `.env` file in the `Backend/` directory based on `.env.example`:

```env
# Database
DB_NAME=ai_dev_stack
DB_USER=postgres
DB_PASSWORD=your_password

# pgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin

# JWT
JWT_SECRET=your-secret-key-at-least-256-bits-long
JWT_EXPIRATION=86400000

# DataInitializer
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
USER_EMAIL=user@example.com
USER_PASSWORD=your_user_password
```

## 🚀 Getting Started

### Option 1 — Docker (Recommended)

```bash
# Navigate to the backend directory
cd Backend

# Copy the example env file and fill in your values
cp .env.example .env

# Start all services (API + PostgreSQL + pgAdmin)
docker-compose up --build
```

Services will be available at:
- **API** — `http://localhost:8081`
- **Swagger UI** — `http://localhost:8081/swagger-ui`
- **pgAdmin** — `http://localhost:8082`

### Option 2 — Local

### Prerequisites
- Java 21+
- Maven 3.9+
- PostgreSQL running locally

```bash
# Navigate to the backend directory
cd Backend

# Configure application.properties with your local database

# Build and run
mvn spring-boot:run
```

## 📖 API Documentation

With the backend running, access the full interactive API documentation at:

```
http://localhost:8081/swagger-ui
```

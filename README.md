
# Multi-Tenancy Demo

This project demonstrates a shared-schema multi-tenant architecture using NestJS and Prisma. Each "tenant" shares the same database schema, with a `tenantKey` field used to isolate data.

## Features

-   **JWT Authentication** (Passport + `passport-jwt`)
    
-   **Role-Based Access Control** (`ADMIN` | `USER`)
    
-   **Automatic Tenant Scoping** via Prisma middleware
    
-   **Admin API**:
    
    -   Create tenants (schools)
        
    -   Create grades
        
    -   Assign teachers to grades
        
-   **User API** (for teachers):
    
    -   Fetch own school info
        
    -   List assigned grades
        

## Getting Started

### Prerequisites

-   Node.js >= 16
    
-   PostgreSQL database
    
-   `npm` or `yarn`
    

### Installation

1.  Clone the repo:
    
    ```
    git clone https://github.com/your-org/multi-tenancy-demo.git
    cd multi-tenancy-demo/backend
    ```
    
2.  Install dependencies:
    
    ```
    npm install
    ```
    
3.  Configure environment variables in `.env`:
    
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
    JWT_SECRET="your_jwt_secret"
    ```
    

### Database Setup

1.  Apply migrations (or `db push` in prototyping):
    
    ```
    npx prisma migrate dev --name init
    # or
    npx prisma db push
    ```
    
2.  Seed a super-admin:
    
    ```
    npx prisma db seed
    ```
    

### Running the Server

```
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Auth

-   `POST /auth/login` — Obtain a JWT
    
-   `POST /auth/register` — Create a new teacher (ADMIN only)
    
-   `POST /auth/logout` — Stub endpoint to clear client-side token
    

### Admin (ADMIN role)

-   `POST /admin/tenants` — Create a new school
    
-   `POST /admin/grades` — Create a new grade (e.g. 11-B)
    
-   `POST /admin/assign-grade` — Assign a teacher to a grade
    

### User (USER role)

-   `GET /users/me/school` — Fetch current user’s school
    
-   `GET /users/me/grades` — List grades assigned to current user
    

## Tenant Isolation

Prisma middleware automatically injects `WHERE tenantKey = <currentUser.tenantKey>` on queries for `Grade` and `UserGrade`, ensuring no cross-tenant data leaks.



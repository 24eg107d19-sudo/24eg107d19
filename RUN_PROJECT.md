# Run the complete project

## Terminal 1 — Spring Boot

```cmd
cd backend
mvn spring-boot:run
```

Backend API:

```text
http://localhost:8080/api
```

## Terminal 2 — React

```cmd
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the React URL in the browser. Do not open `/api/auth/login` directly; that endpoint expects POST.

## MySQL

Create/use the `backend` database and check the username/password in:

`backend/src/main/resources/application.properties`

The backend uses JPA `ddl-auto=update`, so the entity tables are updated automatically when the application starts.

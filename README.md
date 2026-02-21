(Node.js Express + MySQL)

REST API untuk kebutuhan test **BackEnd**:  
- **Login (JWT)**
- **CRUD User**
- **Search real-time** dari data remote: `https://bit.ly/48ejMhW`  
  (filter berdasarkan **NAMA**, **NIM**, dan **YMD**)

> Semua endpoint **CRUD & Search** wajib autentikasi (Bearer Token) dari endpoint Login.

---

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Knex (SQL Query Builder)
- MySQL (XAMPP / MariaDB compatible)
- JWT Authentication

### Frontend (Optional)
- React + Vite + TypeScript (jika kamu pakai UI)

---

## Project Structure

```
adhivasindo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   └── searchController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   └── userModel.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── searchRoutes.ts
│   │   ├── services/
│   │   │   └── remoteDataService.ts
│   │   ├── utils/
│   │   │   ├── httpError.ts
│   │   │   └── validators.ts
│   │   └── server.ts
│   ├── migrations/
│   ├── seeds/
│   ├── knexfile.cjs
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/ (optional)
```

---

## Requirements Checklist (Adhivasindo)

- ✅ Framework: Node.js Express
- ✅ DB: MySQL (fields/columns disesuaikan kebutuhan)
- ✅ Auth:
  - Login endpoint menghasilkan JWT
  - Endpoint CRUD Users + Search wajib Bearer Token
- ✅ Real-time Search dari `https://bit.ly/48ejMhW`:
  - Search by **NAMA = Turner Mia**
  - Search by **NIM = 9352078461**
  - Search by **YMD = 20230405**
- ✅ GitHub commit history 

---

## Setup (Backend)

### Prerequisites
- Node.js v18+
- MySQL / MariaDB (disarankan: XAMPP MySQL ON)

### 1) Masuk ke folder backend
```bash
cd backend
```

### 2) Install dependencies
```bash
npm install
```

### 3) Copy env
Windows PowerShell:
```powershell
copy .env.example .env
```

### 4) Configure `.env`
Contoh (XAMPP default):
```env
PORT=4000

DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=career_api_db

JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=1d

REMOTE_DATA_URL=https://bit.ly/48ejMhW
```

### 5) Buat database (phpMyAdmin / CLI)
Database yang dipakai: `career_api_db`

### 6) Run migration + seed
```bash
npm run migrate
npm run seed
```

### 7) Run server
```bash
npm run dev
```

Backend berjalan di:
- `http://localhost:4000`

Health check:
- `GET http://localhost:4000/health`

---

## Dummy Admin Account (Seed)

Setelah `npm run seed`, otomatis ada user admin:

- **Email:** `admin@example.com`
- **Password:** `Admin12345!`

---

## Authentication Flow

1) Login untuk ambil token  
2) Gunakan token untuk akses endpoint protected (CRUD & Search)  

Header:
```
Authorization: Bearer <TOKEN>
```

---

## API Endpoints

### A) Login
**POST** `/api/auth/login`

Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "Admin12345!"
}
```

Response (contoh):
```json
{
  "success": true,
  "token": "....",
  "user": { "id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin" }
}
```

---

### B) CRUD Users (Protected)
> Semua endpoint di bawah wajib token

- **GET** `/api/users` — list users  
- **POST** `/api/users` — create user  
- **GET** `/api/users/:id` — get user by id  
- **PUT** `/api/users/:id` — update user  
- **DELETE** `/api/users/:id` — delete user  

Contoh create user:
**POST** `/api/users`
```json
{
  "name": "Test User",
  "email": "test.user@example.com",
  "password": "Password123!",
  "role": "user",
  "is_active": true
}
```

---

### C) Search by NAMA (Protected, Real-time)
**GET** `/api/search/name/:nama`

Contoh:
- `/api/search/name/Turner%20Mia`

---

### D) Search by NIM (Protected, Real-time)
**GET** `/api/search/nim/:nim`

Contoh:
- `/api/search/nim/9352078461`

---

### E) Search by YMD (Protected, Real-time)
**GET** `/api/search/ymd/:ymd`

Contoh:
- `/api/search/ymd/20230405`

---

## Postman / Swagger

- Pengujian API bisa memakai **Postman** (recommended) atau **Swagger**.
- Jika repo menyertakan collection Postman, import file JSON lalu jalankan request:
  1. Login
  2. Copy token
  3. Akses endpoint protected

---

## Database Tables (MySQL)

### `users`
- `id` (PK, int auto increment)
- `name` (varchar)
- `email` (varchar unique)
- `password_hash` (varchar)
- `role` (varchar)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)


## License
MIT

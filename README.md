# smartz-backend
# Smartz Backend

This repository contains the backend server for Smartz. The README below explains how to install dependencies, configure environment variables, and run the server locally on Windows (PowerShell).

## Requirements
- Node.js 18+ recommended
- npm (comes with Node.js)
- A Postgres database (if you intend to use DB features)

## Install
Open PowerShell in the project root (`c:\Users\Rithin Kumar\Desktop\smartz-backend`) and run:

This repository contains a small Express + Socket.IO backend for Smartz. The server exposes simple example endpoints for auth, vendor, customer, delivery and admin functionality and demonstrates real-time notifications using Socket.IO.

This README documents how to run the project, required environment variables, the available routes (from the existing code), example requests, and troubleshooting steps specific to this codebase.

## Requirements
- Node.js 18+ (the project uses `node --watch` in the `dev` script)
- npm

## Install
Open PowerShell in the project root (`c:\Users\Rithin Kumar\Desktop\smartz-backend`) and run:

```powershell
npm install
```

## Environment (.env)
Create a `.env` file in the project root with the following keys (adjust values for your environment):

```
PORT=5000
DATABASE_URL=postgres://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
```

- `PORT` — optional, defaults to 5000.
- `DATABASE_URL` — used by `config/db.js` to connect to Postgres. If you don't use the DB locally you can omit it but DB-related functionality will fail.
- `JWT_SECRET` — used by `middleware/authMiddleware.js` to verify JWT tokens.

## NPM scripts
- `npm run dev` — run `node --watch server.js` (fast reload with Node 18+)
- `npm start` — run `node server.js`

## How to run

Development (watch mode):

```powershell
npm run dev
```

Production:

```powershell
npm start
```

You can also temporarily set a different port in PowerShell for a single run:

```powershell
$env:PORT = 6000; node server.js
```

## Built-in routes (what's implemented)
The current code exports router modules mounted under `/api/*`. These are example endpoints (mostly returning placeholder JSON) and two endpoints demonstrate Socket.IO emits for real-time updates.

Base path: `/api`

- `/api/auth`
	- POST `/login` — returns { message: 'Login endpoint' }
	- POST `/register` — returns { message: 'Register endpoint' }

- `/api/vendor`
	- GET `/profile` — returns { message: 'Vendor profile endpoint' }
	- POST `/product` — returns { message: 'Add product endpoint' }
	- POST `/order/status` — update order status; emits `order_update` to the customer's socket room `user_<customerId>` with payload { orderId, status }

- `/api/customer`
	- GET `/orders` — returns { message: 'Customer orders endpoint' }
	- POST `/order` — create a new order (mock), emits `new_order` to `vendor_<vendorId>` with the order object

- `/api/delivery`
	- GET `/assignments` — returns { message: 'Delivery assignments endpoint' }
	- PUT `/status` — returns { message: 'Update delivery status endpoint' }

- `/api/admin`
	- GET `/dashboard` — returns { message: 'Admin dashboard endpoint' }
	- GET `/users` — returns { message: 'Manage users endpoint' }

- `/api/notifications`
	- POST `/register-token` — example endpoint to register a device token; expects JSON { userId, token }

Note: Most endpoints are placeholders and include comments where you should replace mock logic with your DB integration.

## Socket.IO usage
- The server attaches a Socket.IO instance to the HTTP server and stores it on the Express app via `app.set('io', io)` so routes can access it with `req.app.get('io')`.
- Example socket events used in code:
	- Client should join rooms with a pattern used in the code (examples): `user_<userId>` or `vendor_<vendorId>`.
	- When a new order is created (`POST /api/customer/order`), the server emits `new_order` to `vendor_<vendorId>`.
	- When order status is updated (`POST /api/vendor/order/status`), the server emits `order_update` to `user_<customerId>`.

Example client-side flow (pseudo):

1. Client connects to Socket.IO server.
2. Client emits `joinRoom` with its identity (e.g., `user_123` or `vendor_456`).
3. Server emits `new_order` or `order_update` to the appropriate room when events occur.

## Example requests

Create an order (mock):

```powershell
curl -X POST http://localhost:5000/api/customer/order -H "Content-Type: application/json" -d '{"customerId":1,"vendorId":2,"items":[{"productId":10,"qty":1}]}'
```

Update order status (mock):

```powershell
curl -X POST http://localhost:5000/api/vendor/order/status -H "Content-Type: application/json" -d '{"orderId":1690000000000,"customerId":1,"status":"shipped"}'
```

Register device token (example):

```powershell
curl -X POST http://localhost:5000/api/notifications/register-token -H "Content-Type: application/json" -d '{"userId":1,"token":"fcm_token_here"}'
```

## Healthcheck
The server exposes a root health endpoint:

```
GET /
```

It responds with: `🚀 Smartz Backend is running!`

## Troubleshooting & tips
- If you get an error that the port is already in use (EADDRINUSE), free the port or run on a different port. Example PowerShell commands:

```powershell
# find processes listening on port 5000
netstat -ano | Select-String ":5000"
# kill a process by PID (replace <PID> with the number you found)
taskkill /PID <PID> /F
```

Temporarily run on a different port:

```powershell
$env:PORT = 6000; node server.js
```

- The server now includes an error handler so EADDRINUSE prints a friendly message and exits.
- Database: `config/db.js` expects `DATABASE_URL` and uses `ssl: { rejectUnauthorized: false }`. If you want DB checks at startup I can add `initDB()` invocation with graceful handling.

## Next improvements (optional)
- Add `.env.example` with the required keys.
- Wire `config/db.js` into `server.js` with a safe startup sequence that waits for DB connection.
- Replace placeholder route logic with real DB queries and validations.
- Add automated tests for endpoints.

---
If you want, I can apply any of the next improvements above. Tell me which you prefer and I'll implement it.
npm start
```

---
If you want, I can also add a `.env.example` file, update `package.json` scripts, or provide a Dockerfile. Tell me which you'd like next.

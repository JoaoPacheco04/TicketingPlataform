# 🎟️ TicketFlow

A full-stack ticketing platform built to demonstrate real-world backend scalability patterns and a polished, production-style frontend. Built as a portfolio project to explore concurrency control, real-time updates, caching, and background job processing in a realistic domain: seat reservation for live events.

![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoftsqlserver)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis)

## Why this project

Most portfolio CRUD apps don't prove much about handling scale. This one is built around a deliberately hard problem: **preventing two people from reserving the same seat at the same time**, under real concurrent load — plus everything around it that a real ticketing platform needs (expiring holds, waiting queues, real-time seat maps, QR-code check-in).

## Key features

### For customers
- Browse and search live events
- Visual seat maps with three layout styles (straight rows, curved auditorium, table clusters)
- Real-time seat availability via SignalR — no page refresh needed
- Reserve a seat with a 10-minute hold, protected by optimistic concurrency
- Simulated checkout flow (no real payments processed)
- "My Tickets" page with QR-code boarding passes
- Virtual waiting queue for high-demand events

### For organizers
- Create venues, events, and seating sections (with bulk seat generation)
- Choose from multiple seat layout types per section
- Live sales dashboard: occupancy, revenue, reservation status breakdown
- QR-code check-in scanner for event entry
- Role-based access control (Organizer vs Customer)

## Architecture & scalability patterns

| Concern | Solution |
|---|---|
| **Concurrency** | Optimistic locking via EF Core `RowVersion` concurrency tokens — two simultaneous reservation attempts for the same seat resolve deterministically, with the loser receiving a clean `409 Conflict` |
| **Expiring holds** | Hangfire recurring job runs every minute, expiring unpaid `Pending` reservations and releasing the seat automatically |
| **Real-time updates** | SignalR hub broadcasts seat state changes to everyone viewing that event, grouped by event ID |
| **Caching** | Redis caches seat availability counts (10s TTL) to reduce database load during high-traffic sales windows |
| **Waiting queue** | Redis sorted sets implement a fair, ordered virtual queue with batch release |
| **Auth** | ASP.NET Core Identity + JWT, with role-based authorization (`Organizer` / `Customer`) on write endpoints |

## Tech stack

**Backend:** ASP.NET Core Web API (.NET 10) · Entity Framework Core · SQL Server · Redis (StackExchange.Redis) · Hangfire · SignalR · ASP.NET Core Identity + JWT · QRCoder

**Frontend:** React + TypeScript · Vite · Tailwind CSS v4 · TanStack Query · Zustand · React Router · Axios · Sonner (toasts) · Lucide icons

**Testing:** xUnit · Testcontainers (SQL Server in Docker) · FluentAssertions — real integration tests, not mocks, including a test that fires two concurrent reservation requests and asserts exactly one succeeds

## Screenshots

_(add screenshots here — event list, seat map, dashboard, checkout flow)_

## Getting started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- SQL Server (Express or full)
- Docker Desktop (for Redis and for running the test suite)

### Backend setup

```bash
# Start Redis
docker run --name redis-ticketing -p 6379:6379 --restart unless-stopped -d redis

# Configure the connection string in appsettings.json, then:
dotnet ef database update

# Run the API
dotnet run
```

The API runs at `https://localhost:7015` by default. Hangfire dashboard is available at `/hangfire`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Running tests

```bash
dotnet test
```

Requires Docker running — Testcontainers spins up a real, disposable SQL Server instance per test run.

## Known limitations / future work

- Waiting queue is implemented but not yet wired to automatically gate reservation access during high demand
- JWT signing key is stored in `appsettings.json` for local development — would move to environment variables / a secrets manager in production
- Payment flow is fully simulated — no real payment gateway integration
- No automated CI pipeline yet (GitHub Actions)

## License

Portfolio project — not intended for production use.

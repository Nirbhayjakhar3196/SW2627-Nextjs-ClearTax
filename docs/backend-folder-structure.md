# Backend Folder Structure

## Objective

The backend follows a layered architecture where each folder has a single responsibility.

## Folder Structure

```text
server/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
└── src/
	├── config/
	├── middleware/
	├── queues/
	├── repositories/
	├── routes/
	├── services/
	├── validations/
	└── workers/
```

## Responsibilities

### config/
Application configuration.

### controllers/
Not used in the current backend structure.

### services/
Business logic.

### routes/
API endpoints.

### repositories/
Prisma data access helpers.

### workers/
Background job processing.

### queues/
BullMQ queues.

### parsers/
CSV parsing is handled in the upload service and worker.

### validators/
Invoice validation.

### middleware/
JWT authentication and request guards.

### utils/
Helper functions.

### events/
Not used. Progress is exposed through polling endpoints.

### constants/
Not used as a standalone folder in the current implementation.

## Notes

- There is no separate controllers folder in the current implementation.
- There is no separate models folder; Prisma models live in `schema.prisma`.
- CSV parsing happens in the worker and upload service.
- There is no SSE implementation; progress is exposed through polling endpoints.

## Benefits

- Scalable
- Maintainable
- Easy testing
- Separation of concerns
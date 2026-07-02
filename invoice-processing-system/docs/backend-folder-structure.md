# Backend Folder Structure

## Objective

The backend follows a layered architecture where each folder has a single responsibility.

## Folder Structure

(Add the complete tree.)

## Responsibilities

### config/
Application configuration.

### controllers/
Receive HTTP requests and send responses.

### services/
Business logic.

### routes/
API endpoints.

### models/
MongoDB schemas.

### workers/
Background job processing.

### queues/
BullMQ queues.

### parsers/
CSV parsing.

### validators/
Invoice validation.

### middlewares/
Reusable request middleware.

### utils/
Helper functions.

### events/
SSE implementation.

### constants/
Application constants.

## Benefits

- Scalable
- Maintainable
- Easy testing
- Separation of concerns
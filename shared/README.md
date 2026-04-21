# @hotelsonweb/shared

Shared Zod schemas and types used across both backend and frontend applications.

## Purpose

This package centralizes validation schemas to ensure consistency between client and server validation, eliminating duplication and preventing validation mismatches.

## Usage

### Backend

```typescript
import { LoginSchema, RegisterSchema } from '@hotelsonweb/shared';
import { z } from 'zod';

// Wrap shared schemas for request validation
export const loginSchema = z.object({
  body: LoginSchema,
});
```

### Frontend (with react-hook-form)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginInput } from '@hotelsonweb/shared';

const form = useForm<LoginInput>({
  resolver: zodResolver(LoginSchema),
});
```

## Building

```bash
npm install
npm run build
```

The build output goes to `dist/` directory.

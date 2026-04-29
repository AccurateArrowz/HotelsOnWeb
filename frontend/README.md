# HotelsOnWeb Frontend

React 19 SPA for the HotelsOnWeb booking platform. Features role-based dashboards, real-time search, and a streamlined booking flow.

## Quick Start

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run test` | Run Jest tests |
| `npm run lint` | ESLint validation |

## Tech Stack

- **Database**: PostgreSQL 17+ (hosted on [Neon](https://neon.tech))
- **Language**: TypeScript 5
- **Build Tool**: Vite 7
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library

## Project Structure

```
src/
├── app/                    # Application shell
│   ├── App.jsx            # Main router and providers
│   ├── pages/             # Landing and utility pages
│   └── store/             # Global state (Redux) and base API
│       ├── baseApi.ts     # RTK Query configuration
│       └── hooks.ts       # Typed Redux hooks
│
├── features/              # Feature-sliced domain modules
│   ├── auth/              # Authentication and user profiles
│   ├── hotels/            # Hotel discovery and details
│   ├── bookings/          # Reservations and guest flows
│   ├── owner/             # Hotel owner management tools
│   ├── admin/             # Platform-wide administration
│   └── ... (see src/features for details)
│
├── shared/                # Cross-cutting concerns
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utilities (toast, formatters)
│
└── services/              # External service configurations
```

## Architecture Decisions

### Feature-Based Organization
Code is organized by domain feature rather than technical type. Each feature contains its own components, hooks, and API slices.

### RTK Query for Data Fetching
- Automatic caching and cache invalidation
- Optimistic updates for booking operations
- Standardized error handling via baseApi.ts

### Route-Level Code Splitting
All page components are lazy-loaded with Suspense fallback:
```tsx
const HotelsPage = lazy(() => import('@features/hotels/pages/HotelsPage'));
```

### Path Aliases
Configured in `vite.config.js` and `tsconfig.json`:
- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`

### Form Handling Pattern
```tsx
const schema = z.object({ ... });
type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API URL |
| `VITE_IMAGEKIT_PUBLIC_KEY` | Yes | ImageKit public key |
| `VITE_IMAGEKIT_URL_ENDPOINT` | Yes | ImageKit URL endpoint |

## Key Components

### Authentication Flow
- `RequireAuth` wrapper for protected routes
- `RequireRole` wrapper for role-based access (owner, admin)


### Toast Notifications
Global toast utility for user feedback:
```tsx
import { toast } from '@shared/utils/toast';

toast.success('Booking confirmed');
toast.error('Payment failed');
toast.info('Processing...');
```

### Image Upload
ImageKit integration with authentication:
- Server-side auth endpoint for secure uploads
- Automatic optimization and transformation
- Progress indication during upload

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test -- --coverage
```

Test files co-located with source files: `Component.test.tsx`

## Build Configuration

### Vite Config Highlights
- Path aliases for clean imports
- Tailwind CSS v4 integration
- TypeScript checking in dev mode

### Production Considerations
- Environment variables must be set in deployment platform
- API base URL should point to production backend
- ImageKit keys must be valid for production bucket

## Common Issues

### HMR Not Working
Ensure `@vitejs/plugin-react` is up to date.

### TypeScript Path Resolution
Restart IDE after modifying `tsconfig.json` paths.

### API Cold Start
Backend on Render free tier—first request may take 50-60 seconds. Toast notification shown automatically.

## Deployment

### Vercel
1. Import GitHub repository
2. Set framework preset to "Vite"
3. Add environment variables
4. Deploy

Build settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

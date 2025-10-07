# OCAI Hub

A production-ready web application for organizational culture assessment using the Organizational Culture Assessment Instrument (OCAI). Built with Next.js, TypeScript, Prisma, PostgreSQL, and modern web technologies.

## Features

- **Role-Based Access Control (RBAC)**: OrgAdmin, Facilitator, and Employee roles
- **Survey Management**: Create, manage, and analyze culture assessment surveys
- **Data Visualization**: Interactive radar and bar charts using Chart.js
- **Export Capabilities**: PDF and CSV export for survey data
- **Authentication**: NextAuth with email and optional Google SSO
- **Security**: Rate limiting, IP hashing, and row-level security
- **Accessibility**: WCAG-AA compliant design
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Chart.js with react-chartjs-2
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Export**: jsPDF, Papa Parse

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ocai-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ocai_hub?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Provider
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@ocai-hub.com"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# IP Hashing Salt
IP_HASH_SALT="your-ip-hash-salt-here"
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses the following main models:

- **Organization**: Company information and settings
- **User**: User accounts with role-based access
- **Survey**: Culture assessment surveys
- **Response**: Individual survey responses
- **Invitation**: Survey invitation management
- **Aggregate**: Calculated survey statistics
- **Comment**: Survey comments and feedback
- **Report**: Generated reports and analytics

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User sign out

### Surveys
- `GET /api/surveys` - List surveys
- `POST /api/surveys` - Create survey
- `GET /api/surveys/[id]` - Get survey details
- `POST /api/surveys/[id]/respond` - Submit survey response

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Generate report
- `GET /api/export/[id]` - Export survey data

## Role-Based Access Control

### OrgAdmin
- Full access to all features
- User management
- Organization settings
- Survey creation and management
- Report generation and export

### Facilitator
- Survey creation and management
- Report generation and export
- Response analysis
- Limited user management

### Employee
- View assigned surveys
- Submit responses
- View personal results

## Security Features

- **Rate Limiting**: Configurable rate limits on API endpoints
- **IP Hashing**: Salted IP hashing for privacy protection
- **Row-Level Security**: Organization-scoped data access
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in NextAuth protection

## Deployment

### Vercel + Neon

1. Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

2. Set up Neon PostgreSQL database
3. Configure environment variables in Vercel dashboard
4. Run database migrations:
```bash
npx prisma migrate deploy
```

### Environment Variables for Production

Ensure all environment variables are properly configured in your production environment, especially:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Email provider credentials
- OAuth provider credentials

## Development

### Code Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── charts/         # Chart components
│   ├── dashboard/      # Dashboard components
│   ├── providers/      # Context providers
│   └── surveys/        # Survey-related components
├── lib/                # Utility functions and configurations
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma client
│   ├── security.ts     # Security utilities
│   └── validations.ts  # Zod schemas
└── middleware.ts        # Next.js middleware
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
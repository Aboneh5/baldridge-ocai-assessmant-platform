# Deployment Guide

This guide covers deploying OCAI Hub to Vercel with Neon PostgreSQL.

## Prerequisites

- Vercel account
- Neon account (or any PostgreSQL provider)
- Domain name (optional)

## Step 1: Set up Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://username:password@hostname/database?sslmode=require`)
4. Save this as your `DATABASE_URL`

## Step 2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

4. Follow the prompts to configure your project

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

### Required Variables

```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Email Configuration (Required for authentication)

```
EMAIL_SERVER_HOST=smtp.your-provider.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@domain.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@your-domain.com
```

### Google OAuth (Optional)

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Security Configuration

```
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
IP_HASH_SALT=your-random-salt-string
```

## Step 4: Run Database Migrations

After deployment, run the database migrations:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's built-in database migration:

1. Go to your Vercel project dashboard
2. Navigate to the "Functions" tab
3. Create a new serverless function to run migrations

## Step 5: Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run db:seed
```

## Step 6: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable

## Step 7: Set up Email Provider

### Option 1: Resend (Recommended)

1. Sign up at [Resend](https://resend.com/)
2. Verify your domain
3. Use these settings:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your API key

### Option 2: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Use these settings:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: Your API key

### Option 3: Gmail (Development only)

1. Enable 2-factor authentication
2. Generate an app password
3. Use these settings:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: Your Gmail address
   - Password: Your app password

## Step 8: Set up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Client Secret to Vercel environment variables

## Step 9: Monitor and Maintain

### Health Checks

- Monitor your Vercel functions for errors
- Check database connection health
- Monitor email delivery rates

### Updates

To update your deployment:

```bash
git push origin main
vercel --prod
```

### Database Backups

Neon provides automatic backups, but consider:
- Regular database exports
- Point-in-time recovery setup
- Cross-region replication for critical data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Ensure SSL is enabled
   - Verify network access

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Ensure email provider is configured

3. **Email Delivery Problems**
   - Check SMTP credentials
   - Verify domain authentication
   - Check spam folders

4. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Check TypeScript compilation

### Support

- Check Vercel logs in dashboard
- Monitor Neon database logs
- Review Next.js build output
- Check browser console for client-side errors

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to git
   - Use Vercel's environment variable encryption
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL/TLS
   - Implement row-level security

3. **Application Security**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Implement proper error handling

## Performance Optimization

1. **Database**
   - Use connection pooling
   - Optimize queries
   - Add appropriate indexes

2. **Application**
   - Enable Vercel's edge caching
   - Optimize images and assets
   - Use CDN for static content

3. **Monitoring**
   - Set up Vercel Analytics
   - Monitor Core Web Vitals
   - Track API response times

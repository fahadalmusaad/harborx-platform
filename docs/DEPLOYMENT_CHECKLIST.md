# HarborX Render Deployment Checklist

This checklist guides you through deploying HarborX to Render.

## Pre-Deployment Checklist

- [ ] GitHub repository is pushed and up to date
- [ ] You have a Render account (https://render.com)
- [ ] You have reviewed the README.md "Deploy to Render" section

## Deployment Steps

### 1. Connect Repository to Render

- [ ] Log in to Render dashboard (https://dashboard.render.com)
- [ ] Click "New" → "Blueprint"
- [ ] Connect your GitHub account if not already connected
- [ ] Select repository: `fahadalmusaad/harborx-platform`
- [ ] Render detects `render.yaml` automatically

### 2. Apply Blueprint

- [ ] Review the Blueprint preview showing:
  - 3 web services (harborx-web, harborx-auth, harborx-core)
  - 1 PostgreSQL database (harborx-postgres)
  - 1 Redis instance (harborx-redis)
- [ ] Click "Apply" to create all resources
- [ ] Wait for initial deployment (5-10 minutes)

### 3. Configure Environment Variables

After services are created, configure these in the Render dashboard:

#### harborx-web Service
- [ ] Navigate to harborx-web service
- [ ] Go to "Environment" tab
- [ ] Set `NEXT_PUBLIC_API_URL` to: `https://harborx-core.onrender.com`
- [ ] Click "Save Changes"

#### harborx-auth Service
- [ ] Navigate to harborx-auth service
- [ ] Go to "Environment" tab
- [ ] Verify `JWT_SECRET_KEY` was auto-generated (should show as hidden)
- [ ] Set `CORS_ORIGINS` to: `https://harborx-web.onrender.com`
- [ ] Click "Save Changes"

#### harborx-core Service
- [ ] Navigate to harborx-core service
- [ ] Go to "Environment" tab
- [ ] Set `CORS_ORIGINS` to: `https://harborx-web.onrender.com`
- [ ] Set `AUTH_SERVICE_URL` to: `https://harborx-auth.onrender.com`
- [ ] Click "Save Changes"

### 4. Verify Services

After environment variables are set, services will redeploy automatically.

- [ ] Check harborx-web health: `https://harborx-web.onrender.com/api/health`
  - Should return: `{"status": "healthy", "service": "harborx-web", ...}`
- [ ] Check harborx-auth health: `https://harborx-auth.onrender.com/health`
  - Should return: `{"status": "healthy", "service": "harborx-auth", ...}`
- [ ] Check harborx-core health: `https://harborx-core.onrender.com/health`
  - Should return: `{"status": "healthy", "service": "harborx-core", ...}`

### 5. Test End-to-End

- [ ] Visit web app: `https://harborx-web.onrender.com`
- [ ] Verify page loads correctly
- [ ] Check browser console for errors
- [ ] Test API connectivity (if implemented)

## Post-Deployment

### Enable Auto-Deploy
- [ ] Verify auto-deploy is enabled for all services (should be by default)
- [ ] Test by pushing a small change to `main` branch
- [ ] Verify Render automatically deploys the change

### Set Up Monitoring
- [ ] Review logs for each service in Render dashboard
- [ ] Configure email notifications for deployment failures (optional)
- [ ] Set up external monitoring (e.g., UptimeRobot) for health endpoints (optional)

### Documentation
- [ ] Update team documentation with service URLs
- [ ] Share environment variable configuration with team (via secure channel)
- [ ] Document any custom configurations or deviations from defaults

## Troubleshooting

### Service Won't Start
1. Check logs in Render dashboard
2. Verify build completed successfully
3. Check environment variables are set correctly
4. Verify health check endpoint returns 200 OK

### Services Can't Communicate
1. Verify service URLs in environment variables match Render URLs
2. Check CORS settings
3. Review network logs in browser developer tools

### Database Connection Issues
1. Verify DATABASE_URL is set correctly
2. Check PostgreSQL service is running
3. Review connection pool settings

### Deployment Fails
1. Check build logs for errors
2. Verify dependencies are correct in requirements.txt or package.json
3. Ensure start commands are correct
4. Rollback to previous version if needed

## Rollback Procedure

If deployment fails and you need to rollback:

1. [ ] Go to service in Render dashboard
2. [ ] Click "Events" or "Deploys" tab
3. [ ] Find previous successful deployment
4. [ ] Click "Rollback to this version"
5. [ ] Verify service is healthy after rollback

Alternatively, revert the commit in GitHub:
```bash
git revert HEAD
git push origin main
```

## Success Criteria

Deployment is complete when:
- [ ] All 3 services show "Live" status in Render dashboard
- [ ] All health checks return 200 OK with correct JSON
- [ ] Web application loads without errors
- [ ] Auto-deploy works (tested with a commit)
- [ ] No secrets committed to repository (verified)

## Support Resources

- Render Documentation: https://render.com/docs
- Render Status Page: https://status.render.com
- HarborX README: https://github.com/fahadalmusaad/harborx-platform/blob/main/README.md
- ADR 001: Deployment Architecture in `docs/adr/001-render-deployment-architecture.md`

---

**Note**: Service URLs may differ based on your Render region. Always use the exact URLs shown in your Render dashboard.

# Security Configuration

## Important Security Notes

### 1. JWT Secret
- **CRITICAL**: Change the JWT_SECRET in production
- Use a long, random string (at least 32 characters)
- Never commit the real secret to version control
- Consider using different secrets for different environments

### 2. Password Security
- Passwords are now hashed using bcrypt with 12 salt rounds
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### 3. Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 attempts per 15 minutes per IP
- Product operations: 10 requests per minute per IP
- Cart operations: 30 requests per minute per IP

### 4. Security Headers
- Helmet.js configured for security headers
- Content Security Policy enabled
- HSTS enabled for HTTPS
- X-Frame-Options set to deny

### 5. Input Validation
- All user inputs are validated using Joi and express-validator
- XSS protection through input sanitization
- SQL injection prevention through parameterized queries

### 6. Account Security
- Account lockout after 5 failed login attempts
- Locked accounts are unlocked after 2 hours
- JWT tokens expire after 24 hours

## Environment Variables Required

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
BCRYPT_SALT_ROUNDS=12
MONGO_DB_URL="your-mongodb-connection-string"
NODE_ENV=production
```

## Additional Security Recommendations

1. **HTTPS**: Always use HTTPS in production
2. **MongoDB**: Enable authentication and use Atlas security features
3. **Firewall**: Configure proper firewall rules
4. **Monitoring**: Implement logging and monitoring for security events
5. **Backup**: Regular security audits and backups
6. **Updates**: Keep dependencies updated regularly

## Testing Security

After implementing these changes:

1. Test password hashing by creating a new user
2. Verify rate limiting by making multiple requests
3. Test JWT token expiration
4. Verify input validation with invalid data
5. Test account lockout with wrong passwords

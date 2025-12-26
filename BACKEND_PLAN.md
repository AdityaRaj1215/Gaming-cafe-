# Gaming Lounge Backend Implementation Plan

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Implementation Phases](#implementation-phases)
7. [File Structure](#file-structure)
8. [Development Setup](#development-setup)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)

---

## 🛠 Technology Stack

### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: **JavaScript (ES6+)** ⭐ Recommended
  - ✅ Same language as your React frontend
  - ✅ Faster to develop and iterate
  - ✅ No compilation step needed
  - ✅ Easier to learn and maintain
  - ✅ Huge ecosystem and community
  - ✅ Perfect for MVP and rapid development
- **Database**: PostgreSQL (via Supabase or standalone)
- **ORM**: Prisma (works great with JS) or Sequelize
- **Authentication**: JWT + bcrypt
- **Validation**: Joi (great for JS) or express-validator
- **File Upload**: Multer + Cloudinary

> **Note**: TypeScript is optional if you want type safety later. JavaScript is perfectly fine and often faster to develop with!

### Additional Services
- **Real-time**: Socket.io (for seat booking updates)
- **Payments**: Stripe API
- **Email**: Nodemailer + SendGrid
- **Caching**: Redis (optional, for performance)
- **Environment**: dotenv

### Development Tools
- **Testing**: Jest + Supertest
- **Linting**: ESLint
- **Formatting**: Prettier
- **API Docs**: Swagger/OpenAPI

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── booking.controller.js
│   │   ├── event.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Booking.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── booking.routes.js
│   │   ├── event.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── booking.service.js
│   │   ├── event.service.js
│   │   ├── payment.service.js
│   │   └── email.service.js
│   ├── utils/
│   │   ├── jwt.util.js
│   │   ├── bcrypt.util.js
│   │   ├── validation.util.js
│   │   └── logger.util.js
│   ├── app.js
│   └── server.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Seats Table
```sql
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  row_label VARCHAR(5) NOT NULL,
  seat_number INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(row_label, seat_number)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  duration_hours INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Booking Seats Table (Many-to-Many)
```sql
CREATE TABLE booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID REFERENCES seats(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(booking_id, seat_id)
);
```

### Seat Availability Table (for time slots)
```sql
CREATE TABLE seat_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID REFERENCES seats(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seat_id, booking_date, time_slot)
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  prize_pool VARCHAR(100),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Event Registrations Table
```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'registered',
  UNIQUE(event_id, user_id)
);
```

---

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh            - Refresh access token
GET    /api/auth/me                - Get current user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
POST   /api/auth/verify-email      - Verify email address
```

### Product Routes
```
GET    /api/products               - Get all products (with filters)
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product (admin)
PUT    /api/products/:id          - Update product (admin)
DELETE /api/products/:id          - Delete product (admin)
GET    /api/products/categories   - Get all categories
```

### Cart Routes
```
GET    /api/cart                  - Get user's cart
POST   /api/cart                  - Add item to cart
PUT    /api/cart/:itemId          - Update cart item quantity
DELETE /api/cart/:itemId          - Remove item from cart
DELETE /api/cart                  - Clear entire cart
```

### Order Routes
```
GET    /api/orders                - Get user's orders
GET    /api/orders/:id            - Get single order
POST   /api/orders                - Create order from cart
POST   /api/orders/:id/cancel     - Cancel order
GET    /api/orders/:id/invoice   - Get order invoice
```

### Booking Routes
```
GET    /api/bookings              - Get user's bookings
GET    /api/bookings/:id         - Get single booking
POST   /api/bookings              - Create new booking
PUT    /api/bookings/:id          - Update booking
DELETE /api/bookings/:id          - Cancel booking
GET    /api/bookings/availability - Check seat availability
GET    /api/bookings/seats        - Get all seats
GET    /api/bookings/time-slots   - Get available time slots
```

### Event Routes
```
GET    /api/events                - Get all events (with filters)
GET    /api/events/:id            - Get single event
POST   /api/events                - Create event (admin)
PUT    /api/events/:id           - Update event (admin)
DELETE /api/events/:id           - Delete event (admin)
POST   /api/events/:id/register  - Register for event
DELETE /api/events/:id/register - Unregister from event
GET    /api/events/:id/participants - Get event participants
```

### Payment Routes
```
POST   /api/payments/create-intent - Create payment intent (Stripe)
POST   /api/payments/webhook      - Stripe webhook handler
GET    /api/payments/:id          - Get payment status
```

### User Routes
```
GET    /api/users/profile         - Get user profile
PUT    /api/users/profile         - Update user profile
GET    /api/users/bookings        - Get user bookings
GET    /api/users/orders          - Get user orders
```

---

## 🔐 Authentication & Authorization

### JWT Strategy
- **Access Token**: Short-lived (15 minutes), stored in memory
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
- **Token Payload**: `{ userId, email, role }`

### Roles
- **customer**: Default role, can book seats, purchase products, register for events
- **admin**: Full access, can manage products, events, bookings

### Middleware
```javascript
// auth.middleware.js
- verifyToken: Verify JWT token
- requireAuth: Require authentication
- requireRole: Require specific role (admin)
- optionalAuth: Optional authentication
```

---

## 📅 Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up project structure and basic infrastructure

**Tasks**:
- [ ] Initialize Node.js + JavaScript project
- [ ] Set up Express.js server
- [ ] Configure database (PostgreSQL + Prisma)
- [ ] Set up environment variables
- [ ] Create database schema
- [ ] Set up authentication middleware
- [ ] Create error handling middleware
- [ ] Set up logging system
- [ ] Configure CORS for frontend

**Why JavaScript?**
- ✅ Same language as your React frontend - no context switching
- ✅ Faster development - no compilation step
- ✅ Easier to learn and maintain
- ✅ Huge ecosystem and community support
- ✅ Perfect for MVP and rapid iteration
- ✅ Can always add TypeScript later if needed

**Deliverables**:
- Working server on localhost
- Database connection established
- Basic middleware in place

---

### Phase 2: Authentication (Week 1-2)
**Goal**: User registration, login, and JWT tokens

**Tasks**:
- [ ] Implement user registration
- [ ] Implement user login
- [ ] Implement JWT token generation
- [ ] Implement refresh token mechanism
- [ ] Implement password hashing (bcrypt)
- [ ] Implement email verification
- [ ] Implement password reset flow
- [ ] Create user profile endpoints

**Deliverables**:
- Users can register and login
- JWT tokens working
- Protected routes functional

---

### Phase 3: Products & E-commerce (Week 2-3)
**Goal**: Product management and shopping cart

**Tasks**:
- [ ] Create product CRUD operations
- [ ] Implement product filtering and search
- [ ] Create shopping cart functionality
- [ ] Implement cart persistence
- [ ] Create order management
- [ ] Integrate Stripe payment
- [ ] Implement order status tracking
- [ ] Create invoice generation

**Deliverables**:
- Products can be managed
- Shopping cart fully functional
- Orders can be placed and paid

---

### Phase 4: Seat Booking (Week 3-4)
**Goal**: Seat booking system with real-time updates

**Tasks**:
- [ ] Create seat management system
- [ ] Implement seat availability checking
- [ ] Create booking creation
- [ ] Implement booking cancellation
- [ ] Set up Socket.io for real-time updates
- [ ] Create booking payment integration
- [ ] Implement booking confirmation emails
- [ ] Create booking management dashboard

**Deliverables**:
- Seats can be booked
- Real-time availability updates
- Booking payments working

---

### Phase 5: Events (Week 4-5)
**Goal**: Event management and registration

**Tasks**:
- [ ] Create event CRUD operations
- [ ] Implement event filtering
- [ ] Create event registration system
- [ ] Implement participant management
- [ ] Create event notifications
- [ ] Implement event capacity management
- [ ] Create event calendar view

**Deliverables**:
- Events can be created and managed
- Users can register for events
- Event capacity tracking

---

### Phase 6: Advanced Features (Week 5-6)
**Goal**: Additional features and optimizations

**Tasks**:
- [ ] Implement email notifications
- [ ] Create admin dashboard endpoints
- [ ] Implement analytics endpoints
- [ ] Add caching with Redis (optional)
- [ ] Implement file upload for images
- [ ] Create API documentation (Swagger)
- [ ] Add rate limiting
- [ ] Implement request validation

**Deliverables**:
- Email notifications working
- Admin features complete
- API documentation ready

---

### Phase 7: Testing & Security (Week 6-7)
**Goal**: Comprehensive testing and security hardening

**Tasks**:
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Security audit
- [ ] Implement input sanitization
- [ ] Add SQL injection prevention
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Security headers configuration

**Deliverables**:
- Test coverage > 80%
- Security vulnerabilities addressed
- Production-ready code

---

### Phase 8: Deployment (Week 7-8)
**Goal**: Deploy to production

**Tasks**:
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline
- [ ] Deploy to hosting (Railway, Render, AWS)
- [ ] Set up monitoring (Sentry)
- [ ] Configure domain and SSL
- [ ] Performance optimization
- [ ] Load testing

**Deliverables**:
- Backend deployed and accessible
- Monitoring in place
- Documentation complete

---

## 📝 File Structure Details

### Key Files to Create

#### 1. `package.json`
```json
{
  "name": "gaming-lounge-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "lint": "eslint src/**/*.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "stripe": "^12.0.0",
    "socket.io": "^4.6.0",
    "nodemailer": "^6.9.0",
    "multer": "^1.4.5",
    "cloudinary": "^1.40.0",
    "dotenv": "^16.3.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.0",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.50.0"
  }
}
```

> **Note**: Using `"type": "module"` enables ES6 imports. If you prefer CommonJS, remove this and use `require()` instead.

#### 2. `.env.example`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gaming_lounge

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@gaminglounge.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test individual functions and utilities
- Mock external dependencies
- Test business logic

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows

### E2E Tests
- Test complete user flows
- Test payment processing
- Test booking system

### Test Coverage Goals
- Minimum 80% code coverage
- All critical paths tested
- All error cases handled

---

## 🚀 Deployment

### Recommended Platforms
1. **Railway** - Easy deployment, good for startups
2. **Render** - Free tier available, easy setup
3. **AWS EC2/ECS** - More control, scalable
4. **DigitalOcean** - Simple, affordable
5. **Heroku** - Easy but more expensive

### Deployment Checklist
- [ ] Production database configured
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] Performance monitoring active

---

## 📊 Success Metrics

### Performance
- API response time < 200ms
- Database query time < 50ms
- 99.9% uptime

### Security
- All endpoints authenticated
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- Rate limiting active

### Code Quality
- ESLint passing
- Consistent code style (Prettier)
- Test coverage > 80%
- Code reviews completed
- JSDoc comments for documentation

---

## 🎯 Next Steps

1. **Choose your stack** (Node.js + Express recommended)
2. **Set up development environment**
3. **Create database schema**
4. **Start with Phase 1** (Foundation)
5. **Follow phases sequentially**
6. **Test as you build**
7. **Deploy incrementally**

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

**Ready to start?** Begin with Phase 1 and work through each phase systematically. Good luck! 🚀


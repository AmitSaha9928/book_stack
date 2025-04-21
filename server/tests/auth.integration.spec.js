require('dotenv').config();  // Loads environment variables from .env file

const request = require('supertest');  // Supertest for making HTTP requests in tests
const mongoose = require('mongoose');  // Mongoose for MongoDB interactions
const path = require('path');  // Path module for handling file paths
const { app } = require('../app');  // Import the Express app
const routermanager = require('../routermanager');  // Import the router manager to configure routes

// Mount routes onto Express app
routermanager();

beforeAll(async () => {
  // Connect to MongoDB before tests
  await mongoose.connect(process.env.URI);
});

afterEach(async () => {
  // Clean up the users collection after each test to maintain a fresh state
  await mongoose.connection.collection('users').deleteMany({});
});

afterAll(async () => {
  // Disconnect from MongoDB after all tests are finished
  await mongoose.disconnect();
});

describe('Auth API Integration', () => {
  it('POST /auth/register → 201 and returns user data', async () => {
    // Test the registration endpoint with sample user data
    const res = await request(app)
      .post('/auth/register')
      .field('firstName', 'Test')
      .field('lastName', 'User')
      .field('phoneNumber', '1234567890')
      .field('userRole', '1')
      .field('username', 'testuser')
      .field('email', 'test@example.com')
      .field('password', 'Password123')
      .attach('userImg', path.join(__dirname, 'fixtures/avatar.png'))  // Attach an avatar image
      .expect('Content-Type', /json/)  // Expect JSON response
      .expect(201);  // Expect HTTP status 201 (Created)

    // Validate the response contains user ID and success message
    expect(res.body).toHaveProperty('data._id');
    expect(res.body.message).toBe('User created successfully');
  });

  it('POST /auth/login → should fail login for non-existent user', async () => {
    // Test login with a non-existent user
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'noone@example.com', password: 'nopass' })  // Invalid credentials
      .expect('Content-Type', /json/)  // Expect JSON response
      .expect(404);  // Expect HTTP status 404 (Not Found)

    // Validate error message for non-existent user
    expect(res.body.message).toBe('User not found');
  });
});

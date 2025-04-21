const bcrypt = require('bcryptjs');  // Bcrypt for hashing and comparing passwords
const jwt = require('jsonwebtoken');  // JWT for generating authentication tokens
const path = require('path');  // Path for handling file paths

// Importing services and models used in the authentication flow
const authService = require('../services/authServices/authServices.js');
const userModel = require('../models/usersModel/usersModel.js');
const missingInputs = require('../utils/missingInputs/missingInputs.js');

// Mocking dependencies to control their behavior during tests
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('path', () => ({ basename: jest.fn().mockReturnValue('profile.jpg') }));
jest.mock('../models/usersModel/usersModel.js');
jest.mock('../utils/missingInputs/missingInputs.js');

describe('authServices.registerUserService', () => {
  afterEach(() => jest.clearAllMocks());  // Reset all mocks after each test

  it('returns missing-inputs error when a required field is blank', async () => {
    // Mock missing input error response
    missingInputs.mockReturnValue({ status: 422, error: true, message: 'firstName is missing', data: null });

    const req = { body: { firstName: '', lastName: '', phoneNumber: '', userRole: '', username: '', email: '', password: '' } };
    const res = await authService.registerUserService(req);

    // Ensure missingInputs function was called with the correct field name
    expect(missingInputs).toHaveBeenCalledWith('', 'firstName');
    expect(res).toEqual({ status: 422, error: true, message: 'firstName is missing', data: null });
  });

  it('returns 409 if user already exists', async () => {
    // Mock successful check for existing user
    missingInputs.mockReturnValue(null);
    userModel.findOne.mockResolvedValue({ _id: 'u1', email: 'a@b.com' });

    const req = { body: { firstName: 'A', lastName: 'B', phoneNumber: '123', userRole: 1, username: 'ab', email: 'a@b.com', password: 'pwd' } };
    const res = await authService.registerUserService(req);

    // Ensure the findOne query checks both email and username
    expect(userModel.findOne).toHaveBeenCalledWith({ $or: [{ email: 'a@b.com' }, { username: 'ab' }] });
    expect(res).toEqual({ status: 409, error: false, message: 'User already exists', data: { _id: 'u1', email: 'a@b.com' } });
  });

  it('creates and returns 201 on successful registration', async () => {
    // Mock successful user registration
    missingInputs.mockReturnValue(null);
    userModel.findOne.mockResolvedValue(null);
    bcrypt.genSaltSync.mockReturnValue('salt');
    bcrypt.hashSync.mockReturnValue('hashedPwd');
    userModel.create.mockResolvedValue({ _id: 'newuser', username: 'ab' });

    const req = {
      body: { firstName: 'A', lastName: 'B', phoneNumber: '123', userRole: 1, username: 'ab', email: 'a@b.com', password: 'pwd' },
      file: { path: '/some/path/profile.jpg' }
    };
    const res = await authService.registerUserService(req);

    // Validate that the file path was correctly processed and bcrypt functions were called
    expect(path.basename).toHaveBeenCalledWith('/some/path/profile.jpg');
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith('pwd', 'salt');
    expect(userModel.create).toHaveBeenCalledWith({
      firstName: 'A', lastName: 'B', phoneNumber: '123', userRole: 1,
      username: 'ab', email: 'a@b.com', password: 'hashedPwd', userImg: 'profile.jpg'
    });
    expect(res).toEqual({ status: 201, error: false, message: 'User created successfully', data: { _id: 'newuser', username: 'ab' } });
  });

  it('handles internal errors gracefully', async () => {
    // Mock a database failure scenario
    missingInputs.mockReturnValue(null);
    userModel.findOne.mockImplementation(() => { throw new Error('DB fail'); });

    const req = { body: { firstName: 'A', lastName: 'B', phoneNumber: '123', userRole: 1, username: 'ab', email: 'a@b.com', password: 'pwd' } };
    const res = await authService.registerUserService(req);

    // Check for error handling
    expect(res).toEqual({ status: 400, error: true, data: null, message: 'Register User Service Error' });
  });
});

describe('authServices.loginUserService', () => {
  afterEach(() => jest.clearAllMocks());  // Reset all mocks after each test

  it('returns 404 when user is not found', async () => {
    // Mock user not found scenario
    userModel.findOne.mockResolvedValue(null);

    const res = await authService.loginUserService({ email: 'x@y.com', password: 'pwd' });
    expect(res).toEqual({ status: 404, error: true, message: 'User not found', data: null });
  });

  it('returns 400 when password does not match', async () => {
    // Mock invalid password scenario
    userModel.findOne.mockResolvedValue({ _id: 'u2', password: 'hashed', isActive: true });
    bcrypt.compareSync.mockReturnValue(false);

    const res = await authService.loginUserService({ email: 'x@y.com', password: 'pwd' });
    expect(bcrypt.compareSync).toHaveBeenCalledWith('pwd', 'hashed');
    expect(res).toEqual({ status: 400, error: true, message: 'Password does not match', data: null });
  });

  it('returns 200 with token and user data on successful login', async () => {
    // Mock successful login and token generation
    const userDoc = { _id: 'u1', password: 'hashed', _doc: { _id: 'u1', email: 'x@y.com', username: 'user1' } };
    userModel.findOne.mockResolvedValue(userDoc);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('jwt-token');

    const res = await authService.loginUserService({ email: 'x@y.com', password: 'pwd' });
    expect(jwt.sign).toHaveBeenCalledWith({ id: 'u1' }, 'jwtkey');
    expect(res.status).toBe(200);
    expect(res.error).toBe(false);
    expect(res.data).toHaveProperty('token', 'jwt-token');
    expect(res.data.user).toMatchObject({ _id: 'u1', email: 'x@y.com', username: 'user1' });
  });

  it('handles errors in loginUserService gracefully', async () => {
    // Mock a database failure scenario
    userModel.findOne.mockImplementation(() => { throw new Error('DB fail'); });

    const res = await authService.loginUserService({ email: 'x@y.com', password: 'pwd' });
    expect(res).toEqual({ status: 400, error: true, data: null, message: 'Login User Service Error' });
  });
});

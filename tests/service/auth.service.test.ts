import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../../config/redis.config';
import { createUser,findUserByEmail,getUserIdByConfirmEmailId } from '../../src/repository/auth.repository';
// import { registerUser, loginUser, forgotPassword, confirmEmailLinkService, RegistrationBody, LoginBody } from '../services/auth.service';
import { confirmEmailLinkService, forgotPassword, loginUser, registerUser } from '../../src/services/auth.service';
import { RegistrationBody, LoginBody } from '../../src/@types/type';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('uuid', () => ({ v4: jest.fn() }));
jest.mock('../../config/redis.config');
jest.mock('../../src/repository/auth.repository.ts');

describe('Auth Service Tests', () => {
  describe('registerUser', () => {
    it('should register a new user and return success', async () => {
      const mockData: RegistrationBody = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (createUser as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

      const result = await registerUser(mockData);

      expect(result).toEqual({
        success: true,
        message: 'User registration successfully!',
        user: mockUser,
        token: 'jwtToken',
      });
    });
  });

  describe('loginUser', () => {
    it('should log in a user with valid credentials', async () => {
      const mockData: LoginBody = { email: 'test@example.com', password: 'password' };
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashedPassword' };

      (findUserByEmail as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

      const result = await loginUser(mockData);

      expect(result).toEqual({
        success: true,
        message: 'User login successfully!',
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'jwtToken',
      });
    });

    it('should fail if user does not exist', async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await loginUser({ email: 'nonexistent@example.com', password: 'password' });

      expect(result).toEqual({
        success: false,
        message: 'User does not exist or invalid email!',
      });
    });

    it('should fail if password is invalid', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashedPassword' };

      (findUserByEmail as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      const result = await loginUser({ email: 'test@example.com', password: 'wrongpassword' });

      expect(result).toEqual({
        success: false,
        message: 'Invalid password!',
      });
    });
  });

  describe('forgotPassword', () => {
    it('should generate a password reset link if user exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };

      (findUserByEmail as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (uuidv4 as jest.Mock).mockReturnValue('mocked-uuid');
      (redis.set as jest.Mock).mockResolvedValue('OK');

      const result = await forgotPassword('test@example.com');

      expect(result).toEqual({
        success: true,
        url: `${process.env.BACKEND_HOST}/api/auth/confirm/mocked-uuid`,
      });
      expect(redis.set).toHaveBeenCalledWith(`confirmEmail:mocked-uuid`, mockUser.id, 'EX', 60 * 5);
    });

    it('should fail if user does not exist', async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await forgotPassword('nonexistent@example.com');

      expect(result).toEqual({
        success: false,
        message: 'User does not exist or invalid email!',
      });
    });
  });

  describe('confirmEmailLinkService', () => {
    it('should confirm email if link is valid', async () => {
      (getUserIdByConfirmEmailId as jest.Mock).mockResolvedValue('1');

      const result = await confirmEmailLinkService('mocked-uuid');

      expect(result).toEqual({
        success: true,
        message: 'Link verified successfully!',
        userId: '1',
      });
    });

    it('should fail if link is invalid', async () => {
      (getUserIdByConfirmEmailId as jest.Mock).mockResolvedValue(null);

      const result = await confirmEmailLinkService('invalid-uuid');

      expect(result).toEqual({
        success: false,
        message: 'Invalid link!',
      });
    });
  });
});

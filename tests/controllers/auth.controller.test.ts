import { registration } from '../../src/controllers/auth.controller';
import { registerUser } from '../../src/services/auth.service';
import { Request, Response } from 'express';

jest.mock('../../src/services/auth.service');

describe('Auth Controller - registration', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 201 and the registration response on successful registration', async () => {
    const mockResponse = {
      success: true,
      message: 'User registration successfully!',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      },
      token: 'jwtToken',
    };

    (registerUser as jest.Mock).mockResolvedValue(mockResponse);

    await registration(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(registerUser).toHaveBeenCalledWith(req.body);
  });

  it('should return 500 and an error message if registration fails', async () => {
    const mockError = new Error('Registration failed');
    (registerUser as jest.Mock).mockRejectedValue(mockError);

    await registration(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
    expect(registerUser).toHaveBeenCalledWith(req.body);
  });
});


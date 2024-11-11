import { Request, Response } from "express";
import { confirmEmailLinkService, forgotPassword, loginUser, registerUser} from '../services/auth.service';
import { forgotPasswordSchema, loginSchema } from '../validation-schema/auth.schema';
import { RegistrationBody, RegistrationResponse, LoginBody, LoginResponse, ConfirmEmailParams, ConfirmEmailResponse } from "../@types/type";

/**
 * ROUTE: /api/auth/registration
 * METHOD: POST
 * DESC: New user registration
 */
export const registration = async (req: Request<{}, {}, RegistrationBody>, res: Response<RegistrationResponse>): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};

/**
 * ROUTE: /api/auth/login
 * METHOD: POST
 * DESC: User login with email and password
 */
export const userLogin = async (req: Request<{}, {}, LoginBody>, res: Response<LoginResponse>): Promise<void> => {
  // リクエストバリデーション
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // サービス層の関数を呼び出し
  try {
    const result = await loginUser(req.body);
    if (!result.success) {
      res.status(result.message === 'Invalid password!' ? 401 : 404).json(result);
    }

    res.status(200).json({
      ...result,
      message: result.message || '',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};

/**
 * ROUTE: /api/auth/forgot-password
 * METHOD: POST
 * DESC: User forgot password request
 */


interface ForgotPasswordBody {
  email: string;
}
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const userForgotPassword = async (req: Request<{}, {}, ForgotPasswordBody>, res: Response<ForgotPasswordResponse>): Promise<void> => {
  // リクエストのバリデーション
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  const { email } = req.body;

  try {
    const result = await forgotPassword(email);
    if (!result.success) {
      res.status(404).json({
        ...result,
        message: result.message || 'An error occurred',
      });
    }
    res.status(200).json({
      ...result,
      message: result.message || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};


/**
 * ROUTE: /api/auth/confirm/:id
 * METHOD: GET
 * DESC: Confirm user email verification link
 */
export const confirmEmailLink = async (req: Request<ConfirmEmailParams>, res: Response<ConfirmEmailResponse>): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await confirmEmailLinkService(id);
    if (!result.success) {
      res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};

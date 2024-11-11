import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../../config/redis.config'
import { createUser, findUserByEmail, getUserIdByConfirmEmailId } from '../repository/auth.repository'
import { LoginBody, LoginResponse, RegistrationBody, RegistrationResponse } from '../@types/type';

// Register a new user with secure password.


  export const registerUser = async (data: RegistrationBody): Promise<RegistrationResponse> => {
    const { name, email, password } = data;
  
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // ユーザーのデータベースへの挿入
    const result = await createUser(name, email, hashedPassword);
    const user = result.rows[0];
  
    // JWTトークンの作成
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  
    // パスワードを除外してユーザー情報を返却
    delete user.password;
    return {
      success: true,
      message: 'User registration successfully!',
      user: user,
      token: token,
    };
  };


// Login a user with email and password.
export const loginUser = async (data: LoginBody): Promise<LoginResponse> => {
  const { email, password } = data;

  const result = await findUserByEmail(email);
  const user = result.rows[0];

  // ユーザーが存在しない場合
  if (!user) {
    return {
      success: false,
      message: 'User does not exist or invalid email!',
    };
  }

  // パスワードが無効な場合
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Invalid password!',
    };
  }

  // JWTトークンの生成
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

  // パスワードを削除してユーザー情報を返す
  delete user.password;
  return {
    success: true,
    message: 'User login successfully!',
    token: token,
    user: user,
  };
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; url?: string; message?: string }> => {
  const result = await findUserByEmail(email);
  const user = result.rows[0];

  if (!user) {
    return {
      success: false,
      message: 'User does not exist or invalid email!',
    };
  }

  const id = uuidv4();
  await redis.set(`confirmEmail:${id}`, user.id, 'EX', 60 * 5);

  return {
    success: true,
    url: `${process.env.BACKEND_HOST}/api/auth/confirm/${id}`,
  };
};

// Confirm user email verification link from redis.
export const confirmEmailLinkService = async (id: string): Promise<{ success: boolean; message: string; userId?: string }> => {
  if (!id) {
    return {
      success: false,
      message: 'Invalid link!',
    };
  }

  const userId = await getUserIdByConfirmEmailId(id);
  if (!userId) {
    return {
      success: false,
      message: 'Invalid link!',
    };
  }

  return {
    success: true,
    message: 'Link verified successfully!',
    userId: userId,
  };
};


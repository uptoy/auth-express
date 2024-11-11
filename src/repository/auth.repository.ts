import { connection } from '../../config/db.config'; // 接続情報をインポートしてください
import { QueryResult } from 'pg';
import { redis } from '../../config/redis.config';

export const createUser = async (name: string, email: string, hashedPassword: string): Promise<QueryResult> => {
  const query = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';
  const values = [name, email, hashedPassword];
  return await connection.query(query, values);
};

export const findUserByEmail = async (email: string): Promise<QueryResult> => {
  const query = 'SELECT * FROM Users WHERE email=$1;';
  return await connection.query(query, [email]);
};

export const getUserIdByConfirmEmailId = async (id: string): Promise<string | null> => {
  return await redis.get(`confirmEmail:${id}`);
};

import { createUser, findUserByEmail } from '../../src/repository/auth.repository';
import { connection } from '../../config/db.config';
import { QueryResult } from 'pg';
import { getUserIdByConfirmEmailId } from '../../src/repository/auth.repository';
import { redis } from '../../config/redis.config';

jest.mock('../../config/redis.config');

describe('RedisRepository - getUserIdByConfirmEmailId', () => {
  it('should return a user ID if the ID exists in Redis', async () => {
    // Redisのモック値
    const mockUserId = '12345';
    (redis.get as jest.Mock).mockResolvedValue(mockUserId);

    // 関数の実行
    const result = await getUserIdByConfirmEmailId('mocked-confirm-id');

    // 期待する結果の検証
    expect(result).toBe(mockUserId);
    expect(redis.get).toHaveBeenCalledWith('confirmEmail:mocked-confirm-id');
  });

  it('should return null if the ID does not exist in Redis', async () => {
    // Redisがnullを返すようにモック設定
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await getUserIdByConfirmEmailId('nonexistent-confirm-id');

    expect(result).toBeNull();
    expect(redis.get).toHaveBeenCalledWith('confirmEmail:nonexistent-confirm-id');
  });

  it('should throw an error if the Redis query fails', async () => {
    // Redisがエラーをスローするようにモック設定
    const mockError = new Error('Redis query failed');
    (redis.get as jest.Mock).mockRejectedValue(mockError);

    await expect(getUserIdByConfirmEmailId('mocked-confirm-id')).rejects.toThrow('Redis query failed');
  });
});


// Jestのモック化
jest.mock('../../config/db.config');

describe('UserRepository - createUser', () => {
  it('should insert a user and return the user details', async () => {
    // モックデータを設定
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    // モックの戻り値を設定
    (connection.query as jest.Mock).mockResolvedValue({
      rows: [mockUser],
      rowCount: 1,
    } as QueryResult);

    // テスト対象関数の実行
    const result = await createUser(mockUser.name, mockUser.email, mockUser.password);

    // 期待する結果の検証
    expect(result.rowCount).toBe(1);
    expect(result.rows[0]).toEqual(mockUser);
    expect(connection.query).toHaveBeenCalledWith(
      'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
      [mockUser.name, mockUser.email, mockUser.password]
    );
  });

  it('should throw an error if the query fails', async () => {
    // エラーモック
    const mockError = new Error('Database query failed');
    (connection.query as jest.Mock).mockRejectedValue(mockError);

    await expect(createUser('Test User', 'test@example.com', 'hashedpassword'))
      .rejects
      .toThrow('Database query failed');
  });
});

describe('UserRepository - findUserByEmail', () => {
  it('should return a user when the email exists', async () => {
    // モックデータ
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    // `connection.query`の戻り値を設定
    (connection.query as jest.Mock).mockResolvedValue({
      rows: [mockUser],
      rowCount: 1,
    } as QueryResult);

    // 関数を呼び出して結果を確認
    const result = await findUserByEmail('test@example.com');
    expect(result.rowCount).toBe(1);
    expect(result.rows[0]).toEqual(mockUser);
    expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE email=$1;', ['test@example.com']);
  });

  it('should return an empty result when the email does not exist', async () => {
    // 空の結果を返すモック設定
    (connection.query as jest.Mock).mockResolvedValue({
      rows: [],
      rowCount: 0,
    } as unknown as QueryResult);

    // 関数を呼び出して結果を確認
    const result = await findUserByEmail('nonexistent@example.com');
    expect(result.rowCount).toBe(0);
    expect(result.rows).toEqual([]);
    expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE email=$1;', ['nonexistent@example.com']);
  });

  it('should throw an error if the query fails', async () => {
    // エラーモック
    const mockError = new Error('Database query failed');
    (connection.query as jest.Mock).mockRejectedValue(mockError);

    await expect(findUserByEmail('test@example.com')).rejects.toThrow('Database query failed');
  });
});

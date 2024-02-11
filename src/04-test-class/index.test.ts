import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  let bankInstance: ReturnType<typeof getBankAccount>;

  beforeEach(() => {
    bankInstance = getBankAccount(1000);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(bankInstance).toBeDefined();
    expect(bankInstance.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => bankInstance.withdraw(9999)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => bankInstance.transfer(9999, getBankAccount(1000))).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankInstance.transfer(9999, bankInstance)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    bankInstance.deposit(400);
    expect(bankInstance.getBalance()).toBe(1400);
  });

  test('should withdraw money', () => {
    bankInstance.withdraw(500);
    expect(bankInstance.getBalance()).toBe(500);
  });

  test('should transfer money', () => {
    const otherBankAcc = getBankAccount(200);
    bankInstance.transfer(500, otherBankAcc);
    expect(bankInstance.getBalance()).toBe(500);
    expect(otherBankAcc.getBalance()).toBe(700);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    const result = await bankInstance.fetchBalance();
    expect(result).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    await bankInstance.synchronizeBalance();
    expect(bankInstance.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValueOnce(null);
    expect(bankInstance.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});

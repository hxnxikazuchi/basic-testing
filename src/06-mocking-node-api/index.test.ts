import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('path', () => ({
  join: jest.fn(),
}));
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const randomCb = jest.fn();
    const timeout = 2000;
    const spyTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(randomCb, timeout);

    expect(spyTimeout).toHaveBeenCalledWith(randomCb, timeout);

    spyTimeout.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const randomCb = jest.fn();
    const timeout = 2000;

    doStuffByTimeout(randomCb, timeout);

    expect(randomCb).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(randomCb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const randomCb = jest.fn();
    const timeout = 2000;
    const spyTimeout = jest.spyOn(global, 'setInterval');

    doStuffByInterval(randomCb, timeout);

    expect(spyTimeout).toHaveBeenCalledWith(randomCb, timeout);

    spyTimeout.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const randomCb = jest.fn();
    const timeout = 2000;

    doStuffByInterval(randomCb, timeout);

    jest.advanceTimersByTime(timeout);
    expect(randomCb).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(timeout + 2000);
    expect(randomCb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = '/random/path/to/file';
    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = '/random/path/to/file';
    const result = await readFileAsynchronously(pathToFile);

    (existsSync as jest.Mock).mockReturnValue(false);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = '/random/path/to/file';
    const fakeFileContent = 'some fake file content';

    (readFile as jest.Mock).mockResolvedValueOnce(Buffer.from(fakeFileContent));
    (existsSync as jest.Mock).mockReturnValue(true);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toEqual(fakeFileContent);
  });
});

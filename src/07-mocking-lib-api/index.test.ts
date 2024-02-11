import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet.mockResolvedValue({ data: 'mocked data' }),
    });
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/random-ep');
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/random-ep');

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(mockGet).toHaveBeenCalledWith('/random-ep');
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi('/random-ep');

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(data).toBe('mocked data');
  });
});

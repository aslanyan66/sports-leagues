import { ApiError } from '@/api/api-error';
import { env } from '@/config/env';
import { API_TIMEOUT_MS, CONTENT_TYPE_JSON } from '@/constants/api';
import type { QueryParams } from '@/types/api';

interface IGetOptions {
  params?: QueryParams;
  signal?: AbortSignal | undefined;
}

export const buildUrl = (path: string, params?: QueryParams): string => {
  // Concatenate instead of `new URL(path, base)`, which would drop the base path (/api/v1/json/123).
  const url = new URL(`${env.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
};

const parseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';

  return contentType.includes(CONTENT_TYPE_JSON) ? response.json() : response.text();
};

// The app only reads data, so the client only exposes GET.
const get = async <T>(path: string, { params, signal }: IGetOptions = {}): Promise<T> => {
  const timeoutSignal = AbortSignal.timeout(API_TIMEOUT_MS);

  const response = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: CONTENT_TYPE_JSON },
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
  });

  const data = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, data);
  }

  // The caller declares the expected shape; responses are not schema-validated (see docs/DECISIONS.md).
  return data as T;
};

export const apiClient = { get };

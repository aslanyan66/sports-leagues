import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { ApiError } from '@/api/api-error';
import { apiClient, buildUrl } from '@/api/client';
import { env } from '@/config/env';
import { server } from '@/testing/mocks/server';

describe('buildUrl', () => {
  it('keeps the base path and appends query params', () => {
    expect(buildUrl('/search_all_seasons.php', { badge: 1, id: '4328' })).toBe(
      `${env.apiUrl}/search_all_seasons.php?badge=1&id=4328`,
    );
  });

  it('skips undefined params', () => {
    expect(buildUrl('/all_leagues.php', { id: undefined })).toBe(`${env.apiUrl}/all_leagues.php`);
  });
});

describe('apiClient.get', () => {
  it('returns parsed JSON', async () => {
    server.use(http.get(buildUrl('/ok.php'), () => HttpResponse.json({ ok: true })));

    await expect(apiClient.get('/ok.php')).resolves.toEqual({ ok: true });
  });

  it('throws an ApiError with the status on a failed response', async () => {
    server.use(
      http.get(buildUrl('/fail.php'), () =>
        HttpResponse.json({ message: 'nope' }, { status: 500 }),
      ),
    );

    const error: unknown = await apiClient.get('/fail.php').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, data: { message: 'nope' } });
  });
});

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorPage } from '@/pages/ErrorPage';
import { renderRoute } from '@/testing/test-utils';

const Broken = () => {
  throw new Error('Kaboom');
};

describe('routing', () => {
  it('renders the leagues page at /', async () => {
    renderRoute('/');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sports leagues' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  it('renders the 404 page for unknown URLs, with a way back', async () => {
    const { user, router } = renderRoute('/does-not-exist');

    expect(
      screen.getByRole('heading', { level: 1, name: "This page doesn't exist" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Back to leagues' }));

    expect(router.state.location.pathname).toBe('/');
    expect(await screen.findByRole('heading', { name: 'Sports leagues' })).toBeInTheDocument();
  });

  it('catches unexpected render errors and shows the error page', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    renderRoute('/', {
      routes: [{ path: '/', element: <Broken />, errorElement: <ErrorPage /> }],
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    expect(screen.getByText('Kaboom')).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LeagueResults } from '@/features/leagues/components/results/LeagueResults';
import { LazyLeagueSeasonsDialog } from '@/features/leagues/components/seasons-dialog/LazyLeagueSeasonsDialog';
import { loadLeagueSeasonsDialog } from '@/features/leagues/components/seasons-dialog/seasons-dialog-loader';
import { renderWithProviders } from '@/testing/test-utils';

vi.mock('@/features/leagues/components/seasons-dialog/seasons-dialog-loader', () => ({
  loadLeagueSeasonsDialog: vi.fn(),
}));

const loadRealDialog = () =>
  import('@/features/leagues/components/seasons-dialog/LeagueSeasonsDialog');

describe('LazyLeagueSeasonsDialog', () => {
  it('shows a retry instead of breaking the page when the dialog code fails to load', async () => {
    // React logs errors caught by error boundaries; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(loadLeagueSeasonsDialog).mockRejectedValue(new Error('Failed to fetch chunk'));
    const { user } = renderWithProviders(
      <>
        <LeagueResults />
        <LazyLeagueSeasonsDialog />
      </>,
    );

    await user.click(await screen.findByRole('button', { name: /English Premier League/ }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Season badges couldn't open");
    // The rest of the page still works.
    expect(screen.getByRole('button', { name: /Spanish La Liga/ })).toBeInTheDocument();

    // The connection is back: retrying loads the code again and opens the league.
    vi.mocked(loadLeagueSeasonsDialog).mockImplementation(loadRealDialog);
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'English Premier League' })).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

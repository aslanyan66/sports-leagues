import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { LeaguesPage } from '@/pages/LeaguesPage';
import { ALL_LEAGUES_URL, SEASONS_URL } from '@/testing/mocks/handlers';
import { server } from '@/testing/mocks/server';
import { renderWithProviders } from '@/testing/test-utils';

const leagueButton = (name: RegExp) => screen.findByRole('button', { name });

// Cards across every sport section, in page order.
const getCardNames = (container: HTMLElement = document.body) =>
  within(container)
    .getAllByRole('listitem')
    .map((item) => item.textContent);

const sportSection = (sport: string) =>
  screen.getByRole('region', { name: new RegExp(`^${sport}`) });

describe('LeaguesPage: list and filters', () => {
  it('shows a loading state, then the leagues with sport and alternate name', async () => {
    renderWithProviders(<LeaguesPage />);

    expect(screen.getByText('Loading leagues')).toBeInTheDocument();

    const epl = await leagueButton(/English Premier League/);
    expect(epl).toHaveTextContent('Soccer');
    expect(epl).toHaveTextContent('Premier League, EPL');
    expect(screen.getByRole('button', { name: /Spanish La Liga/ })).toHaveTextContent(
      'No alternate name',
    );
    expect(screen.getByText('4 leagues')).toBeInTheDocument();
  });

  it('shows an error with a working retry', async () => {
    server.use(
      http.get(ALL_LEAGUES_URL, () => HttpResponse.json(null, { status: 500 }), { once: true }),
    );
    const { user } = renderWithProviders(<LeaguesPage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Leagues couldn't load");

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await leagueButton(/English Premier League/)).toBeVisible();
  });

  it('says so when the API returns no leagues, without a pointless "Clear filters"', async () => {
    server.use(
      http.get(ALL_LEAGUES_URL, () => HttpResponse.json({ leagues: null }), { once: true }),
    );
    renderWithProviders(<LeaguesPage />);

    expect(await screen.findByText('No leagues found')).toBeInTheDocument();
    expect(screen.getByText('There are no leagues yet.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });

  it('filters by name (debounced)', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await leagueButton(/English Premier League/);

    await user.type(screen.getByRole('searchbox', { name: 'League name' }), 'formula');
    // Debounced: right after typing, the list hasn't changed yet.
    expect(getCardNames()).toHaveLength(4);

    await waitFor(() => {
      expect(getCardNames()).toHaveLength(1);
    });
    // The total count (a <p>), not the "1 league" in the sport heading.
    expect(screen.getByText('1 league', { selector: 'p' })).toBeInTheDocument();
  });

  it('describes the applied search in the empty state, and clearing applies immediately', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await leagueButton(/English Premier League/);

    await user.type(screen.getByRole('searchbox', { name: 'League name' }), 'cricket');

    expect(await screen.findByText('No leagues found')).toBeInTheDocument();
    expect(screen.getByText(/There are no leagues matching “cricket”/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    // No debounce wait: the full list is back right away, and focus returns to the search field
    // instead of being lost with the button.
    expect(screen.getByText('4 leagues')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'League name' })).toHaveValue('');
    expect(screen.getByRole('searchbox', { name: 'League name' })).toHaveFocus();
  });

  it('offers only sports from the API, with counts, and filters by sport', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await leagueButton(/English Premier League/);

    await user.click(screen.getByRole('combobox', { name: 'Sport' }));
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'All sports',
      'Motorsport (1)',
      'Soccer (3)',
    ]);

    await user.click(screen.getByRole('option', { name: 'Motorsport (1)' }));
    expect(getCardNames()).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Formula 1/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /^Soccer/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: 'Sport' }));
    await user.click(screen.getByRole('option', { name: 'All sports' }));

    expect(screen.getByText('4 leagues')).toBeInTheDocument();
  });

  it('groups the leagues by sport into labelled sections, sports A–Z', async () => {
    renderWithProviders(<LeaguesPage />);
    await leagueButton(/English Premier League/);

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['Motorsport1 league', 'Soccer3 leagues']);
    expect(within(sportSection('Motorsport')).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Motorsport1 league',
    );
    expect(getCardNames(sportSection('Soccer'))).toHaveLength(3);
    expect(getCardNames()[0]).toContain('Formula 1');
  });
});

describe('LeaguesPage: season badges dialog', () => {
  it('opens a dialog with a carousel of every season badge', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/English Premier League/));

    const dialog = await screen.findByRole('dialog', { name: 'English Premier League' });
    expect(dialog).toHaveAccessibleDescription(/Also known as Premier League, EPL/);

    const carousel = await within(dialog).findByRole('region', {
      name: 'English Premier League season badges',
    });
    expect(within(carousel).getByRole('img', { name: /season 1992-1993/ })).toHaveAttribute(
      'src',
      'https://example.com/epl-1992.png/small',
    );
    expect(within(dialog).getByRole('tabpanel', { name: 'Season 1992–93' })).toBeVisible();
    // The dialog itself gets focus, so screen readers start from its title and description, and
    // nothing is announced on top of that.
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText('1 / 3')).toBeInTheDocument();
    expect(within(dialog).queryByText(/, \d of 3$/)).not.toBeInTheDocument();
  });

  it('navigates seasons with previous/next buttons', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/English Premier League/));
    const dialog = await screen.findByRole('dialog');
    await within(dialog).findByRole('region');

    const previous = within(dialog).getByRole('button', { name: 'Previous season' });
    const next = within(dialog).getByRole('button', { name: 'Next season' });
    // Soft-disabled: stays focusable so focus isn't lost at either end.
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).toBeEnabled();

    await user.click(next);
    expect(within(dialog).getByText('Season 1993–94, 2 of 3')).toBeInTheDocument();
    expect(within(dialog).getByRole('tab', { name: 'Season 1993–94' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(next);
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).toHaveFocus();

    await user.click(next);
    expect(within(dialog).getByRole('tab', { name: 'Season 1994–95' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(dialog).getByText('No badge for this season')).toBeInTheDocument();
  });

  it('exposes the season timeline as keyboard-navigable tabs controlling the slides', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/English Premier League/));
    const dialog = await screen.findByRole('dialog');
    await within(dialog).findByRole('region');

    const tablist = within(dialog).getByRole('tablist', { name: 'Seasons' });
    const tabs = within(tablist).getAllByRole('tab');
    // Visible text is the short season; "Season " is added for screen readers only.
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Season 1992–93',
      'Season 1993–94',
      'Season 1994–95',
    ]);
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(within(dialog).getByRole('tabpanel', { name: 'Season 1992–93' })).toBeInTheDocument();

    tabs[0]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(tabs[2]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Tab changes aren't repeated in the live region: the focused tab is read out already.
    expect(within(dialog).queryByText(/, \d of 3$/)).not.toBeInTheDocument();
  });

  it('falls back to the original badge, then to a placeholder, when images fail to load', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/English Premier League/));
    const dialog = await screen.findByRole('dialog');
    const badge = await within(dialog).findByRole('img', { name: /season 1992-1993/ });

    expect(badge).toHaveAttribute(
      'srcset',
      'https://example.com/epl-1992.png/small 1x, https://example.com/epl-1992.png 2x',
    );

    fireEvent.error(badge);
    const original = within(dialog).getByRole('img', { name: /season 1992-1993/ });
    expect(original).toHaveAttribute('src', 'https://example.com/epl-1992.png');
    expect(original).not.toHaveAttribute('srcset');

    fireEvent.error(original);
    expect(within(dialog).queryByRole('img', { name: /season 1992-1993/ })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('tabpanel', { name: 'Season 1992–93' })).toHaveTextContent(
      'No badge for this season',
    );
  });

  it('shows placeholders when every season has a null badge', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/English League Championship/));
    const dialog = await screen.findByRole('dialog');

    expect(await within(dialog).findAllByText('No badge for this season')).toHaveLength(2);
    expect(within(dialog).queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a message when a league has no seasons', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    await user.click(await leagueButton(/Spanish La Liga/));

    expect(await screen.findByText('No seasons on record')).toBeInTheDocument();
  });

  it('closes with Escape and returns focus to the card that opened it', async () => {
    const { user } = renderWithProviders(<LeaguesPage />);
    const epl = await leagueButton(/English Premier League/);

    await user.click(epl);
    await within(await screen.findByRole('dialog')).findByRole('region');

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(epl).toHaveFocus();
  });

  it('fetches each endpoint exactly once: no StrictMode cancel-and-retry, and reopening uses the cache', async () => {
    const realFetch = globalThis.fetch;
    const requests: { path: string; aborted: boolean }[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const path = new URL(input instanceof Request ? input.url : String(input)).pathname;
      const entry = { path, aborted: false };
      requests.push(entry);
      init?.signal?.addEventListener('abort', () => {
        entry.aborted = true;
      });
      return realFetch(input, init);
    });

    const { user } = renderWithProviders(<LeaguesPage />);
    const epl = await leagueButton(/English Premier League/);

    await user.click(epl);
    await within(await screen.findByRole('dialog')).findByRole('region');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(epl);
    expect(await within(await screen.findByRole('dialog')).findByRole('region')).toBeVisible();

    expect(requests).toEqual([
      { path: new URL(ALL_LEAGUES_URL).pathname, aborted: false },
      { path: new URL(SEASONS_URL).pathname, aborted: false },
    ]);

    vi.restoreAllMocks();
  });
});

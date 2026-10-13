import { describe, expect, it } from 'vitest';

import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

const getState = () => useLeaguesUiStore.getState();

describe('leagues UI store', () => {
  it('starts with empty filters and the dialog closed', () => {
    expect(getState()).toMatchObject({
      search: '',
      sport: null,
      selectedLeagueId: null,
      isSeasonsDialogOpen: false,
    });
  });

  it('updates search and sport', () => {
    getState().setSearch('premier');
    getState().setSport('Soccer');

    expect(getState()).toMatchObject({ search: 'premier', sport: 'Soccer' });
  });

  it('clears filters without touching the dialog', () => {
    getState().setSearch('nba');
    getState().setSport('Basketball');
    getState().openSeasonsDialog('1');
    getState().clearFilters();

    expect(getState()).toMatchObject({
      search: '',
      sport: null,
      selectedLeagueId: '1',
      isSeasonsDialogOpen: true,
    });
  });

  it('opens the dialog for a league and keeps the league while closing', () => {
    getState().openSeasonsDialog('4328');
    expect(getState()).toMatchObject({ selectedLeagueId: '4328', isSeasonsDialogOpen: true });

    getState().closeSeasonsDialog();
    expect(getState()).toMatchObject({ selectedLeagueId: '4328', isSeasonsDialogOpen: false });

    getState().openSeasonsDialog('4335');
    expect(getState()).toMatchObject({ selectedLeagueId: '4335', isSeasonsDialogOpen: true });
  });
});

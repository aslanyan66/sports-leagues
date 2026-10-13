import { create } from 'zustand';

import type { ILeagueFilterValues } from '@/features/leagues/types/league';

/** UI state of the leagues screen. Server data lives in TanStack Query, not here. */
interface ILeaguesUiState extends ILeagueFilterValues {
  /** League shown in the seasons dialog. Kept after closing so the exit animation still has content. */
  selectedLeagueId: string | null;
  isSeasonsDialogOpen: boolean;
  setSearch: (search: string) => void;
  setSport: (sport: string | null) => void;
  clearFilters: () => void;
  openSeasonsDialog: (leagueId: string) => void;
  closeSeasonsDialog: () => void;
  reset: () => void;
}

const initialState = {
  search: '',
  sport: null,
  selectedLeagueId: null,
  isSeasonsDialogOpen: false,
} satisfies Partial<ILeaguesUiState>;

export const useLeaguesUiStore = create<ILeaguesUiState>()((set) => ({
  ...initialState,
  setSearch: (search) => {
    set({ search });
  },
  setSport: (sport) => {
    set({ sport });
  },
  clearFilters: () => {
    set({ search: '', sport: null });
  },
  openSeasonsDialog: (leagueId) => {
    set({ selectedLeagueId: leagueId, isSeasonsDialogOpen: true });
  },
  closeSeasonsDialog: () => {
    set({ isSeasonsDialogOpen: false });
  },
  reset: () => {
    set(initialState);
  },
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useThemeStore } from '@/store/theme.store';

describe('ThemeToggle', () => {
  it('switches between light and dark theme and persists the choice', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toContain('"theme":"dark"');

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(useThemeStore.getState().theme).toBe('light');
  });
});

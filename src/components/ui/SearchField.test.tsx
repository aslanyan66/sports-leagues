import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { SearchField } from '@/components/ui/SearchField';

const ControlledSearch = () => {
  const [value, setValue] = useState('');
  return <SearchField label="League name" value={value} onChange={setValue} />;
};

describe('SearchField', () => {
  it('is labelled and shows a clear button only when it has a value', async () => {
    const user = userEvent.setup();
    render(<ControlledSearch />);
    const input = screen.getByRole('searchbox', { name: 'League name' });

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await user.type(input, 'liga');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });
});

import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { downloadTextFile, toFileSlug } from './download';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { logger } from './logger';

describe('toFileSlug', () => {
  it('turns free text into a safe lowercase file stem', () => {
    expect(toFileSlug('Ayesha & Rohan’s Wedding!')).toBe('ayesha-rohan-s-wedding');
  });

  it('falls back when nothing usable is left', () => {
    expect(toFileSlug('✨✨')).toBe('utsav');
    expect(toFileSlug('', 'guests')).toBe('guests');
  });
});

describe('downloadTextFile', () => {
  it('clicks a temporary object-URL link with the file name, then frees the URL', () => {
    const createObjectURL = vi.fn(() => 'blob:utsav/1');
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    downloadTextFile('guests.csv', 'name\nPriya', 'text/csv');

    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe('guests.csv');
    expect(link.href).toBe('blob:utsav/1');
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:utsav/1');
  });
});

describe('useCopyToClipboard', () => {
  const setClipboard = (writeText: (text: string) => Promise<void>) => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  };

  it('copies and confirms with the label', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    setClipboard(writeText);
    const success = vi.spyOn(toast, 'success');
    const { result } = renderHook(() => useCopyToClipboard());

    await act(() => result.current('#C2185B', 'Rose'));

    expect(writeText).toHaveBeenCalledWith('#C2185B');
    expect(success).toHaveBeenCalledWith('Copied Rose');
  });

  it('explains how to copy manually when the clipboard is unavailable', async () => {
    setClipboard(() => Promise.reject(new Error('denied')));
    const error = vi.spyOn(toast, 'error');
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(() => result.current('#C2185B'));

    expect(error).toHaveBeenCalledWith(expect.stringMatching(/copy it manually/i));
    expect(warn).toHaveBeenCalledWith('Clipboard write failed', expect.any(Error));
  });
});

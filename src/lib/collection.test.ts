import { filterByEventId, removeByEventId, removeById, restoreAt, updateById } from './collection';

const items = [
  { id: 'a', eventId: 'e1', name: 'Venue' },
  { id: 'b', eventId: 'e1', name: 'Catering' },
  { id: 'c', eventId: 'e2', name: 'Décor' },
];

describe('collection helpers', () => {
  it('updateById merges the patch into the matching item only, without mutating', () => {
    const result = updateById(items, 'b', { name: 'Caterer' });
    expect(result.map((item) => item.name)).toEqual(['Venue', 'Caterer', 'Décor']);
    expect(items[1]?.name).toBe('Catering');
  });

  it('updateById never lets a patch change the id', () => {
    const result = updateById(items, 'a', { id: 'hijacked' });
    expect(result[0]?.id).toBe('a');
  });

  it('removeById drops the matching item', () => {
    expect(removeById(items, 'a').map((item) => item.id)).toEqual(['b', 'c']);
  });

  it('restoreAt re-inserts a removed item at its original index, once', () => {
    const removed = items[1]!;
    const restored = restoreAt(removeById(items, 'b'), 1, removed);
    expect(restored.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(restoreAt(restored, 1, removed)).toHaveLength(3);
    expect(restoreAt([], 5, removed).map((item) => item.id)).toEqual(['b']);
  });

  it('removeByEventId and filterByEventId partition by event', () => {
    expect(removeByEventId(items, 'e1').map((item) => item.id)).toEqual(['c']);
    expect(filterByEventId(items, 'e1').map((item) => item.id)).toEqual(['a', 'b']);
  });
});

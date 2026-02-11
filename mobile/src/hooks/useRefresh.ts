import { useState, useCallback } from 'react';

export function useRefresh(fetchFn: () => Promise<void>): [boolean, () => void] {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFn().finally(() => setRefreshing(false));
  }, [fetchFn]);

  return [refreshing, onRefresh];
}

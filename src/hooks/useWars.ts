import { useEffect, useState } from 'react';
import type { War } from '@/types';

export function useWars() {
  const [wars, setWars] = useState<War[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/wars.json')
      .then((res) => res.json())
      .then((data: War[]) => {
        setWars(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { wars, loading };
}

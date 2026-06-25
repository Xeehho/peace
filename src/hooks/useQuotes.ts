import { useEffect, useState } from 'react';
import type { Quote } from '@/types';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/quotes.json')
      .then((res) => res.json())
      .then((data: Quote[]) => {
        setQuotes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { quotes, loading };
}

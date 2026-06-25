import { useEffect, useState } from 'react';
import type { Country } from '@/types';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/countries.json')
      .then((res) => res.json())
      .then((data: Country[]) => {
        setCountries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { countries, loading };
}

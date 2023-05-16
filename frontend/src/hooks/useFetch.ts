import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import api from '../services/api';

const useFetch = <Type>(url: string) => {
  const [data, setData] = useState<Type | undefined>(undefined);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsPending(true);
    api
      .get(url)
      .then((data: AxiosResponse) => {
        setData(data.data);
        setIsPending(false);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;

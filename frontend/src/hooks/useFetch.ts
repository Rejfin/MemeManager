import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import api from '../services/api';

const useFetch = (url: string, forceRefresh?: number) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(url)
      .then((data: AxiosResponse) => {
        setIsPending(false);
        setData(data.data);
        setError(null);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, [url, forceRefresh]);

  return { data, isPending, error };
};

export default useFetch;

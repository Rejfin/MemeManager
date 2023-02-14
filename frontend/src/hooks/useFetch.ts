import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import api from '../services/api';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPending(true);
    api
      .get(url)
      .then((data: AxiosResponse) => {
        setData(data.data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;

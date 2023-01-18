import { useState, useEffect } from 'react';
import api from '../services/api';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      api.get(url)
      .then((data: any) => {
        setIsPending(false);
        setData(data.data);
        setError(null);
      })
      .catch(err => {
        setIsPending(false);
        setError(err.message);
      })
  }, [url])

  return { data, isPending, error };
}
 
export default useFetch;
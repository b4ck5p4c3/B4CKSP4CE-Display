import {useEffect, useState} from 'react';
import ScriptsAPI from '../services/scriptsAPI';

export const useFetchScripts = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ScriptsAPI.get()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
};

export default useFetchScripts;
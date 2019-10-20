import {useState, useEffect} from 'react';

export function useHiddenNotBlank({ propName, value, onError=console.error }) {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (!value && !logged) {
      const error = new Error(
        `'${propName}' prop must be provided! If you want to hide it, use the '${propName}Hidden' prop.`,
      );

      onError(error);
      setLogged(true);
    }
  }, [propName, value, logged]);
}

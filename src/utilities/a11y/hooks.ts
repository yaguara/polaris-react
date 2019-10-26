import {useState, useEffect} from 'react';

export interface UseHiddenNotBlankProps {
  propName: string;
  value: any;
  onError(error: Error): void;
}

export function useHiddenNotBlank({
  propName,
  value,
  onError = defaultOnError,
}: UseHiddenNotBlankProps) {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (!value && !logged) {
      const error = new Error(
        `'${propName}' prop must be provided! If you want to hide it, use the '${propName}Hidden' prop.`,
      );

      onError(error);
      setLogged(true);
    }
  }, [propName, value, logged, onError]);
}

function defaultOnError(error: Error) {
  console.error(error); // eslint-disable-line no-console
  throw error;
}

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse it
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      try {
        const valueToStore = value instanceof Function ? value(prev) : value;
        // Bail out if state did not change
        if (prev === valueToStore) {
          return prev;
        }
        
        const stringified = JSON.stringify(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, stringified);
        
        // Dispatch custom event for same-tab synchronization
        window.dispatchEvent(new CustomEvent('strivex-storage', { 
          detail: { key, newValue: stringified } 
        }));
        
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return prev;
      }
    });
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(prev => {
          // Bail out if JSON is identical to prevent infinite re-renders
          if (JSON.stringify(prev) === e.newValue) {
            return prev;
          }
          return JSON.parse(e.newValue as string);
        });
      }
    };

    const handleCustomChange = (e: CustomEvent) => {
      if (e.detail.key === key && e.detail.newValue) {
        setStoredValue(prev => {
          // Bail out if JSON is identical to prevent infinite re-renders
          if (JSON.stringify(prev) === e.detail.newValue) {
            return prev;
          }
          return JSON.parse(e.detail.newValue);
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('strivex-storage', handleCustomChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('strivex-storage', handleCustomChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}

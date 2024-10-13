export const setLocalStorageItem = (key, value) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const getLocalStorageItem = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  } catch (error) {
    console.error("Error while getting item from localStorage:", error);
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

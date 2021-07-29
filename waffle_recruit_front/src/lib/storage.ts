// code from https://backend-intro.vlpt.us/6/04.html

const storage = {
  set: (key: string, object: unknown): void => {
    if (!localStorage) return;
    localStorage[key] = typeof object === 'string' ? object : JSON.stringify(object);
  },
  get: (key: string): unknown => {
    if (!localStorage) return null;

    if (!localStorage[key]) {
      return null;
    }

    try {
      return JSON.parse(localStorage[key]);
    } catch (e) {
      return localStorage[key];
    }
  },
  remove: (key: string): void => {
    if (!localStorage) return;

    if (localStorage[key]) {
      localStorage.removeItem(key);
    }
  },
};

export default storage;

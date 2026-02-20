// src/global.d.ts
interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: object, containerId: string) => void;
      };
    };
  }
  
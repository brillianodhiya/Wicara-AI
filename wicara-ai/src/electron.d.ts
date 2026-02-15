export {};

declare global {
  interface Window {
    electronAPI?: {
      getDesktopSources: () => Promise<Array<{ id: string; name: string; thumbnail: string }>>;
    };
  }
}

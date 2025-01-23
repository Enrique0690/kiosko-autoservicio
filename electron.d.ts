declare global {
  interface Window {
    electronAPI: {
      printOrder: (orderDetails: Record<string, any>) => Promise<string>;
      getConfig: () => Promise<{
        caruselDirUrl: string;
        LineaDirUrl: string;
        ProductDirUrl: string;
        runfoodserviceUrl: string;
        Authorization: string;
        userID: string;
        colors: {
          primary: string;
          secondary: string;
          text: string;
          textsecondary: string;
        };
      }>;
    };
  }
}

export {};
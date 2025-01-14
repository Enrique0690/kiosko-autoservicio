declare global {
  interface Window {
    electron: {
      printOrderDetails: (orderDetails: any) => void;
    };
  }
}

export {};
import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AlertState } from '../types/alert.types';

// 1. Définition de la forme du contexte
interface AlertContextData {
  alertConfig: AlertState;
  showAlert: (message: string, type?: 'error' | 'success' | 'warning' | 'info') => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextData | undefined>(undefined);

// 2. Le Provider
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<AlertState>({ alert: "", alertType: "error" });

  const showAlert = useCallback((message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
    setAlertConfig({ alert: message, alertType: type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig({ alert: "", alertType: "error" });
  }, []);

  return (
    <AlertContext.Provider value={{ alertConfig, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// 3. Hook personnalisé pour l'utiliser partout
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert doit être utilisé dans un AlertProvider");
  return context;
};


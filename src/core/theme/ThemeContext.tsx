import { createContext, useMemo, useState, useContext, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import lightPalette from './LightPalette';
import darkPalette from './DarkPalette';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => {
    if(mode === 'light'){
      return lightPalette;
    }
    else{
      return darkPalette;
    }
  }, [mode]); 


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
import {ThemeContextProvider} from './core/theme/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router-dom';
import {router} from './core/router/Router'

export default function App(){
    return(
        <ThemeContextProvider>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeContextProvider>
    );
}
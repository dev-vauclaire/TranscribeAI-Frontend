import { useState } from 'react';
import ResizableSidebar from '../../shared/components/ResizableSidebar.tsx'
import Box from '@mui/material/Box';
import TextBox from './components/TextBox.tsx';

export default function StreamingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fonction pour basculer l'état de la sidebar (ouverte/fermée)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: "100%"}}>
      {/* Barre d'outil */}
      <ResizableSidebar 
        open={isSidebarOpen}
        onToggle={toggleSidebar}
        side="left"
        title="Boite à outils"
        expandedWidth={200}
        collapsedWidth={50}
      >
        </ResizableSidebar>
      {/* Main */}
      <Box sx={{ 
        width: "100%",
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        p: 3,
        boxSizing: "border-box" }}>
        <Box sx ={{
          flex: 1,
          display : 'flex',
          flexDirection :"column",
          alignItems : 'center',
          gap : 2,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Texte box où sera afficher les segments de texte récupérés */}
          <Box/>
            <TextBox />
          </Box>
      </Box>
    </Box>
  );
}
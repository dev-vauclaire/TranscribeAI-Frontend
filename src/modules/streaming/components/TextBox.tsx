import Paper from '@mui/material/Paper';

export default function TextBox() {
    return (
        <Paper elevation={0}       
          sx={{ 
            width: "100%", 
            flex: 1,
            minHeight: 0,
            p: 2, 
            display: "flex", 
            flexDirection: "column"
          }}>
            Ceci est du texte
          </Paper>
    )
}

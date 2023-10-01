import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { Button } from '@mui/material';

export const metadata = {
  title: 'Next.js App Router + Material UI v5',
  description: 'Next.js App Router + Material UI v5',
};

const DRAWER_WIDTH = 240;

const LINKS = [
  { text: 'About', href: '/about', icon: <PersonIcon /> },
  { text: 'Travel', href: '/travel', icon: <FlightIcon /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppBar position="fixed" sx={{ zIndex: 2000 }}>
            <Toolbar sx={{ backgroundColor: 'background.paper' }}>
              <Typography variant="h6" noWrap component="div" color="black">
                Dom Taylor
              </Typography>

              {LINKS.map((link) => {
                return <Button key={link.href} href={link.href} sx={{ marginX: "10px" }} variant={"contained"}>
                  <>
                    {link.icon}
                    <Typography sx={{ paddingLeft: "3px" }} variant="body1" noWrap component="div">
                      {link.text}
                    </Typography>
                  </>

                </Button>
              })}

            </Toolbar>



          </AppBar>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              mt: ['48px', '56px', '64px'],
              p: 3,
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html >
  );
}

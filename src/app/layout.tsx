import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { Button } from '@mui/material';
import { HEADER_HEIGHT } from '@/constants/layout';

export const metadata = {
  title: 'Next.js App Router + Material UI v5',
  description: 'Next.js App Router + Material UI v5',
};

const LINKS = [
  { text: 'About', href: '/about', icon: <PersonIcon /> },
  { text: 'Travel', href: '/travel', icon: <FlightIcon /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            width: "100vw",
            height: `calc(${HEADER_HEIGHT} - 10)`,
            padding: `10px`,
            alignItems: "center",
            borderBottom: "2px solid",
            borderColor: "background.paper"
          }}>
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
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              mt: ['48px', '56px', '64px'],
              p: 3,
              height: `calc(100vh - ${HEADER_HEIGHT})`
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html >
  );
}

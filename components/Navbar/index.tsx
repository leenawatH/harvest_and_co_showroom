
'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Typography , Box, IconButton, List, ListItemButton, ListItemText  } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';


export default function Navbar() {

    const [state, setState] = useState(false);

    
    const toggleDrawer =
        (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setState(open);
        };

    const list = (
            <Box role="presentation">
              <List sx={{bgcolor: 'background.paper' }}>
                <ListItemButton href={`/aboutus`}>
                    <ListItemText primary="About us" />
                </ListItemButton>
                <ListItemButton href={`/contact`}>
                    <ListItemText primary="Contact" />
                </ListItemButton>
              </List>
            </Box>
    );
    

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        px: 1.5,
        py: 2,
      }}
    >
        
        <Box className="mt-[5px]">
            <IconButton>
            <MenuIcon onClick={toggleDrawer(true)} />
                <SwipeableDrawer
                anchor='top'
                open={state}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                >
                {list}
                </SwipeableDrawer>
            </IconButton>
        </Box>
        <Box className="flex flex-grow flex-col items-center justify-center">
            <Link href="/" className="flex items-center">
                <Image
                    src="/logo/Logo H_C-01.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    priority
                    />
            </Link>
        </Box>
      </Box>  

    // <nav className="py-5 flex justify-center items-center">
    //   <Link href="/" className="flex items-center">
    //     <Image
    //       src="/logo/Logo H_C-01.png"
    //       alt="Logo"
    //       width={200}
    //       height={200}
    //       priority
    //     />
    //   </Link>
    // </nav>
  );
}

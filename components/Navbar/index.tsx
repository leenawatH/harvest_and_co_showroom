'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import {
  Typography,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function Navbar() {
  const [state, setState] = useState(false);
  const [isTop, setIsTop] = useState(true); 

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const list = (
    <Box role="presentation">
      <List sx={{ bgcolor: 'background.paper' }}>
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
    alignItems: 'center',
    width: '100%',
    px: 1.5,
    py: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1100,
    backdropFilter: isTop ? 'none' : 'blur(6px)',
    bgcolor: isTop ? 'transparent' : 'background.default',
    transition: 'background-color 0.3s ease',
  }}
>
  {/* Menu icon with fixed width */}
  <Box sx={{ width: '64px' }}>
    <IconButton>
      <MenuIcon onClick={toggleDrawer(true)} />
      <SwipeableDrawer
        anchor="top"
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list}
      </SwipeableDrawer>
    </IconButton>
  </Box>

  {/* Logo centered absolutely */}
  <Box
    sx={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    }}
  >
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

  );
}

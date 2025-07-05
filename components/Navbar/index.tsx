'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  Typography,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery,
  InputBase,
  Paper,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Navbar() {
  const pathname = usePathname();
  const shouldChangeBgOnScroll = ['/', '/port'];
  const [state, setState] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const isWhiteMode = isTop && shouldChangeBgOnScroll.includes(pathname);
  const isMobile = useMediaQuery('(max-width:768px)');
  const [openProduct, setOpenProduct] = useState(false);

  const toggleDrawer = (open: boolean) =>
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

  const handleClickProduct = () => {
    setOpenProduct(!openProduct);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileMenu = (
    <SwipeableDrawer
      anchor="top"
      open={state}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Box role="presentation">
        <List sx={{ bgcolor: 'background.paper' }}>
          <ListItemButton onClick={handleClickProduct}>
            <ListItemText primary="Product" />
            {openProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} key="Tree_With_Pot" href={`/product/plant`}>
                <ListItemText primary="ต้นไม้พร้อมกระถาง" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} key="Pot" href={`/product/pot`}>
                <ListItemText primary="กระถาง" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} key="Big_Tree" href={`/product/bigtree`}>
                <ListItemText primary="ต้นไม้ใหญ่" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} key="Garden" href={`/product/garden`}>
                <ListItemText primary="จัดสวน" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton href={`/port`}>
            <ListItemText primary="Portfolio" />
          </ListItemButton>
          <ListItemButton href={`/contact`}>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </List>
      </Box>
    </SwipeableDrawer>
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
        justifyContent: 'space-between',
      }}
    >
      {isMobile ? (
        <>
          <Box>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: isWhiteMode ? "#fff" : "#222" }}>
              <MenuIcon />
            </IconButton>
            {mobileMenu}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Link href="/">
              <Image
                src="/logo/Logo H_C-01.png"
                alt="Logo"
                width={160}
                height={160}
                priority
                style={{
                  filter: isTop ? "invert(1)" : "none",
                  transition: "filter 0.3s",
                }}
              />
            </Link>
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left side menu */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 6,
              pl: 6,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                '&:hover .dropdown-menu': {
                  display: 'block',
                },
              }}
            >
              <Typography sx={{ fontWeight: 500, color: isWhiteMode ? "#fff" : "#222", transition: "color 0.3s" }}>
                Product
              </Typography>

              {/* Dropdown content */}
              <Box
                className="dropdown-menu"
                sx={{
                  display: 'none',
                  position: 'absolute',
                  top: '100%',
                  left: '-10px',
                  bgcolor: 'background.paper',
                  zIndex: 1000,
                  minWidth: 160,
                  overflow: 'hidden',
                }}
              >
                <Link href="/product/plant">
                  <Typography sx={{ px: 1.5, py: 1.5, '&:hover': { bgcolor: 'grey.100' }, cursor: 'pointer', fontSize: '14px' }}>
                    ต้นไม้พร้อมกระถาง
                  </Typography>
                </Link>
                <Link href="/product/pot">
                  <Typography sx={{ px: 1.5, py: 1.5, '&:hover': { bgcolor: 'grey.100' }, cursor: 'pointer', fontSize: '14px' }}>
                    กระถาง
                  </Typography>
                </Link>
              </Box>
            </Box>

            {/* Other menu items */}
            <Link href="/port">
              <Typography sx={{ fontWeight: 500, color: isWhiteMode ? "#fff" : "#222", transition: "color 0.3s" }}>Portfolio</Typography>
            </Link>
            <Link href="/contact">
              <Typography sx={{ fontWeight: 500, color: isWhiteMode ? "#fff" : "#222", transition: "color 0.3s" }}>Contact</Typography>
            </Link>
          </Box>
          {/* Center logo */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link href="/">
              <Image
                src="/logo/Logo H_C-01.png"
                alt="Logo"
                width={160}
                height={160}
                priority
                style={{
                  width: 'auto', // ✅ ป้องกัน warning
                  height: 'auto',
                  filter: isWhiteMode ? "invert(1)" : "none",
                  transition: "filter 0.3s",
                }}
              />

            </Link>
          </Box>
          {/* Right side (Search bar) */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pr: 6 }}>
            <Paper
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 200,
                height: 36,
                px: 1,
                bgcolor: isWhiteMode ? "transparent" : "background.default",
                boxShadow: 'none',
                border: isWhiteMode ? '1px solid #fff' : '1px solid rgba(0,0,0,0.2)',
                transition: "border 0.3s, background-color 0.3s",
              }}
            >
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  color: isWhiteMode ? "#fff" : "#222",
                  '::placeholder': { color: isWhiteMode ? "#fff" : "#888" },
                  transition: "color 0.3s",
                }}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" sx={{ p: '5px', color: isWhiteMode ? "#fff" : "#222", transition: "color 0.3s" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
}
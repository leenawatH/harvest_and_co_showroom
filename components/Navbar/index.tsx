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
  Collapse,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Navbar() {
  const pathname = usePathname();
  const shouldChangeBgOnScroll = ['/', '/port'];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [openProduct, setOpenProduct] = useState(false);
  const isWhiteMode = isTop && shouldChangeBgOnScroll.includes(pathname);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const handleClickProduct = () => setOpenProduct(!openProduct);

  // ✅ Mobile Drawer (full screen style)
  const mobileMenu = (
    <SwipeableDrawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 320,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link href="/" onClick={() => setDrawerOpen(false)}>
          <Image src="/logo/Logo H_C-01.png" alt="Logo" width={120} height={120} />
        </Link>
      </Box>

      {/* Menu List */}
      <List sx={{ flex: 1 }}>
        <ListItemButton onClick={handleClickProduct}>
          <ListItemText primary="Product" primaryTypographyProps={{ fontWeight: 500, fontSize: 16 }} />
          {openProduct ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openProduct} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => setDrawerOpen(false)}
              component={Link}
              href="/product/plant"
            >
              <ListItemText primary="ต้นไม้พร้อมกระถาง" primaryTypographyProps={{ fontSize: 15 }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => setDrawerOpen(false)}
              component={Link}
              href="/product/pot"
            >
              <ListItemText primary="กระถาง" primaryTypographyProps={{ fontSize: 15 }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => setDrawerOpen(false)}
              component={Link}
              href="/product/bigtree"
            >
              <ListItemText primary="ต้นไม้ใหญ่" primaryTypographyProps={{ fontSize: 15 }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => setDrawerOpen(false)}
              component={Link}
              href="/product/garden"
            >
              <ListItemText primary="จัดสวน" primaryTypographyProps={{ fontSize: 15 }} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => setDrawerOpen(false)} component={Link} href="/port">
          <ListItemText primary="Portfolio" primaryTypographyProps={{ fontWeight: 500, fontSize: 16 }} />
        </ListItemButton>
        <ListItemButton onClick={() => setDrawerOpen(false)} component={Link} href="/contact">
          <ListItemText primary="Contact" primaryTypographyProps={{ fontWeight: 500, fontSize: 16 }} />
        </ListItemButton>
      </List>

      <Divider />
      <Box sx={{ textAlign: 'center', py: 2, fontSize: 13, color: 'gray' }}>
        © 2025 Harvest & Co.
      </Box>
    </SwipeableDrawer>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        px: 2,
        py: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        backdropFilter: isTop ? 'none' : 'blur(6px)',
        bgcolor: isTop ? 'transparent' : 'rgba(255,255,255,0.95)',
        borderBottom: isTop ? 'none' : '1px solid rgba(0,0,0,0.05)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        justifyContent: 'space-between',
      }}
    >
      {isMobile ? (
        <>
          {/* Left: Hamburger */}
          <IconButton onClick={toggleDrawer(true)} sx={{ color: isWhiteMode ? '#fff' : '#222' }}>
            <MenuIcon fontSize="large" />
          </IconButton>

          {/* Center: Logo */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              <Image
                src="/logo/Logo H_C-01.png"
                alt="Logo"
                width={140}
                height={140}
                priority
                style={{
                  width: 'auto',
                  height: 'auto',
                  filter: isWhiteMode ? 'invert(1)' : 'none',
                  transition: 'filter 0.3s',
                }}
              />
            </Link>
          </Box>

          {/* Drawer */}
          {mobileMenu}
        </>
      ) : (
        // ✅ Desktop (เหมือนเดิม)
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left menu */}
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
                '&:hover .dropdown-menu': { display: 'block' },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: isWhiteMode ? '#fff' : '#222',
                  transition: 'color 0.3s',
                  cursor: 'pointer',
                }}
              >
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
                  boxShadow: 2,
                  borderRadius: 1,
                }}
              >
                <Link href="/product/plant">
                  <Typography sx={{ px: 1.5, py: 1.2, '&:hover': { bgcolor: 'grey.100' }, cursor: 'pointer', fontSize: 14 }}>
                    ต้นไม้พร้อมกระถาง
                  </Typography>
                </Link>
                <Link href="/product/pot">
                  <Typography sx={{ px: 1.5, py: 1.2, '&:hover': { bgcolor: 'grey.100' }, cursor: 'pointer', fontSize: 14 }}>
                    กระถาง
                  </Typography>
                </Link>
              </Box>
            </Box>

            <Link href="/port">
              <Typography sx={{ fontWeight: 500, color: isWhiteMode ? '#fff' : '#222', transition: 'color 0.3s' }}>Portfolio</Typography>
            </Link>
            <Link href="/contact">
              <Typography sx={{ fontWeight: 500, color: isWhiteMode ? '#fff' : '#222', transition: 'color 0.3s' }}>Contact</Typography>
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
                  width: 'auto',
                  height: 'auto',
                  filter: isWhiteMode ? 'invert(1)' : 'none',
                  transition: 'filter 0.3s',
                }}
              />
            </Link>
          </Box>

          {/* Right empty slot for balance */}
          <Box sx={{ flex: 1 }} />
        </Box>
      )}
    </Box>
  );
}

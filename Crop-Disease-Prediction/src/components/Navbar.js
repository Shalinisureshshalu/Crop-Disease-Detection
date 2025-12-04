import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Agriculture as AgricultureIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../services/firebase';
import toast from 'react-hot-toast';
import  Chatbot from "./Chatbot";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
      handleMenuClose();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  const handleDetectClick = () => {
    navigate('/detect');
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
        Home
      </MenuItem>
      {user && (
        <>
          <MenuItem onClick={handleDetectClick}>Detect Disease</MenuItem>
          <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      )}
      {!user && (
        <>
          <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
            Login
          </MenuItem>
          <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Crop Disease Detection
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={handleDetectClick}
                sx={{ mr: 1 }}
              >
                Detect Disease
              </Button>

              <Button
                color="inherit"
                onClick={handleDashboardClick}
                sx={{ mr: 1 }}
              >
                Dashboard
              </Button>
                      
              <>
              <Button 
               color="inherit"
              onClick={() => setChatOpen(true)}>
                AI Assistant
                </Button>
                <Chatbot open={chatOpen} 
                onClose={() => setChatOpen(false)} />

               </>


              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', mr:2}}
              >
                SignIn
              </Button>

              <Button
                color="inherit"
                onClick={() => navigate('/register')}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                SignUp
              </Button>
            </>
          )}
        </Box>

        {renderMenu}
        {renderMobileMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
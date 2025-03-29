import React, { useState, useEffect } from 'react';
import { getUserById,updateUser } from '../api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Divider
} from '@mui/material';
import { 
  ArrowBack,
  Save,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        if (response.status === 200) {
          setUser(response.data.data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {   
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await updateUser(id, user);
      if (response.status === 200) {
        navigate('/users', { state: { message: 'User updated successfully' } });
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 3,
            gap: 2
          }}>
            <IconButton onClick={handleCancel} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Change your information
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 3 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                mb: 3
              }}>
                {/* Avatar Section */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  minWidth: { md: 200 }
                }}>
                  <Avatar
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      mb: 2,
                      border: '2px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    User ID: {id}
                  </Typography>
                </Box>

                {/* Form Fields */}
                <Box sx={{ flex: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                  size={isMobile ? 'medium' : 'large'}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saving}
                  size={isMobile ? 'medium' : 'large'}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditUser;
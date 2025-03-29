import React, { useState, useEffect } from "react";
import { deleteUser } from "../api/Api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  CircularProgress,
  Pagination,
  IconButton,
  Tooltip,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
} from "@mui/material";
import { Edit, Delete, Logout } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://reqres.in/api/users?page=${page}`
        );
        const data = await response.json();

        if (response.status === 200) {
          setUsers(data.data);
          setTotalPages(data.total_pages);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = (userId) => {
    // console.log(userId);

    navigate(`/edituser/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser(userId);
      
      if (response.status === 204) {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 1, sm: 3 },
            borderRadius: 2,
            width: "100%",
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Users
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<Logout />}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Logout" : "Sign Out"}
              </Button>
            </Box>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : isMobile ? (
            
            <Grid container spacing={2}>
              {users.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card sx={{ bgcolor: "background.paper" }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          src={user.avatar}
                          alt={`${user.first_name} ${user.last_name}`}
                          sx={{ width: 56, height: 56 }}
                        />
                      }
                      title={`${user.first_name} ${user.last_name}`}
                      subheader={user.email}
                    />
                    <Divider />
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(user.id)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(user.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Desktop Table View
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Avatar
                            src={user.avatar}
                            sx={{ width: 40, height: 40 }}
                          />
                        </TableCell>
                        <TableCell>{user.first_name}</TableCell>
                        <TableCell>{user.last_name}</TableCell>
                        <TableCell sx={{ wordBreak: "break-word" }}>
                          {user.email}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(user.id)}>
                              <Edit color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(user.id)}
                              sx={{ ml: 1 }}
                            >
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Pagination - works for both views */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              "& .MuiPagination-ul": {
                flexWrap: "wrap",
              },
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size={isMobile ? "small" : "medium"}
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={isMobile ? 1 : 1}
            />
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default UserList;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Moment from 'moment';
// material
import {
  Card,
  Table,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  FormControl,
  Select,
  Icon,
  Container,
  Typography,
  MenuItem,
  TableContainer,
  TablePagination,
  TextField,
  Grid,
  IconButton,
  Avatar,
} from '@mui/material';
import { Box } from '@mui/system';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LoadingButton } from '@mui/lab';
import { useFormik, Form, FormikProvider } from 'formik';
import { CopyAll, Visibility } from '@mui/icons-material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filter from '../components/filters/AdminFilter';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import Popup from '../components/popups/AdminStatusChange';

export default function Admins() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState();
  const [pages, setPages] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();
  const size = 10;
  const [options, setOptions] = useState({ size, page: 0 });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(1);
  const mobileRegExp = '^[6789][0-9]{9}';

  const adminSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').min(4, 'Fullname must be at least 4 charecters'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    accType: Yup.string().required('Account type is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 6 charecters'),
  });

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      accType: 'SUB_ADMIN',
      password: '',
    },
    validationSchema: adminSchema,
    onSubmit: async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/create`, values);
        if (!res.data.isError) {
          closeAddAdminModal(res.data.message);
        } else {
          toast.error(res.data.message);
        }
        getAdmins(options);
        resetForm();
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    },
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

  const handleStatusChange = (event, item, index) => {
    console.log('item', item);
    if (`${!item.isBlocked}` === event.target.value) {
      return;
    }
    console.log(index);
    setSelectedIndex(index);
  };

  const handleClose = (refresh = false, message = '') => {
    setSelectedIndex();
    if (refresh) {
      getAdmins(options);
    }
    if (message && refresh) {
      toast(message);
    } else if (message && !refresh) {
      toast.error(message);
    }
  };
  const openAddUserModal = () => {
    setOpen(true);
  };
  const closeAddAdminModal = (message) => {
    setOpen(false);
    toast(message);
  };

  const handlePageChange = (event, newPage) => {
    const temp = { ...options, page: newPage };
    setPages(newPage);
    setOptions(temp);
    setIsLoading(true);
    getAdmins(temp);
  };

  const getAdmins = (options) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/all`, {
        params: options,
      })
      .then((res) => {
        console.log('res', res);
        if (res.data.isError === false) {
          setIsLoading(false);
          setAdminCount(res.data.data.maxRecords);
          setAdminData(res.data.data.admins);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const exportUsers = async (options) => {
    console.log(options);
    setIsLoading1(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/export`, options);
      console.log('res', res);
      setIsLoading1(false);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setIsLoading1(false);
      toast.success(error.response.data.message);
    }
  };

  const goToPage = () => {
    console.log('hi');
    if (input > Math.ceil(adminCount / size)) {
      return;
    }
    setInput(input > 0 ? input : 1);
    setPages(input - 1 >= 0 ? input - 1 : 0);
    const temp = { ...options, page: input - 1 };
    setOptions(temp);
    getAdmins(temp);
  };

  const applyFilters = (filter) => {
    console.log('filter', filter);
    const temp = { page: 0, size };
    if (filter.id.length) {
      temp.id = filter.id;
    }
    if (filter.fullname.length) {
      temp.fullname = filter.fullname.trim();
    }
    if (filter.id.length) {
      temp.id = filter.id;
    }
    if (filter.email.length) {
      temp.email = filter.email;
    }
    if (filter.startDate.length) {
      temp.startDate = filter.startDate;
    }
    if (filter.endDate.length) {
      temp.endDate = filter.endDate;
    }
    if (filter.isBlocked.length) {
      temp.isBlocked = filter.isBlocked;
    }

    setOptions(temp);
    setPages(0);
    getAdmins(temp);
  };
  useEffect(() => {
    getAdmins(options);
  }, []);
  return (
    <>
      <Page title="Admins">
        {isLoading ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Add admin Dialog */}
            <Dialog open={open}>
              <DialogTitle>Add Admin</DialogTitle>
              <Grid container paddingBottom={'10px'} Width="500px">
                <DialogContent paddingTop="20px">
                  <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                      <Grid item xs={12} md={12} lg={12}>
                        <Stack direction={'column'} spacing={1} width="500px">
                          <Stack direction="row" justifyContent="space-between">
                            <TextField
                              type="text"
                              label="Fullname"
                              fullWidth
                              value={values.fullname}
                              {...getFieldProps('fullname')}
                              error={Boolean(touched.fullname && errors.fullname)}
                              helperText={touched.fullname && errors.fullname}
                            />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <TextField
                              type="text"
                              label="Email"
                              value={values.email}
                              fullWidth
                              {...getFieldProps('email')}
                              error={Boolean(touched.email && errors.email)}
                              helperText={touched.email && errors.email}
                            />
                            <TextField
                              select
                              label="Account Type"
                              fullWidth
                              value={values.accType}
                              {...getFieldProps('accType')}
                              error={Boolean(touched.accType && errors.accType)}
                              helperText={touched.accType && errors.accType}
                            >
                              <MenuItem value="SUB_ADMIN">SUB ADMIN</MenuItem>
                              {/* <MenuItem value="SUPER_ADMIN">SUPER ADMIN</MenuItem> */}
                            </TextField>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <TextField
                              type="password"
                              label="Password"
                              fullWidth
                              value={values.password}
                              {...getFieldProps('password')}
                              error={Boolean(touched.password && errors.password)}
                              helperText={touched.password && errors.password}
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                      <Stack direction={'row'} justifyContent="flex-end" paddingTop="20px">
                        <Button onClick={closeAddAdminModal}>Cancel</Button>
                        <LoadingButton type="submit" loading={isSubmitting}>
                          Add Admin
                        </LoadingButton>
                      </Stack>
                    </Form>
                  </FormikProvider>
                </DialogContent>
              </Grid>
            </Dialog>
            {/* Add admin dialog end */}
            <Container maxWidth="xl">
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Admins
                </Typography>
              </Stack>
              <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} padding={2}>
                    <TextField
                      size="small"
                      style={{ maxWidth: '100px', maxHeight: '35px' }}
                      type="number"
                      component="div"
                      label="Go to"
                      value={input}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          goToPage();
                        }
                      }}
                      onInput={(e) => setInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={goToPage} style={{ maxHeight: '35px' }}>
                      Go
                    </Button>
                  </Stack>
                  <Stack padding={1} direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                    <Button startIcon={<AddIcon />} variant="contained" onClick={openAddUserModal}>
                      Add Admin
                    </Button>

                    <Filter applyFilters={applyFilters} />
                  </Stack>
                </Stack>

                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      {/* <UserListHead /> */}
                      <TableHead>
                        <TableRow>
                          <TableCell>Sl No</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>ProfilePic</TableCell>
                          <TableCell>Fullname</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Account Type</TableCell>
                          <TableCell>Admin ID</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {adminData?.map((item, id) => (
                          <TableRow key={id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            <TableCell style={{ width: '50px' }}>{pages * size + (id + 1)}</TableCell>
                            <TableCell sx={{ minWidth: '120px' }}>
                              {Moment(item.createdAt).format('YYYY-MM-DD')}
                            </TableCell>
                            <TableCell>
                              <Avatar
                                src={process.env.REACT_APP_API_URL + item.profilePic}
                                sx={{
                                  width: 48,
                                  height: 48,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              style={{
                                minWidth: '130px',
                                maxWidth: '220px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                            >
                              {item?.fullname?.toUpperCase()}
                            </TableCell>
                            <TableCell style={{ minWidth: '130px', wordBreak: 'break-all' }}>{item.email}</TableCell>
                            <TableCell>{item.accType?.replaceAll('_', ' ')}</TableCell>
                            <TableCell style={{ cursor: 'pointer', width: '80px' }}>
                              <Stack direction="column" spacing={0.5} width="80px">
                                <CopyToClipboard text={item._id} onCopy={() => toast.info('Admin id copied')}>
                                  <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-start">
                                    <CopyAll sx={{ height: '18px', width: '18px' }} color="primary" />
                                    <Typography color="primary" variant="p">
                                      Copy ID
                                    </Typography>
                                  </Stack>
                                </CopyToClipboard>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <FormControl sx={{ minWidth: 100 }}>
                                <Select
                                  size="small"
                                  value={!item.isBlocked}
                                  onChange={(e) => handleStatusChange(e, item, id)}
                                >
                                  <MenuItem value="true">Active</MenuItem>
                                  <MenuItem value="false">Blocked</MenuItem>
                                </Select>
                                {selectedIndex === id && <Popup item={item} handleClose={handleClose} />}
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                sx={{ margin: 0, padding: 0 }}
                                color="primary"
                                onClick={() => navigate(`/dashboard/account/view/${item._id}`)}
                              >
                                <Visibility sx={{ fontSize: '20px' }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component={'div'}
                  count={adminCount}
                  showFirstButton
                  showLastButton
                  onPageChange={handlePageChange}
                  rowsPerPage={size}
                  page={pages}
                />
              </Card>
            </Container>
          </>
        )}
      </Page>
    </>
  );
}

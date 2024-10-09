import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Autocomplete,
} from '@mui/material';
import { Box } from '@mui/system';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LoadingButton } from '@mui/lab';
import { useFormik, Form, FormikProvider } from 'formik';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Filter from '../components/filters/DesignationFilter';

// components
import Scrollbar from './Scrollbar';
import Iconify from './Iconify';
// import Popup from '../components/popups/designationStatusChange';

export default function Designation() {
  const [designationData, setDesignationData] = useState();
  const [pages, setPages] = useState(0);
  const [designationCount, setDesignationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();
  const [size, setSize] = useState(10);
  const [options, setOptions] = useState({ size, page: 0 });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(1);
  const [designations, setDesignations] = useState([]);

  const mobileRegExp = '^[6789][0-9]{9}';

  const designationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').min(4, 'Fullname must be at least 4 charecters'),
    phone: Yup.string().matches(mobileRegExp, 'Phone number is not valid').max(10, 'Phone number is not valid'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    designation: Yup.string().required('Designation is required'),
  });

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      phone: '',
      designation: '',
    },
    validationSchema: designationSchema,
    onSubmit: async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/designation/admin/create`, values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (!res.data.isError) {
          closeAddDesignationModal(res.data.message);
        } else {
          toast.error(res.data.message);
        }
        getDesignations(options);
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
      getDesignations(options);
    }
    if (message) {
      toast(message);
    }
  };
  const openAddDesignationModal = () => {
    setOpen(true);
  };
  const closeAddDesignationModal = (message) => {
    setOpen(false);
    resetForm();
    toast(message);
  };

  const handlePageChange = (event, newPage) => {
    const temp = { ...options, page: newPage };
    setPages(newPage);
    setOptions(temp);
    setIsLoading(true);
    getDesignations(temp);
  };

  const getDesignations = (options) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/configuration/admin/designations`, {
        params: options,
      })
      .then((res) => {
        console.log('res', res);
        if (res.data.isError === false) {
          setIsLoading(false);
          setDesignationData(res.data.data.designations);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
    const temp = { ...options, size: event.target.value, page: 0 };
    setPages(0);
    setOptions(temp);
    getDesignations(temp);
  };

  const goToPage = () => {
    console.log('hi');
    if (input > Math.ceil(designationCount / size)) {
      return;
    }
    setInput(input > 0 ? input : 1);
    setPages(input - 1 >= 0 ? input - 1 : 0);
    const temp = { ...options, page: input - 1 };
    setOptions(temp);
    getDesignations(temp);
  };

  const applyFilters = (filter) => {
    console.log('filter', filter);
    const temp = { page: 0, size };
    if (filter.designationId.length) {
      temp.designationId = filter.designationId;
    }
    if (filter.name.length) {
      temp.name = filter.name.trim();
    }
    if (filter.phone.length) {
      temp.phone = filter.phone;
    }
    if (filter.email.length) {
      temp.email = filter.email;
    }
    if (filter.startDate.length) {
      temp.startDate = filter.startDate;
    }
    if (filter.clubId.length) {
      temp.clubId = filter.clubId;
    }
    if (filter.endDate.length) {
      temp.endDate = filter.endDate;
    }
    if (filter.plan.length) {
      temp.plan = filter.plan;
    }
    if (filter.completed.length) {
      temp.completed = filter.completed;
    }
    setOptions(temp);
    setPages(0);
    getDesignations(temp);
  };
  useEffect(() => {
    getDesignations(options);
  }, []);
  return (
    <>
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
          {/* Add Designation Dialog */}
          <Dialog
            open={open}
            onClose={() => {
              setOpen(false);
              resetForm();
            }}
          >
            <DialogTitle>Add Designation</DialogTitle>
            <Grid container paddingBottom={'10px'} Width="500px">
              <DialogContent paddingTop="20px">
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid item xs={12} md={12} lg={12}>
                      <Stack direction={'column'} spacing={1} width="500px">
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <TextField
                            type="text"
                            label="Fullname"
                            fullWidth
                            value={values.fullname}
                            {...getFieldProps('fullname')}
                            error={Boolean(touched.fullname && errors.fullname)}
                            helperText={touched.fullname && errors.fullname}
                          />
                          <TextField
                            type="text"
                            label="Email"
                            value={values.email}
                            fullWidth
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Autocomplete
                            id="asynchronous-demo"
                            defaultValue={values.designation}
                            fullWidth
                            open={open1}
                            onOpen={() => {
                              setOpen1(true);
                            }}
                            onClose={() => {
                              setOpen1(false);
                            }}
                            isOptionEqualToValue={(option, value) => option === value}
                            getOptionLabel={(option) => option}
                            options={designations}
                            loading={loading}
                            onChange={(_, value) => formik.setFieldValue('designation', value)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(touched.designation && errors.designation)}
                                helperText={touched.designation && errors.designation}
                                label="Designation"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          <TextField
                            type="number"
                            label="Phone Number"
                            fullWidth
                            value={values.phone}
                            {...getFieldProps('phone')}
                            error={Boolean(touched.phone && errors.phone)}
                            helperText={touched.phone && errors.phone}
                          />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <TextField
                            type="password"
                            label="Password"
                            value={values.password}
                            fullWidth
                            {...getFieldProps('password')}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                          />
                          <TextField
                            type="file"
                            fullWidth
                            label="Profile Picture"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: 'image/jpeg, image/jpg, image/png' }}
                            name="profilePic"
                            onChange={(event) => formik.setFieldValue('profilePic', event.target.files[0])}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Stack direction={'row'} justifyContent="flex-end" paddingTop="20px">
                      <Button onClick={closeAddDesignationModal}>Cancel</Button>
                      <LoadingButton type="submit" loading={isSubmitting}>
                        Add Designation
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </DialogContent>
            </Grid>
          </Dialog>
          {/* Add Designation dialog end */}

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
                  onInput={(e) => setInput(e.target.value)}
                />
                <Button variant="contained" onClick={goToPage} style={{ maxHeight: '35px' }}>
                  Go
                </Button>
              </Stack>
              <Stack padding={1} direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                <Button startIcon={<AddIcon />} variant="contained" onClick={openAddDesignationModal}>
                  Add Designation
                </Button>

                {/* <Filter applyFilters={applyFilters} /> */}
              </Stack>
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  {/* <DesignationListHead /> */}
                  <TableHead>
                    <TableRow>
                      <TableCell>Sl No</TableCell>
                      {/* <TableCell>Fullname</TableCell>
                        <TableCell>Designation ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Member since</TableCell>
                        <TableCell>Designation status</TableCell>
                        <TableCell>Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {designationData?.map((item, id) => (
                      <TableRow key={id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell style={{ width: '50px' }}>{pages * size + (id + 1)}</TableCell>
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
                        <TableCell style={{ cursor: 'pointer', width: '80px' }}>
                          <Stack direction="column" spacing={0.5} width="80px">
                            <CopyToClipboard text={item._id} onCopy={() => toast.info('Designation id copied')}>
                              <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-start">
                                <Iconify
                                  icon="lucide:clipboard-copy"
                                  style={{ height: '18px', width: '18px', color: '#09ADBD' }}
                                />
                                <Typography sx={{ color: '#09ADBD' }} variant="p">
                                  Copy ID
                                </Typography>
                              </Stack>
                            </CopyToClipboard>
                          </Stack>
                        </TableCell>
                        <TableCell style={{ minWidth: '130px', wordBreak: 'break-all' }}>{item.email}</TableCell>
                        <TableCell>{item}</TableCell>
                        <TableCell>{Moment(item.createdAt).format('MMMM DD, YYYY')}</TableCell>
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
                            {/* {selectedIndex === id && <Popup item={item} handleClose={handleClose} />} */}
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Link to={`/dashboard/Designation/${item._id}`}>
                              <Icon sx={{ color: 'gray' }}>
                                <RemoveRedEyeIcon />
                              </Icon>
                            </Link>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {/* <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                onRowsPerPageChange={handleSizeChange}
                component={'div'}
                count={designationCount}
                showFirstButton
                showLastButton
                onPageChange={handlePageChange}
                rowsPerPage={size}
                page={pages}
              /> */}
          </Card>
        </>
      )}
    </>
  );
}

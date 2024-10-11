import { Link, Link as RouterLink } from 'react-router-dom';
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
  Box,
} from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import { useEffect, useState } from 'react';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Filter from '../components/filters/BlogFilter';
import Popup from '../components/popups/BlogStatusChange';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Projects() {
  const [blogData, setBlogData] = useState();
  const [pages, setPages] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const size = 10;
  const [options, setOptions] = useState({ size, page: 0 });
  const [input, setInput] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState();

  const getBlogPosts = async (options) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/project/all`, {
        params: options,
      });
      setBlogData(res.data.data.projects);
      setBlogCount(res.data.data.maxRecords);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleClose = (refresh = false, message = '') => {
    setSelectedIndex();
    if (refresh) {
      getBlogPosts(pages);
    }
    if (message) {
      toast(message);
    }
  };

  const handlePageChange = (event, newPage) => {
    const temp = { ...options, page: newPage };
    setPages(newPage);
    setOptions(temp);
    setIsLoading(true);
    getBlogPosts(temp);
  };

  const goToPage = () => {
    if (input > Math.ceil(blogCount / size)) {
      return;
    }
    setInput(input > 0 ? input : 1);
    setPages(input - 1 >= 0 ? input - 1 : 0);
    const temp = { ...options, page: input - 1 };
    setOptions(temp);
    getBlogPosts(temp);
  };

  const handleStatusChange = (event, item, index) => {
    console.log('item', item);
    if (`${!item.isBlocked}` === event.target.value) {
      return;
    }
    console.log(index);
    setSelectedIndex(index);
  };

  const applyFilters = (filter) => {
    console.log('filter', filter);
    const temp = { page: 0, size };
    if (filter.blogId.length) {
      temp.blogId = filter.blogId;
    }
    if (filter.category.length) {
      temp.category = filter.category;
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
    getBlogPosts(temp);
  };

  useEffect(() => {
    getBlogPosts(options);
  }, []);

  return (
    <Page title="Projects">
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
          <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4">Projects</Typography>
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
                    onInput={(e) => setInput(e.target.value)}
                  />
                  <Button variant="contained" onClick={goToPage} style={{ maxHeight: '35px' }}>
                    Go
                  </Button>
                </Stack>
                <Stack padding={1} direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                  <Link to={'/dashboard/projects/add'}>
                    <Button startIcon={<Iconify icon="eva:plus-fill" />} variant="contained">
                      Add Project
                    </Button>
                  </Link>
                </Stack>
              </Stack>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    {/* <BlogListHead /> */}
                    <TableHead>
                      <TableRow>
                        <TableCell>Sl No</TableCell>
                        <TableCell>ProjectId</TableCell>
                        <TableCell sx={{ paddingRight: 0 }}>Image</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell>ProjectLink</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Is Popular</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blogData?.map((item, id) => (
                        <TableRow key={id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                          <TableCell style={{ width: '80px' }}>{pages * size + (id + 1)}</TableCell>
                          <TableCell style={{ width: '80px', cursor: 'pointer' }}>
                            <Stack direction="column" spacing={0.5} width="80px">
                              <CopyToClipboard text={item._id} onCopy={() => toast.info('Blog id copied')}>
                                <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-start">
                                  <Iconify
                                    icon="lucide:clipboard-copy"
                                    style={{ height: '18px', width: '18px', color: '#192B6B' }}
                                  />
                                  <Typography sx={{ color: '#192B6B' }} variant="p">
                                    Copy ID
                                  </Typography>
                                </Stack>
                              </CopyToClipboard>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Box
                              component="img"
                              src={item?.images && item.images[0]}
                              alt="blogimage"
                              sx={{ width: '100px', height: 'auto' }}
                            />
                          </TableCell>
                          <TableCell style={{ minWidth: '30%' }}>{item.projectName}</TableCell>
                          <TableCell>{item?.projectLink}</TableCell>
                          <TableCell style={{ width: '120px' }}>
                            {Moment(item.createdAt).format('DD-MMM-YYYY')}
                          </TableCell>
                          <TableCell>
                            <FormControl sx={{ minWidth: 100 }}>
                              <Select
                                size="small"
                                value={item.isBlocked}
                                onChange={(e) => handleStatusChange(e, item, id)}
                              >
                                <MenuItem value="true">Blocked</MenuItem>
                                <MenuItem value="false">Active</MenuItem>
                              </Select>
                              {selectedIndex === id && <Popup item={item} handleClose={handleClose} />}
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl sx={{ minWidth: 100 }}>
                              <Select
                                size="small"
                                value={item.isPopular}
                                onChange={(e) => handleStatusChange(e, item, id)}
                              >
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                              </Select>
                              {selectedIndex === id && <Popup item={item} handleClose={handleClose} />}
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Link to={`/dashboard/projects/view/${item._id}`}>
                                <Icon sx={{ color: 'gray' }}>
                                  <Iconify icon="subway:eye" />
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
              <TablePagination
                rowsPerPageOptions={[]}
                component={'div'}
                showFirstButton
                showLastButton
                count={blogCount}
                onPageChange={handlePageChange}
                rowsPerPage={size}
                page={pages}
              />
            </Card>
          </Container>
        </>
      )}
    </Page>
  );
}

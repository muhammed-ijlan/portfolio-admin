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
import Iconify from '../Iconify';
import Page from '../Page';
import Scrollbar from '../Scrollbar';
import Filter from './BlogCategoryFilter';
import Popup from '../popups/CategoryStatusChange';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function BlogCategories() {
  const [categoriesData, setCategoriesData] = useState();
  const [pages, setPages] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const size = 10;
  const [options, setOptions] = useState({ size, page: 0 });
  const [input, setInput] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState();
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const getcategories = async (options) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/blog-category`, {
        params: options,
      });
      console.log('category', res);
      setCategoriesData(res.data.data.categories);
      setCategoriesCount(res.data.data.maxRecords);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addNewCategory = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/blog-category/`, { name: category });
      getcategories();
      toast(res.data.message);
      setCategory('');
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const updateCategory = async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/blog-category`, {
        name: selectedCategory,
        id: selectedId,
      });
      getcategories();
      toast(res.data.message);
      setSelectedCategory({});
      setOpen1(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const closeAddCategoryModal = () => {
    setOpen(false);
    toast();
  };

  const handleEditCategory = (e, item) => {
    setSelectedCategory(item.name);
    setOpen1(true);
    setSelectedId(item._id);
  };
  const closeEditCategoryModal = () => {
    setOpen1(false);
    toast();
  };

  const handlePageChange = (event, newPage) => {
    const temp = { ...options, page: newPage };
    setPages(newPage);
    setOptions(temp);
    setIsLoading(true);
    getcategories(temp);
  };

  const goToPage = () => {
    if (input > Math.ceil(categoriesCount / size)) {
      return;
    }
    setInput(input > 0 ? input : 1);
    setPages(input - 1 >= 0 ? input - 1 : 0);
    const temp = { ...options, page: input - 1 };
    setOptions(temp);
    getcategories(temp);
  };

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
      getcategories(options);
    }
    if (message) {
      toast(message);
    }
  };

  const applyFilters = (filter) => {
    console.log('filter', filter);
    const temp = { page: 0, size };
    if (filter.id.length) {
      temp.id = filter.id;
    }
    if (filter.name.length) {
      temp.name = filter.name;
    }
    if (filter.isBlocked.length) {
      temp.isBlocked = filter.isBlocked;
    }
    setOptions(temp);
    setPages(0);
    getcategories(temp);
  };

  useEffect(() => {
    getcategories(options);
  }, []);

  return (
    <Page title="Categories">
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
          <>
            {/* Add Category Dialog */}
            <Dialog open={open}>
              <DialogTitle>Add Category</DialogTitle>
              <Grid container paddingBottom={'10px'} Width="500px">
                {' '}
                <DialogContent paddingTop="20px">
                  <Grid item xs={12} md={12} lg={12}>
                    <Stack direction={'column'} spacing={1} width="500px">
                      <Stack direction="row" justifyContent="space-between">
                        <TextField
                          type="text"
                          label="Category"
                          fullWidth
                          value={category}
                          onInput={(e) => setCategory(e.target.value)}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Stack direction={'row'} justifyContent="flex-end" paddingTop="20px">
                    <Button onClick={closeAddCategoryModal}>Cancel</Button>
                    <Button type="submit" onClick={addNewCategory} disabled={!category.length}>
                      Add Category
                    </Button>
                  </Stack>
                </DialogContent>
              </Grid>
            </Dialog>
            {/* Add Category dialog end */}
            {/* edit Category Dialog */}
            <Dialog open={open1}>
              <DialogTitle>Add Category</DialogTitle>
              <Grid container paddingBottom={'10px'} Width="500px">
                <DialogContent paddingTop="20px">
                  <Grid item xs={12} md={12} lg={12}>
                    <Stack direction={'column'} spacing={1} width="500px">
                      <Stack direction="row" spacing={1} justifyContent="space-between">
                        <TextField
                          type="text"
                          label="Category"
                          fullWidth
                          defaultValue={selectedCategory}
                          onInput={(e) => setSelectedCategory(e.target.value)}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Stack direction={'row'} justifyContent="flex-end" paddingTop="20px">
                    <Button onClick={closeEditCategoryModal}>Cancel</Button>
                    <Button type="submit" onClick={updateCategory}>
                      Update Category
                    </Button>
                  </Stack>
                </DialogContent>
              </Grid>
            </Dialog>
            {/* edit Category dialog end */}
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
                <Stack padding={2} direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                  <Button
                    onClick={() => setOpen(true)}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    variant="contained"
                  >
                    Add Category
                  </Button>
                  <Filter applyFilters={applyFilters} />
                </Stack>
              </Stack>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sl No</TableCell>
                        <TableCell>category ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoriesData?.map((item, id) => (
                        <TableRow key={id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                          <TableCell>{id + 1}</TableCell>
                          <TableCell style={{ cursor: 'pointer' }}>
                            <Stack direction="column" spacing={0.5} width="100px">
                              <CopyToClipboard text={item._id} onCopy={() => toast.info('Categories id copied')}>
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
                          <TableCell style={{ width: '50%' }}>{item.name}</TableCell>
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
                              {selectedIndex === id && (
                                <Popup item={item} path="/blog-category/status" handleClose={handleClose} />
                              )}
                            </FormControl>
                          </TableCell>
                          <TableCell style={{ width: '100px' }}>
                            <Iconify
                              sx={{ cursor: 'pointer' }}
                              onClick={(e) => handleEditCategory(e, item)}
                              icon="clarity:edit-solid"
                            />
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
                count={categoriesCount}
                onPageChange={handlePageChange}
                rowsPerPage={size}
                page={pages}
              />
            </Card>
          </>
        </>
      )}
    </Page>
  );
}

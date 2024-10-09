import { useState } from 'react';
// material
import { Container, Typography, Card, Tab, Box, Stack } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

// components
import Page from '../components/Page';
import BlogCategories from '../components/category-lists/BlogCategories';
import NewsCategories from '../components/category-lists/NewsCategories';

export default function Categories() {
  const tabValue = '1';
  const [value, setValue] = useState(tabValue);
  console.log(tabValue);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Page title="Categories">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" gutterBottom>
              Categories
            </Typography>
          </Stack>
          <Card>
            <Box sx={{ width: '100%', marginTop: '20px' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab label="BLOG CATEGORIES" value="1" />
                    <Tab label="NEWS  CATEGORIES" value="2" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <BlogCategories />
                </TabPanel>
                <TabPanel value="2">
                  <NewsCategories />
                </TabPanel>
              </TabContext>
            </Box>
          </Card>
        </Container>
      </Page>
    </>
  );
}

// import { Link, Link as RouterLink } from 'react-router-dom';
// import axios from 'axios';
// import Moment from 'moment';

// // material
// import {
//   Card,
//   Table,
//   Stack,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
//   CircularProgress,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
//   FormControl,
//   Select,
//   Icon,
//   Container,
//   Typography,
//   MenuItem,
//   TableContainer,
//   TablePagination,
//   TextField,
//   Grid,
//   Box,
// } from '@mui/material';
// import CopyToClipboard from 'react-copy-to-clipboard';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // components
// import { useEffect, useState } from 'react';
// import Iconify from '../components/Iconify';
// import Page from '../components/Page';
// import Scrollbar from '../components/Scrollbar';
// import Popup from '../components/popups/CategoryStatusChange';

// // import Filter from '../components/CategoriesFilter';

// // ----------------------------------------------------------------------

// // ----------------------------------------------------------------------

// export default function Categories() {
//   const [categoriesData, setCategoriesData] = useState();
//   const [pages, setPages] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState();
//   const [category, setCategory] = useState('');

//   const getcategories = async (options) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/category`, {
//         params: options,
//       });
//       console.log('category', res);
//       setCategoriesData(res.data.data.categories);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   };

//   const addNewCategory = async () => {
//     try {
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/category/`, { name: category });
//       getcategories();
//       toast(res.data.message);
//       setCategory('');
//       setOpen(false);
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   const handleStatusChange = (event, item, index) => {
//     console.log('item', item);
//     if (`${!item.isBlocked}` === event.target.value) {
//       return;
//     }
//     console.log(index);
//     setSelectedIndex(index);
//   };
//   const handleClose = (refresh = false, message = '') => {
//     setSelectedIndex();
//     if (refresh) {
//       getcategories();
//     }
//     if (message) {
//       toast(message);
//     }
//   };

//   const closeAddCategoryModal = () => {
//     setOpen(false);
//     toast();
//   };

//   // const applyFilters = (filter) => {
//   //   console.log('filter', filter);
//   //   const temp = { page: 0, size };
//   //   if (filter.categoriesId.length) {
//   //     temp.categoriesId = filter.categoriesId;
//   //   }
//   //   if (filter.category.length) {
//   //     temp.category = filter.category;
//   //   }
//   //   if (filter.startDate.length) {
//   //     temp.startDate = filter.startDate;
//   //   }
//   //   if (filter.endDate.length) {
//   //     temp.endDate = filter.endDate;
//   //   }
//   //   setOptions(temp);
//   //   setPages(0);
//   //   getCategoriesPosts(temp);
//   // };

//   useEffect(() => {
//     getcategories();
//   }, []);

//   return (
//     <Page title="Categories">
//       {isLoading ? (
//         <div
//           style={{
//             width: '100%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '50vh',
//           }}
//         >
//           <CircularProgress />
//         </div>
//       ) : (
//         <>
//           {/* Add Category Dialog */}
//           <Dialog open={open}>
//             <DialogTitle>Add Category</DialogTitle>
//             <Grid container paddingBottom={'10px'} Width="500px">
//               <DialogContent paddingTop="20px">
//                 <Grid item xs={12} md={12} lg={12}>
//                   <Stack direction={'column'} spacing={1} width="500px">
//                     <Stack direction="row" justifyContent="space-between">
//                       <TextField
//                         type="text"
//                         label="Category"
//                         fullWidth
//                         value={category}
//                         onInput={(e) => setCategory(e.target.value)}
//                       />
//                     </Stack>
//                   </Stack>
//                 </Grid>
//                 <Stack direction={'row'} justifyContent="flex-end" paddingTop="20px">
//                   <Button onClick={closeAddCategoryModal}>Cancel</Button>
//                   <Button type="submit" onClick={addNewCategory} disabled={!category.length}>
//                     Add Category
//                   </Button>
//                 </Stack>
//               </DialogContent>
//             </Grid>
//           </Dialog>
//           {/* Add Category dialog end */}
//           <Container>
//             <Card>
//               <Stack padding={2} direction="row" justifyContent="space-between" spacing={2} alignItems="center">
//                 <Typography variant="h4">Categories</Typography>
//                 <Button onClick={() => setOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />} variant="contained">
//                   Add Categories
//                 </Button>
//                 {/* <Filter applyFilters={applyFilters} /> */}
//               </Stack>
//               <Box marginY={3}>
//                 <Scrollbar>
//                   <Stack direction={'row'} justifyContent="center">
//                     <TableContainer sx={{ minWidth: 500, maxWidth: 600 }}>
//                       <Table sx={{ border: 'solid 1px #f3f3f3', borderRadius: '10px' }}>
//                         {/* <CategoriesListHead /> */}
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>Sl No</TableCell>
//                             <TableCell>Categories ID</TableCell>
//                             <TableCell>Name</TableCell>
//                             <TableCell>Status</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {categoriesData?.map((item, id) => (
//                             <TableRow key={id}>
//                               <TableCell style={{ width: '100px' }}>{id + 1}</TableCell>
//                               <TableCell style={{ width: '100px', cursor: 'pointer' }}>
//                                 <Stack direction="column" spacing={0.5} width="100px">
//                                   <CopyToClipboard text={item._id} onCopy={() => toast.info('Categories id copied')}>
//                                     <Stack
//                                       direction="row"
//                                       alignItems="center"
//                                       spacing={0.5}
//                                       justifyContent="flex-start"
//                                     >
//                                       <Iconify
//                                         icon="lucide:clipboard-copy"
//                                         style={{ height: '18px', width: '18px', color: '#192B6B' }}
//                                       />
//                                       <Typography sx={{ color: '#192B6B' }} variant="p">
//                                         Copy ID
//                                       </Typography>
//                                     </Stack>
//                                   </CopyToClipboard>
//                                 </Stack>
//                               </TableCell>
//                               <TableCell style={{ width: '40%' }}>{item.name}</TableCell>
//                               <TableCell>
//                                 <FormControl sx={{ minWidth: 100 }}>
//                                   <Select
//                                     size="small"
//                                     value={!item.isBlocked}
//                                     onChange={(e) => handleStatusChange(e, item, id)}
//                                   >
//                                     <MenuItem value="true">Active</MenuItem>
//                                     <MenuItem value="false">Blocked</MenuItem>
//                                   </Select>
//                                   {selectedIndex === id && <Popup item={item} handleClose={handleClose} />}
//                                 </FormControl>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </Stack>
//                 </Scrollbar>
//               </Box>
//             </Card>
//           </Container>
//         </>
//       )}
//     </Page>
//   );
// }

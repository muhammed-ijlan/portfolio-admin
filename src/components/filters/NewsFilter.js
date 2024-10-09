import { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import { Formik, Form } from 'formik';
import { IconButton, TextField, Typography, Button, Stack, Box, MenuItem } from '@mui/material';
import Iconify from '../Iconify';

const Filter = ({ toggleFilter, applyFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);

  const getcategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/news-category`);
      console.log('categories', res);
      setCategories(res.data.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getcategories();
  }, []);

  return (
    <>
      <div>
        <Box style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={handleClick}>
            <Iconify icon="ic:round-filter-list" />
            <Typography variant="h6"> Filter</Typography>
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Formik
              initialValues={{
                newsId: '',
                category: '',
                startDate: '',
                endDate: '',
                isBlocked: '',
              }}
              onSubmit={async (values) => {
                applyFilters(values);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Form style={{ padding: '10px' }}>
                  <Stack
                    spacing={1.5}
                    direction="column"
                    sx={{ minWidth: { lg: '400px', md: '400px', sm: '400px', xl: '400px' } }}
                  >
                    <Stack spacing={1} direction={{ lg: 'row', xl: 'row', md: 'row', sm: 'row', xs: 'column' }}>
                      <TextField
                        fullWidth
                        id="newsId"
                        name="newsId"
                        label="News ID"
                        value={values.newsId}
                        onChange={handleChange}
                      />
                      <TextField
                        type="text"
                        select
                        id="isBlocked"
                        name="isBlocked"
                        label="Status"
                        sx={{ width: '200px' }}
                        onChange={handleChange}
                      >
                        <MenuItem value="false">ACTIVE</MenuItem>
                        <MenuItem value="true">BLOCKED</MenuItem>
                      </TextField>
                    </Stack>
                    <TextField
                      type="text"
                      select
                      id="category"
                      name="category"
                      label="Category"
                      fullWidth
                      sx={{ width: '100%' }}
                      onChange={handleChange}
                    >
                      {categories?.map((item, key) => {
                        return (
                          <MenuItem key={key} value={item?._id}>
                            {item?.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <Stack direction={'row'} spacing={2} alignItems="center">
                      <TextField
                        type="date"
                        name="startDate"
                        label="Start Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={values.startDate}
                        onChange={handleChange}
                      />
                      <p style={{ paddingTop: '15px' }}>to</p>
                      <TextField
                        type="date"
                        name="endDate"
                        fullWidth
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={values.endDate}
                        onChange={handleChange}
                      />
                    </Stack>

                    <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>
                      Filter
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Menu>
        </Box>
      </div>
    </>
  );
};

export default Filter;

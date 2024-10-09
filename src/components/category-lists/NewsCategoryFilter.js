import { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import { Formik, Form } from 'formik';
import { IconButton, TextField, Typography, Button, Stack, Box, MenuItem } from '@mui/material';
import Iconify from '../Iconify';

const Filter = ({ toggleFilter, applyFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                id: '',
                name: '',
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
                        id="id"
                        name="id"
                        label="Category ID"
                        value={values.id}
                        onChange={handleChange}
                      />
                      <TextField
                        sx={{ width: '170px' }}
                        select
                        id="isBlocked"
                        name="isBlocked"
                        label="Status"
                        value={values.isBlocked}
                        onChange={handleChange}
                      >
                        <MenuItem value="ALL">ALL</MenuItem>
                        <MenuItem value="false">ACTIVE</MenuItem>
                        <MenuItem value="true">BLOCKED</MenuItem>
                      </TextField>
                    </Stack>
                    <Stack spacing={1} direction={{ lg: 'row', xl: 'row', md: 'row', sm: 'row', xs: 'column' }}>
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Name"
                        value={values.name}
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

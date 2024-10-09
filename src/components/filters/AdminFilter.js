import * as React from 'react';
import Menu from '@mui/material/Menu';
import { Formik, Form } from 'formik';
import { IconButton, TextField, Typography, Button, Stack, Box, MenuItem } from '@mui/material';
import Iconify from '../Iconify';

const Filter = ({ toggleFilter, applyFilters }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
                fullname: '',
                email: '',
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
                  <Stack direction="column">
                    <Stack direction="row" spacing={1}>
                   
                           <TextField
                        style={{ paddingBottom: '10px' }}
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        style={{ paddingBottom: '10px' }}
                        fullWidth
                        id="fullname"
                        fullname="fullname"
                        label="Fullname"
                        value={values.fullname}
                        onChange={handleChange}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                    <TextField
                        style={{ paddingBottom: '10px' }}
                        id="id"
                        name="id"
                        label="Admin ID"
                        fullWidth
                        value={values.id}
                        onChange={handleChange}
                      />
                      <TextField
                        select
                        style={{ paddingBottom: '10px' }}
                        fullWidth
                        id="isBlocked"
                        name="isBlocked"
                        label="Status"
                        value={values.isBlocked}
                        onChange={handleChange}
                      >
                        <MenuItem value="false">ACTIVE</MenuItem>
                        <MenuItem value="true">BLOCKED</MenuItem>
                      </TextField>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
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

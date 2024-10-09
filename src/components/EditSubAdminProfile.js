import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function EditSubAdminProfile({ profile,setEditMode,getProfile, setImage}) {
  const formik = useFormik({
    initialValues: {
      id: profile?._id || '',
    },
    onSubmit: async () => {
      try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/admin/update/sub-admin`, values,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast(res.data.message);
        localStorage.setItem('profile', JSON.stringify(res.data.data));
        window.location.reload();
        setEditMode(false);
        getProfile()
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    },
  });



  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

  useEffect(()=>{
    if(values.profilePic){
      setImage(URL.createObjectURL(values.profilePic))
    }
  },[values.profilePic])

 

  return (
    <Grid item xs={12} sm={6} md={7} lg={8} padding={2}>
    <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{  height: '100%' }}
        marginLeft={2}
      >
        {/* <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          margin={1}
          sx={{ width: '100%' }}
        >
          <Typography variant="h4" gutterBottom>
            EDIT ACCOUNT
          </Typography>
        </Stack> */}

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  size="small"
                  label="Full Name"
                  fullWidth
                  sx={{ width: '100%' }}
                  {...getFieldProps('fullname')}
                  error={Boolean(touched.fullname && errors.fullname)}
                  helperText={touched.fullname && errors.fullname}
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  size="small"
                  label="Password"
                  fullWidth
                  sx={{ width: '100%' }}
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid> */}
              <Grid item xs={12}>
                <Stack direction="row" sx={{ width: '100%' }} spacing={2} justifyContent="space-between">
                  <TextField
                    type="file"
                    size="small"
                    label="Profile Picture"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: 'image/jpeg, image/jpg, image/png' }}
                    name="profilePic"
                    onChange={(event) => formik.setFieldValue('profilePic', event.target.files[0])}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setEditMode(false);
                      setImage(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Submit
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Stack>
    </Grid>
  )
}

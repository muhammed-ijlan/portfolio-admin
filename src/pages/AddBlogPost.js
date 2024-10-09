import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FilePond, File, registerPlugin } from 'react-filepond';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

/// file pond //
import 'filepond/dist/filepond.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

/// editor //
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Page from '../components/Page';
import Iconify from '../components/Iconify';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function AddBlogPost() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [descriptionError, setDescriptionError] = useState(false);
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryaddButton, setCategoryaddButton] = useState(false);

  const getcategories = async (options) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/blog-category/active`);
      console.log('categories', res);
      setCategories(res.data.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const blogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().required('Description is required').min(9, 'Description is required'),
    readingTime: Yup.number().min(1).required('Reading Time is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      description: '',
      readingTime: '',
      shortDescription: '',
    },
    validationSchema: blogSchema,
    onSubmit: async () => {
      const data = new FormData();
      data.append('title', values.title);
      data.append('category', values.category);
      data.append('description', values.description);
      data.append('readingTime', values.readingTime);
      data.append('shortDescription', values.shortDescription);
      files.forEach((item) => {
        data.append('images', item.file);
      });
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/blog/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast(res.data.message);
        navigate('/dashboard/blog');
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    },
  });

  const addNewCategory = async () => {
    setCategoryaddButton(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/blog-category/`, { name: category });
      getcategories();
      toast(res.data.message);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setCategoryaddButton(false);
    }
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const openAddCategoryModal = () => {
    setOpen(true);
  };

  const closeAddCategoryModal = () => {
    setOpen(false);
    toast();
  };

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, resetForm } = formik;

  useEffect(() => {
    const images = [];
    files.forEach((item) => {
      images.push(item.file);
    });
    formik.setFieldValue('images', images);
  }, [files]);

  useEffect(() => {
    getcategories();
  }, []);

  useEffect(() => {
    const editorData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    formik.setFieldValue('description', editorData);
    if (editorData.length > 8) {
      formik.setFieldError('description', null);
    } else {
      formik.setFieldError('description', 'Required');
    }
  }, [editorState]);

  return (
    <Page title="Add Blog">
      <Container maxWidth="xl">
        {/* Add Category Dialog */}
        <Dialog open={open}>
          <DialogTitle>Add Category</DialogTitle>
          <Grid container paddingBottom={'10px'} Width="500px">
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
                <Button type="submit" onClick={addNewCategory} disabled={!category.length || categoryaddButton}>
                  Add Category
                </Button>
              </Stack>
            </DialogContent>
          </Grid>
        </Dialog>
        {/* Add Category dialog end */}

        <Card
          sx={{
            boxShadow: '#6E8AEE 0px 1px 4px',
            borderRadius: '10px',
          }}
        >
          <Stack direction={'row'} justifyContent="space-between" padding={1}>
            <Typography variant="h4"> Add Blog</Typography>
            <Iconify style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => navigate(-1)} icon="fe:close" />
          </Stack>
          <Box sx={{ paddingX: 1, paddingY: 2 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      label="Blog Title"
                      fullWidth
                      sx={{ width: '100%' }}
                      {...getFieldProps('title')}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12} lg={10} md={12}>
                    <TextField
                      type="text"
                      select
                      label="Category"
                      fullWidth
                      sx={{ width: '100%' }}
                      {...getFieldProps('category')}
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && errors.category}
                    >
                      {categories?.map((item, key) => {
                        return (
                          <MenuItem key={key} value={item?._id}>
                            {item?.name}
                          </MenuItem>
                        );
                      })}
                      <MenuItem onClick={openAddCategoryModal}>
                        <Stack sx={{ width: '100%' }} direction="row" justifyContent={'space-between'}>
                          <Typography color={'#2065D1'}>ADD NEW CATEGORY</Typography>
                        </Stack>
                        <Iconify style={{ color: '#2065D1', fontSize: '24px' }} icon="fluent:add-circle-24-regular" />
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6} lg={2} md={4} sm={4}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      label="Reading Time"
                      fullWidth
                      placeholder="Minutes"
                      sx={{ width: '100%' }}
                      {...getFieldProps('readingTime')}
                      error={Boolean(touched.readingTime && errors.readingTime)}
                      helperText={touched.readingTime && errors.readingTime}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      multiline
                      label="Short Description"
                      fullWidth
                      sx={{ width: '100%' }}
                      {...getFieldProps('shortDescription')}
                      error={Boolean(touched.shortDescription && errors.shortDescription)}
                      helperText={touched.shortDescription && errors.shortDescription}
                    />
                  </Grid>
                  <Grid item xs={12} direction="column">
                    <Typography variant="h6">Description</Typography>
                    <Box sx={{ minHeight: '200px', border: 'solid 1px #e6e6e6', borderRadius: '10px' }} padding={1}>
                      <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                        onBlur={() => setDescriptionError(true)}
                      />
                    </Box>
                    {errors.description && descriptionError && (
                      <Stack direction="row" sx={{ width: '100%' }} justifyContent="flex-end">
                        <Typography variant="caption" color="red">
                          Description is required
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles}
                      allowMultiple
                      maxFiles={10}
                      credits={false}
                      // server="/api"
                      name="files"
                      labelIdle="Drag & Drop images"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" sx={{ width: '100%' }} justifyContent="flex-end">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      onClick={() => setDescriptionError(true)}
                      loading={isSubmitting}
                    >
                      Submit
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Form>
            </FormikProvider>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

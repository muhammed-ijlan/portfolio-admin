import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  CircularProgress,
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
import { FilePond, registerPlugin } from 'react-filepond';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import 'filepond/dist/filepond.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Iconify from '../components/Iconify';
import Page from '../components/Page';

registerPlugin(FilePondPluginImagePreview);

export default function AddProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the project details


  // Validation schema
  const projectSchema = Yup.object().shape({
    projectName: Yup.string().required('Project name is required'),
    projectLink: Yup.string().required('Project link is required'),
    isPopular: Yup.boolean().required('Please select popularity status'),
    isBlocked: Yup.boolean().required('Please select blocked status'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      projectName: project?.projectName || '',
      projectLink: project?.projectLink || '',
      isBlocked: project?.isBlocked || false,
      isPopular: project?.isPopular || false,
    },
    enableReinitialize: true,
    validationSchema: projectSchema,
    onSubmit: async (values) => {
      const data = new FormData();
      data.append('projectName', values.projectName);
      data.append('projectLink', values.projectLink);
      data.append('isBlocked', values.isBlocked);
      data.append('isPopular', values.isPopular);
      data.append('projectId', id);
      files.forEach((item) => {
        data.append('images', item.file);
      });
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/project/create`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        if (res?.data) {
          toast.success(res?.data?.message);
        }
        setFiles([]);
        navigate("/dashboard/projects")
      } catch (error) {

        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    },
  });


  return (
    <Page title="View Project">
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
            <Card
              sx={{
                boxShadow: '#6E8AEE 0px 1px 4px',
                borderRadius: '10px',
              }}
            >
              <Stack direction={'row'} justifyContent="space-between" alignItems={'center'} padding={1}>
                <Typography variant="h4"> Edit Project</Typography>
                <Button onClick={() => navigate(-1)}>Close</Button>
              </Stack>
              <Box sx={{ paddingX: 1, paddingY: 2 }}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          type="text"
                          label="Project Name"
                          fullWidth
                          {...formik.getFieldProps('projectName')}
                          error={Boolean(formik.touched.projectName && formik.errors.projectName)}
                          helperText={formik.touched.projectName && formik.errors.projectName}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          type="text"
                          label="Project Link"
                          fullWidth
                          {...formik.getFieldProps('projectLink')}
                          error={Boolean(formik.touched.projectLink && formik.errors.projectLink)}
                          helperText={formik.touched.projectLink && formik.errors.projectLink}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField

                          select
                          label="Is Popular?"
                          fullWidth
                          {...formik.getFieldProps('isPopular')}
                          error={Boolean(formik.touched.isPopular && formik.errors.isPopular)}
                          helperText={formik.touched.isPopular && formik.errors.isPopular}
                        >
                          <MenuItem value={'true'}>Yes</MenuItem>
                          <MenuItem value={'false'}>No</MenuItem>
                        </TextField>
                      </Grid>

                      <Grid item xs={6}>
                        <TextField

                          select
                          label="Is Blocked?"
                          fullWidth
                          {...formik.getFieldProps('isBlocked')}
                          error={Boolean(formik.touched.isBlocked && formik.errors.isBlocked)}
                          helperText={formik.touched.isBlocked && formik.errors.isBlocked}
                        >
                          <MenuItem value={'true'}>Yes</MenuItem>
                          <MenuItem value={'false'}>No</MenuItem>
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" paddingBottom={1}>
                          Images
                        </Typography>
                        <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          {project.images?.map((item, index) => (
                            <Box key={index}>
                              <img src={item} alt="project images" height="150px" style={{ margin: '5px' }} />
                            </Box>
                          ))}
                        </Box>
                        <FilePond
                          files={files}
                          onupdatefiles={setFiles}
                          allowMultiple
                          maxFiles={10}
                          name="files"
                          labelIdle="Drag & Drop images"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                          <LoadingButton variant="contained" type="submit" loading={formik.isSubmitting}>
                            Submit
                          </LoadingButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Form>
                </FormikProvider>
              </Box>
            </Card>
          </Container>
        </>
      )}
    </Page>
  );
}

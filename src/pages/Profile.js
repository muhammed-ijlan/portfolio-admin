import { Edit } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../components/Page';
import EditProfile from '../components/EditProfile';
import EditSubAdminProfile from '../components/EditSubAdminProfile';

export default function ViewAdmin() {
  const { id } = useParams();
  const [profile, setProfile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [image, setImage] = React.useState(null);

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/profile`, {
        params: {
          id,
        },
      });
      setProfile(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  return (
    <Page title="Admin">
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Container maxWidth="xl" sx={{ marginTop: '50px' }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Grid
              container
              sx={{
                width: {
                  xs: '100%',
                  md: '85%',
                  lg: '85%',
                  xl: '80%',
                },
                borderRadius: '10px',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
              }}
            >
              <Grid item xs={12} sm={6} md={5} lg={4} padding={2}>
                <Box
                  component="img"
                  height="250px"
                  width="250px"
                  sx={{
                    objectFit: 'contain',
                  }}
                  src={
                    image ||
                    (profile?.profilePic && process.env.REACT_APP_API_URL + profile?.profilePic) ||
                    '/static/mock-images/avatars/avatar2.png'
                  }
                  alt="profile pic"
                />
              </Grid>
              {!editMode && (
                <Grid item xs={12} sm={6} md={7} lg={8} padding={2}>
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="start"
                    sx={{ width: '100%', height: '100%' }}
                    marginLeft={2}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      margin={1}
                      sx={{ width: '100%' }}
                    >
                      <Typography variant="h4" gutterBottom>
                        ACCOUNT DETAILS
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" margin={1} sx={{ width: '100%' }}>
                      <Stack flex={1} justifyContent={'start'} alignItems="start">
                        <Typography>Name:</Typography>
                      </Stack>
                      <Stack flex={3} justifyContent={'start'} alignItems="start">
                        <Typography sx={{ fontWeight: 'bold' }}>{profile?.fullname.toUpperCase()}</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" margin={1} sx={{ width: '100%' }}>
                      <Stack flex={1} justifyContent={'start'} alignItems="start">
                        <Typography>Email:</Typography>
                      </Stack>
                      <Stack flex={3} justifyContent={'start'} alignItems="start">
                        <Typography sx={{ fontWeight: 'bold' }}>{profile?.email}</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" margin={1} sx={{ width: '100%' }}>
                      <Stack flex={1} justifyContent={'start'} alignItems="start">
                        <Typography>Account Type:</Typography>
                      </Stack>
                      <Stack flex={3} justifyContent={'start'} alignItems="start">
                        <Typography sx={{ fontWeight: 'bold' }}>{profile?.accType?.replaceAll('_', ' ')}</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" margin={1} sx={{ width: '100%' }}>
                      <Stack flex={1} justifyContent={'start'} alignItems="start">
                        <Typography>Member Since:</Typography>
                      </Stack>
                      <Stack flex={3} justifyContent={'start'} alignItems="start">
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {moment(profile.createdAt).format('MMM DD, YYYY')}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent={'flex-end'} sx={{ width: '100%' }}>
                      <Button sx={{ marginX: '20px' }} onClick={() => setEditMode(true)}>
                        Edit
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              )}

              {editMode && profile.accType === 'ADMIN' && (
                <EditProfile profile={profile} setEditMode={setEditMode} getProfile={getProfile} setImage={setImage} />
              )}

            </Grid>
          </Box>
        </Container>
      )}
    </Page>
  );
}

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    // backgroundColor: '#F5FEFF',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // backgroundColor: '#F5F1EF',
  alignItems: 'center',
  boxShadow: 'rgba(48, 74, 169, 0.2) 5px 5px 50px',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  // alignItems: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');



  return (
    <Page title="Login">
      <RootStyle>
        {/*    <HeaderStyle>
          {mdUp&&<Logo />} */}

        {/* {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )} */}
        {/* </HeaderStyle> */}

        {mdUp && (
          <SectionStyle>
            <Logo sx={{ mb: 3, height: '80px', width: '235px' }} />
            {/* randomly set image from images */}
            <Box
              component="img"
              src="/static/illustrations/banner_login.png"
              alt="login"
              sx={{
                width: '80%',
                height: '50%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
            <Typography variant="h3" sx={{
              mt: 4, mb: 4,
              // color: '#6F0A0A',
              fontFamily: 'Roboto'
            }}>
              Hi, Welcome Back
            </Typography>
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography
              gutterBottom
              textAlign="center"
              sx={{
                width: '100%',
                //  color: '#4f0606',
                fontSize: '24px', fontFamily: 'Roboto', fontWeight: 500
              }}
            >
              Sign in to MAQLINK
            </Typography>

            <Typography sx={{
              // color: '#ac2424',
              mb: 5, width: '100%'
            }} textAlign="center">
              Enter your details below
            </Typography>

            {/* <AuthSocial /> */}

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

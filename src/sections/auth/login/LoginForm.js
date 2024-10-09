import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// form
import { useFormik, Form, FormikProvider } from 'formik';
// @mui
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  styled,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root ': {
    borderRadius: 2,
    boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.15)',
    fontFamily: 'Roboto',
  },
});

const CssButton = styled(LoadingButton)({
  '&.MuiButtonBase-root': {
    borderRadius: '3px',
    boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.15)',
    fontFamily: 'Roboto',
    '&:hover': {
      boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.15)',
    },
  },
});

export default function LoginForm() {
  const navigate = useNavigate();
  const uninterceptedAxiosInstance = axios.create();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      try {
        const res = await uninterceptedAxiosInstance.post(`${process.env.REACT_APP_API_URL}/auth/member/login`, values);
        if (res.data.isError) {
          console.log(res.data.message);
          toast.error(res.data.message);
        } else {
          localStorage.setItem('accessToken', res.data.data.token);
          localStorage.setItem('profile', JSON.stringify(res.data.data));
          navigate('/dashboard/app', { replace: true });
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} mb={4}>
          <CssTextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <CssTextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          /> */}

          {/* <Typography
            sx={{ fontSize: '18px', cursor: 'pointer', color:"#07ADBB" }}
            onClick={() => setForgotPass(true)}
          >
            Forgot password?
          </Typography> */}
        </Stack>

        <CssButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Log In
        </CssButton>
      </Form>
    </FormikProvider>
  );
}

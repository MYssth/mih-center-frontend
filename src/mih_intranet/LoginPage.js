import { Helmet } from 'react-helmet-async';
import imageToBase64 from 'image-to-base64/browser';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const headSname = `${localStorage.getItem('sname')} Center`;

const logo = `data:image/jpeg;base64,${imageToBase64(`${process.env.PUBLIC_URL}/logo.png`)}`;
export default function LoginPage() {
  // const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> เข้าสู่ระบบ | MIH Center </title>
      </Helmet>

      <StyledRoot>
        {/* {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )} */}

        <Container maxWidth="sm">
          <StyledContent >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 1,
                m: 1,
                mb: 5,
              }}
            >
              <img src={`${process.env.PUBLIC_URL}/logo.png`} width="300" alt="logo" />
            </Box>
            <Typography variant="h4" gutterBottom>
              เข้าสู่ระบบ MIH Center
            </Typography>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

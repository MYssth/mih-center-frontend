import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token !== null) {
      fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_loginPort}/api/authen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'ok') {
            // alert('complete');
            // navigate('/dashboard', { replace: true });
          }
          else {
            alert('กรุณาเข้าสู่ระบบ');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });

          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('authen failed');
          navigate('/login', { replace: true });
        });
    }
    else {
      navigate('/login', { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}

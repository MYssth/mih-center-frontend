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
    // fetch(`http://${process.env.host}:${process.env.loginPort}/api/authen`, {
    fetch(`http://localhost:5000/api/authen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          // alert('authen success');
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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// ----------------------------------------------------------------------

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/getsitesetting`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     localStorage.setItem('logo', data.logo);
    //     localStorage.setItem('sname', data.sname);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

    const token = localStorage.getItem('token');
    if (token !== null) {
      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_loginPort}/authen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== 'ok') {
            // alert('กรุณาเข้าสู่ระบบ');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(`authen failed : ${error}`);
          navigate('/login', { replace: true });
        });
    } else {
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

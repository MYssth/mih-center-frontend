import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {

    const jsonData = {
      personnel_id: document.getElementById("username").value,
      personnel_secret: document.getElementById("password").value,
    };

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_loginPort}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.status === 'ok') {
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('reloadCount', String(1));
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleKeypress = e => {
    // it triggers by pressing the enter key
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Stack spacing={3}>

        <TextField id="username" name="username" label="รหัสพนักงาน" onKeyPress={handleKeypress} />

        <TextField
          id="password"
          name="password"
          label="รหัสผ่านเริ่มต้นคือวันเดือนปีเกิด(พ.ศ.) เช่น 18ม.ค.2566 = 18012566"
          type={showPassword ? 'text' : 'password'}
          onKeyPress={handleKeypress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit} onKeyPress={handleKeypress}>
          Login
        </LoadingButton>
      </Stack>

    </>
  );
}

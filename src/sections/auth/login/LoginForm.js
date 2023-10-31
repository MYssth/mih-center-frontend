import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showChgPwd, setShowChgPwd] = useState(false);
  const [pwdBtn, setPwdBtn] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const [message, setMessage] = useState('');

  const location = useLocation();

  const handleSubmit = () => {
    const jsonData = {
      psn_id: document.getElementById('username').value,
      psn_secret: document.getElementById('password').value,
    };

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_loginPort}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === 'ok') {
          localStorage.setItem('token', data.token);

          if (location.state?.from) {
            navigate(location.state.from.pathname === '/login' ? '/intranet' : location.state.from.pathname, {
              replace: true,
            });
          } else {
            navigate('/intranet', { replace: true });
          }
        } else if (data.status === 'expire') {
          setAuthToken(data.token);
          setPwdBtn(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePwdChg = () => {
    const jsonData = {
      psn_id: document.getElementById('username').value,
      psn_secret: document.getElementById('password').value,
    };

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_loginPort}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === 'ok' || data.status === 'expire') {
          setAuthToken(data.token);
          setPwdBtn(true);
          setMessage('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePwdChgSubmit = () => {
    if (document.getElementById('newPwd').value !== document.getElementById('newPwdC').value) {
      setMessage('รหัสผ่านใหม่กับยืนยันรหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    if (String(document.getElementById('newPwd').value).length < 8) {
      setMessage('รหัสผ่านใหม่ต้องมี 8 ตัวขึ้นไป');
      return;
    }

    if (!/[A-Z]/.test(document.getElementById('newPwd').value)) {
      setMessage('รหัสผ่านใหม่ต้องมีภาษาอังกฤษตัวพิมพ์ใหญ่');
      return;
    }

    if (!/[a-z]/.test(document.getElementById('newPwd').value)) {
      setMessage('รหัสผ่านใหม่ต้องมีภาษาอังกฤษตัวพิมพ์เล็ก');
      return;
    }

    if (!/[0-9]/.test(document.getElementById('newPwd').value)) {
      setMessage('รหัสผ่านใหม่ต้องมีตัวเลข');
      return;
    }

    const jsonData = {
      psn_id: document.getElementById('username').value,
      psn_secret: document.getElementById('newPwd').value,
    };
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_loginPort}/secretchg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === 'ok') {
          document.getElementById('password').value = '';
          document.getElementById('newPwd').value = '';
          document.getElementById('newPwdC').value = '';
          setPwdBtn(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePwdChgCancel = () => {
    setMessage('');
    document.getElementById('password').value = '';
    document.getElementById('newPwd').value = '';
    document.getElementById('newPwdC').value = '';
    setPwdBtn(false);
  };

  const handleKeypress = (e) => {
    // it triggers by pressing the enter key
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <TextField id="username" name="username" label="รหัสพนักงาน" onKeyPress={handleKeypress} disabled={pwdBtn} />

        <TextField
          id="password"
          name="password"
          label="รหัสผ่านเริ่มต้นคือวันเดือนปีเกิด(พ.ศ.) เช่น 18ม.ค.2566 = 18012566"
          type={showPassword ? 'text' : 'password'}
          onKeyPress={handleKeypress}
          disabled={pwdBtn}
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
        {pwdBtn ? (
          <>
            <Typography align="center" sx={{ mt: 1 }}>
              รหัสผ่านต้องมี 8 ตัวขึ้นไป
              <br />
              ประกอบไปด้วยภาษาอังกฤษตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                id="newPwd"
                name="newPwd"
                label="รหัสผ่านใหม่"
                type={showChgPwd ? 'text' : 'password'}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">
                //       <IconButton onClick={() => setShowChgPwd(!showChgPwd)} edge="end">
                //         <Iconify icon={showChgPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
              />
              <TextField
                fullWidth
                id="newPwdC"
                name="newPwdC"
                label="ยืนยันรหัสผ่านใหม่"
                type={showChgPwd ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowChgPwd(!showChgPwd)} edge="end">
                        <Iconify icon={showChgPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </>
        ) : (
          ''
        )}
      </Stack>

      {message !== '' ? (
        <Typography color="red" align="center" sx={{ mt: 1 }}>
          {message}
        </Typography>
      ) : (
        ''
      )}

      <Stack spacing={1} alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
        {pwdBtn ? (
          <>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handlePwdChgSubmit}>
              ยืนยันการเปลี่ยนรหัสผ่านใหม่
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="outlined"
              onClick={handlePwdChgCancel}
              color="error"
            >
              ยกเลิก
            </LoadingButton>
          </>
        ) : (
          <>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              onKeyPress={handleKeypress}
            >
              เข้าสู่ระบบ
            </LoadingButton>
            <LoadingButton fullWidth size="large" type="submit" variant="outlined" onClick={handlePwdChg}>
              เปลี่ยนรหัสผ่าน
            </LoadingButton>
          </>
        )}
      </Stack>
    </>
  );
}

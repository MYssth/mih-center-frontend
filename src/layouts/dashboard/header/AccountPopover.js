import jwtDecode from "jwt-decode";
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'กลับไปหน้าหลัก',
    icon: 'eva:home-fill',
  },
  {
    label: 'ตั้งค่าบัญชี',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [tokenData, setTokenData] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {

      const token = localStorage.getItem('token');
      setTokenData(jwtDecode(token));
    }, []);

    const handleOpen = (event) => {
      setOpen(event.currentTarget);
    };

    const handleClose = () => {
      setOpen(null);
    };

    const handleBack = () => {
      navigate('/dashboard', { replace: true });
    };

    const handleSetting = () => {
      navigate('/profilesetting', { replace: true });
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    };

    return (
      <>
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
          {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
          <Icon icon="ic:baseline-settings" width="40" height="40" />
        </IconButton>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 0,
              mt: 1.5,
              ml: 0.75,
              width: 180,
              '& .MuiMenuItem-root': {
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {tokenData.personnel_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {tokenData.personnel_id}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack sx={{ p: 1 }}>
            {/* {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleMenu(option.label)}>
              {option.label}
            </MenuItem>
          ))} */}
            <MenuItem onClick={handleBack}>
              กลับไปหน้าหลัก
            </MenuItem>
            <MenuItem onClick={handleSetting}>
              ตั้งค่าบัญชี
            </MenuItem>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
            ออกจากระบบ
          </MenuItem>
        </Popover>
      </>
    );
}

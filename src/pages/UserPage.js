import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  IconButton,
  styled,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
// components
import { Icon } from '@iconify/react';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [personnelId, setPersonnelId] = useState('');
  const [personnelIsactive, setPersonnelIsactive] = useState('');

  const navigate = useNavigate();

  const columns = [
    {
      field: 'id',
      headerName: 'เลขที่',
      width: 50,
    },
    {
      field: 'personnel_id',
      headerName: 'รหัสพนักงาน',
      width: 100,
    },
    {
      field: 'personnel_firstname',
      headerName: 'ชื่อ-นามสกุล',
      width: 200,
      valueGetter: (params) =>
        `${(params.row.personnel_firstname)} ${(params.row.personnel_lastname)}`,
    },
    {
      field: 'position_name',
      headerName: 'ตำแหน่ง',
      width: 200,
    },
    {
      field: 'department_name',
      headerName: 'แผนก',
      width: 150
    },
    {
      field: 'faction_name',
      headerName: 'ฝ่าย',
      width: 150
    },
    {
      field: 'field_name',
      headerName: 'สายงาน',
      width: 150
    },
    {
      field: 'personnel_isactive',
      headerName: 'สถานะ',
      width: 100,
      valueGetter: (params) =>
        `${params.row.personnel_isactive === true ? "Active" : "Deactive"}`,
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      renderCell: (params) => {
        const onClick = (e) => {
          // e.stopPropagation(); // don't select this row after clicking
          // alert(`you choose ID = ${params.row.personnel_id}`);
          setPersonnelId(params.row.personnel_id);
          setPersonnelIsactive(params.row.personnel_isactive);
          setOpen(e.currentTarget);
        };

        return <IconButton size="large" color="inherit" onClick={onClick}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>;
      },
    }
  ];

  useEffect(() => {

    // fetch(`http://${process.env.host}:${process.env.psnDataDistPort}/api/getpersonnel`)
    fetch(`http://localhost:5001/api/getpersonnel`)
      .then((response) => response.json())
      .then((data) => {
        setPersonnel(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);

  const handleNewUser = () => {
    navigate('/dashboard/newuser', { replace: true });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseStatusDialog = () => {
    setPersonnelId('');
    setPersonnelIsactive('');
    setStatusDialogOpen(false);
  };

  const handleStatus = () => {
    // RESUME HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  };

  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title> จัดการผู้ใช้ | MIH Center </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            จัดการผู้ใช้
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewUser}>
            เพิ่มผู้ใช้ใหม่
          </Button>
        </Stack>

        <Card>

          <Scrollbar>

            <div style={{ width: '100%' }}>
              <StripedDataGrid
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                autoHeight
                getRowHeight={() => 'auto'}
                columns={columns}
                rows={personnel}
                components={{
                  Toolbar: GridToolbar,
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns status and traderName, the other columns will remain visible
                      id: false,
                    },
                  },
                }}
                componentsProps={{ toolbar: { printOptions: { hideFooter: true, hideToolbar: true, }, csvOptions: { utf8WithBom: true, } } }}
              />
            </div>

          </Scrollbar>
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
        <Icon icon="ic:sharp-mode-edit" width="20" height="20" />
        <Typography sx={{ ml: 1 }}>แก้ไขข้อมูล</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>
        <Icon icon="ic:baseline-check-circle" width="20" height="20" />
        <Typography sx={{ ml: 1 }}>ตั้งค่าสถานะ</Typography>
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
        <Icon icon="ic:baseline-delete-forever" width="20" height="20" />
        <Typography sx={{ ml: 1 }}>ลบชื่อผู้ใช้</Typography>
        </MenuItem>
      </Popover>

      {/* ==================================ตั้งค่าสถานะ============================================= */}
      <Dialog fullWidth maxWidth="md" open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>ตั้งค่าสถานะ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาเลือกสถานะ
          </DialogContentText>
          <Autocomplete 
            value={personnelIsactive===true?"Active":"Deactive"}
            onChange={(event, newValue) => {
              console.log(personnelId);
              setPersonnelIsactive(newValue==="Active");
            }}
            options = {["Active","Deactive"]}
            renderInput={(params) => <TextField {...params} label="" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleStatus}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}

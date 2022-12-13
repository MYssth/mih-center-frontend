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
  const [psnDelDialogOpen, setPsnDelDialogOpen] = useState(false);
  const [personnelId, setPersonnelId] = useState('');
  const [personnelIsactive, setPersonnelIsactive] = useState('');
  const [pageSize, setPageSize] = useState(25);

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

    refreshTable();

  }, []);

  const refreshTable = () => {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpersonnel`)
      .then((response) => response.json())
      .then((data) => {
        setPersonnel(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleNewUser = () => {
    navigate('/dashboard/newuser', { replace: true });
  };

  const handleEditUser = () => {
    navigate('/dashboard/edituser', { replace: true, state: { personnel_id: personnelId, } });
  };

  const handleCloseMenu = () => {
    setPersonnelId('');
    setPersonnelIsactive('');
    setOpen(null);
  };

  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleOpenPsnDelDialog = () => {
    setPsnDelDialogOpen(true);
  };

  const handleClosePsnDelDialog = () => {
    setPsnDelDialogOpen(false);
  }

  const handleStatus = () => {
    const jsonData = {
      personnel_id: personnelId,
      personnel_isactive: personnelIsactive,
    };

    if (jsonData.personnel_isactive === "" || jsonData.personnel_isactive === null) {
      alert("กรุณาเลือกสถานะ");
      return;
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnCrudPort}/api/setpersonnelactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('เปลี่ยนแปลงสถานะสำเร็จ');
          handleCloseStatusDialog();
          handleCloseMenu();
          refreshTable();
        }
        else {
          alert('ไม่สามารถทำการเปลี่ยนแปลงสถานะได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ');
        handleCloseStatusDialog();
        handleCloseMenu();
        refreshTable();
      });
  };

  const handlePsnDel = () => {
    if (document.getElementById('personnel_id').value !== personnelId) {
      alert("รหัสพนักงานยืนยันการลบไม่ถูกต้องไม่สามารถลบชื่อผู้ใช้ได้");
      return;
    }
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnCrudPort}/api/deletepersonnel/${personnelId}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('ลบชื่อผู้ใช้สำเร็จ');
          handleClosePsnDelDialog();
          handleCloseMenu();
          refreshTable();
        }
        else {
          alert('ไม่สามารถทำการลบชื่อผู้ใช้ได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการลบชื่อผู้ใช้');
        handleClosePsnDelDialog();
        handleCloseMenu();
        refreshTable();
      });
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
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
        <MenuItem onClick={handleEditUser}>
          <Icon icon="ic:sharp-mode-edit" width="20" height="20" />
          <Typography sx={{ ml: 1 }}>แก้ไขข้อมูล</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>
          <Icon icon="ic:baseline-check-circle" width="20" height="20" />
          <Typography sx={{ ml: 1 }}>ตั้งค่าสถานะ</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenPsnDelDialog} sx={{ color: 'error.main' }}>
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
            value={personnelIsactive === true ? "Active" : "Deactive"}
            onChange={(event, newValue) => {
              console.log(personnelId);
              setPersonnelIsactive(newValue === "Active");
            }}
            options={["Active", "Deactive"]}
            renderInput={(params) => <TextField {...params} label="" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleStatus}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ==================================ลบชื่อผู้ใช้============================================= */}
      <Dialog fullWidth maxWidth="md" open={psnDelDialogOpen} onClose={handleClosePsnDelDialog}>
        <DialogTitle>ลบชื่อผู้ใช้</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณากรอกรหัสพนักงานที่เลือกเพื่อยืนยันการลบข้อมูล
          </DialogContentText>
          <TextField id="personnel_id" name="personnel_id" label="รหัสพนักงาน" />
          <DialogContentText sx={{ color: 'error.main' }}>
            *คำเตือน: หากลบชื่อผู้ใช้แล้วข้อมูลผู้ใช้จะหายไปอย่างถาวรไม่สามารถกู้คืนได้*
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePsnDelDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handlePsnDel}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}

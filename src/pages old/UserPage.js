/* eslint-disable no-unused-vars */
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
  Box,
  Checkbox,
  InputAdornment,
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
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
  },
});

const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [psnDelDialogOpen, setPsnDelDialogOpen] = useState(false);

  const [personnelId, setPersonnelId] = useState('');
  const [personnelSecret, setPersonnelSecret] = useState('');
  const [personnelInputSecret, setPersonnelInputSecret] = useState(null);
  const [personnelInputSecretConfirm, setPersonnelInputSecretConfirm] = useState(null);
  const [personnelFirstname, setPersonnelFirstname] = useState('');
  const [personnelLastname, setPersonnelLastname] = useState('');
  const [personnelIsactive, setPersonnelIsactive] = useState('');

  const [positionName, setPositionName] = useState('');
  const [positionId, setPositionId] = useState('');
  const [positions, setPositions] = useState([]);

  const [levels, setLevels] = useState([]);
  const [levelViews, setLevelViews] = useState([]);

  const [DMISLevelName, setDMISLevelName] = useState('');
  const [DMISLevelId, setDMISLevelId] = useState('');
  const [DMISLevelDescription, setDMISLevelDescription] = useState('');
  const [DMISLevelViewName, setDMISLevelViewName] = useState('');
  const [DMISLevelViewId, setDMISLevelViewId] = useState('');
  const [DMISLevelViewDescription, setDMISLevelViewDescription] = useState('');
  const [isDMIS, setIsDMIS] = useState(false);

  const [PMSLevelName, setPMSLevelName] = useState('');
  const [PMSLevelId, setPMSLevelId] = useState('');
  const [PMSLevelDescription, setPMSLevelDescription] = useState('');
  const [isPMS, setIsPMS] = useState(false);

  const [DSMSLevelName, setDSMSLevelName] = useState('');
  const [DSMSLevelId, setDSMSLevelId] = useState('');
  const [DSMSLevelDescription, setDSMSLevelDescription] = useState('');
  const [isDSMS, setIsDSMS] = useState(false);

  const [PSNLvViews, setPSNLvViews] = useState([]);

  const [CBSLevelName, setCBSLevelName] = useState('');
  const [CBSLevelId, setCBSLevelId] = useState('');
  const [CBSLevelDescription, setCBSLevelDescription] = useState('');
  const [CBSLvViewId, setCBSLvViewId] = useState('');
  const [CBSLvViewName, setCBSLvViewName] = useState('');
  const [CBSLvViewDescr, setCBSLvViewDescr] = useState('');

  const [isCBS, setIsCBS] = useState(false);

  const [pageSize, setPageSize] = useState(25);

  const navigate = useNavigate();
  const isSkip = (value) => value !== '';
  const [showSecret, setShowSecret] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
      valueGetter: (params) => `${params.row.personnel_firstname} ${params.row.personnel_lastname}`,
    },
    {
      field: 'position_name',
      headerName: 'ตำแหน่ง',
      width: 200,
    },
    {
      field: 'department_name',
      headerName: 'แผนก',
      width: 150,
    },
    {
      field: 'faction_name',
      headerName: 'ฝ่าย',
      width: 150,
    },
    {
      field: 'field_name',
      headerName: 'สายงาน',
      width: 150,
    },
    {
      field: 'personnel_isactive',
      headerName: 'สถานะ',
      width: 100,
      valueGetter: (params) => `${params.row.personnel_isactive === true ? 'Active' : 'Deactive'}`,
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
          setPersonnelSecret(params.row.personnel_secret);
          setPersonnelFirstname(params.row.personnel_firstname);
          setPersonnelLastname(params.row.personnel_lastname);
          setPersonnelIsactive(params.row.personnel_isactive);
          setPositionId(params.row.position_id);
          setPositionName(params.row.position_name);
          setOpen(e.currentTarget);
        };

        return (
          <IconButton size="large" color="inherit" onClick={onClick}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    refreshTable();

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getpositions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPositions(data.filter((dt) => dt.position_isactive));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLevels(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevelviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLevelViews(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlvviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPSNLvViews(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const refreshTable = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getpersonnel`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPersonnel(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleNewUser = () => {
    navigate('/dashboard/newuser', { replace: true });
  };

  const handleCloseMenu = () => {
    setOpen(null);

    setPersonnelId('');
    setPersonnelSecret('');
    setPersonnelInputSecret(null);
    setPersonnelInputSecretConfirm(null);
    setPersonnelFirstname('');
    setPersonnelLastname('');
    setPersonnelIsactive('');
    setPositionName('');
    setPositionId('');

    setDMISLevelId('');
    setDMISLevelName('');
    setDMISLevelDescription('');
    setDMISLevelViewId('');
    setDMISLevelViewName('');
    setDMISLevelViewDescription('');
    setIsDMIS(false);

    setPMSLevelId('');
    setPMSLevelName('');
    setPMSLevelDescription('');
    setIsPMS(false);

    setDSMSLevelId('');
    setDSMSLevelName('');
    setDSMSLevelDescription('');
    setIsDSMS(false);

    setCBSLevelId('');
    setCBSLevelName('');
    setCBSLevelDescription('');
    setIsCBS(false);

    setImageUrl(null);
  };

  const handleOpenEditDialog = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${personnelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== '') {
          setImageUrl(data.signature_data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevellist/${personnelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          if (data[i].mihapp_id === 'DMIS') {
            setDMISLevelId(data[i].level_id);
            setDMISLevelName(data[i].level_name);
            setDMISLevelDescription(data[i].level_description);
            setDMISLevelViewId(data[i].view_id);
            setDMISLevelViewName(data[i].view_name);
            setDMISLevelViewDescription(data[i].view_description);
            setIsDMIS(true);
          }
          if (data[i].mihapp_id === 'PMS') {
            setPMSLevelId(data[i].level_id);
            setPMSLevelName(data[i].level_name);
            setPMSLevelDescription(data[i].level_description);
            setIsPMS(true);
          }
          if (data[i].mihapp_id === 'DSMS') {
            setDSMSLevelId(data[i].level_id);
            setDSMSLevelName(data[i].level_name);
            setDSMSLevelDescription(data[i].level_description);
            setIsDSMS(true);
          }
          if (data[i].mihapp_id === 'CBS') {
            setCBSLevelId(data[i].level_id);
            setCBSLevelName(data[i].level_name);
            setCBSLevelDescription(data[i].level_description);
            setCBSLvViewId(data[i].view_id);
            setCBSLvViewName(data[i].view_name);
            setCBSLvViewDescr(data[i].view_description);
            setIsCBS(true);
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
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
  };

  const handleEdit = () => {
    const levelList = [];
    const viewList = [];

    if (isDMIS) {
      if (DMISLevelId === '') {
        alert('กรุณาเลือกหน้าที่ของระบบแจ้งซ่อม');
        return;
      }
      if (DMISLevelViewId === '') {
        alert('กรุณาเลือกระดับการมองเห็นของระบบแจ้งซ่อม');
        return;
      }
      levelList.push(DMISLevelId);
      viewList.push(DMISLevelViewId);
    }

    if (isPMS) {
      if (PMSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบจัดการข้อมูลบุคลากร');
        return;
      }
      levelList.push(PMSLevelId);
    }

    if (isDSMS) {
      if (DSMSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบจองเวรแพทย์');
        return;
      }
      levelList.push(DSMSLevelId);
    }

    if (isCBS) {
      if (CBSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบขอใช้รถ');
        return;
      }
      levelList.push(CBSLevelId);
    }

    let secret = personnelSecret;

    if (personnelInputSecret !== '' && personnelInputSecret !== null) {
      if (personnelInputSecret === personnelInputSecretConfirm) {
        secret = personnelInputSecret;
      } else {
        alert('กรุณากรอกรหัสผ่านให้ตรงกัน');
        return;
      }
    }

    const jsonData = {
      personnel_id: personnelId,
      personnel_secret: secret,
      personnel_firstname: personnelFirstname,
      personnel_lastname: personnelLastname,
      personnel_isactive: personnelIsactive,
      position_id: positionId,
      level_list: levelList,
      view_list: viewList,
      signature_data: selectedImage !== undefined && selectedImage !== null && selectedImage !== '' ? imageUrl : null,
    };

    if (
      jsonData.personnel_id === '' ||
      jsonData.personnel_secret === '' ||
      jsonData.personnel_firstname === '' ||
      jsonData.personnel_lastname === '' ||
      jsonData.position_id === ''
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // console.log(`personnel_id: ${jsonData.personnel_id}`);
    // console.log(`personnel_secret: ${jsonData.personnel_secret}`);
    // console.log(`personnel_firstname: ${jsonData.personnel_firstname}`);
    // console.log(`personnel_lastname: ${jsonData.personnel_lastname}`);
    // console.log(`personnel_isactive: ${jsonData.personnel_isactive}`);
    // console.log(`position_id: ${jsonData.position_id}`);
    // console.log(`level_list: ${jsonData.level_list}`);
    // console.log(`view_list: ${jsonData.view_list}`);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnCrudPort}/updatepersonnel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('แก้ไขข้อมูลผู้ใช้สำเร็จ กรุณาแจ้งให้ผู้ใช้ทำการเข้าสู่ระบบอีกครั้งเพื่อเปลี่ยนข้อมูล');
          handleCloseEditDialog();
          handleCloseMenu();
          refreshTable();
        } else {
          alert('ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
      });
  };

  const handleStatus = () => {
    const jsonData = {
      personnel_id: personnelId,
      personnel_isactive: personnelIsactive,
      position_id: positionId,
    };

    if (jsonData.personnel_isactive === '' || jsonData.personnel_isactive === null) {
      alert('กรุณาเลือกสถานะ');
      return;
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnCrudPort}/setpersonnelactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('เปลี่ยนแปลงสถานะสำเร็จ');
          handleCloseStatusDialog();
          handleCloseMenu();
          refreshTable();
        } else {
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
      alert('รหัสพนักงานยืนยันการลบไม่ถูกต้องไม่สามารถลบชื่อผู้ใช้ได้');
      return;
    }
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnCrudPort}/deletepersonnel/${personnelId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('ลบชื่อผู้ใช้สำเร็จ');
          handleClosePsnDelDialog();
          handleCloseMenu();
          refreshTable();
        } else {
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

  const handleChangeDMIS = (event) => {
    if (event.target.checked) {
      setIsDMIS(true);
    } else {
      setIsDMIS(false);
      setDMISLevelId('');
      setDMISLevelName('');
      setDMISLevelDescription('');
      setDMISLevelViewId('');
      setDMISLevelViewName('');
      setDMISLevelViewDescription('');
    }
  };

  const handleChangePMS = (event) => {
    if (event.target.checked) {
      setIsPMS(true);
    } else {
      setIsPMS(false);
      setPMSLevelId('');
      setPMSLevelName('');
      setPMSLevelDescription('');
    }
  };

  const handleChangeDSMS = (event) => {
    if (event.target.checked) {
      setIsDSMS(true);
    } else {
      setIsDSMS(false);
      setDSMSLevelId('');
      setDSMSLevelName('');
      setDSMSLevelDescription('');
    }
  };

  const handleChangeCBS = (event) => {
    if (event.target.checked) {
      setIsCBS(true);
    } else {
      setIsCBS(false);
      setCBSLevelId('');
      setCBSLevelName('');
      setCBSLevelDescription('');
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    if (e.target.files[0] === undefined) {
      setImageUrl('');
      return;
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <Helmet>
        <title> จัดการผู้ใช้ | {headSname} </title>
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
                getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
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
                componentsProps={{
                  toolbar: { printOptions: { hideFooter: true, hideToolbar: true }, csvOptions: { utf8WithBom: true } },
                }}
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
        <MenuItem onClick={handleOpenEditDialog}>
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

      {/* ================================แก้ไขข้อมูลผู้ใช้=========================================== */}
      <Dialog fullWidth maxWidth="md" open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <DialogContentText>ข้อมูลส่วนตัว</DialogContentText>
            <ValidationTextField
              required
              id="firstname"
              name="firstname"
              value={personnelFirstname === null ? '' : personnelFirstname}
              onChange={(event) => {
                setPersonnelFirstname(event.target.value);
              }}
              label="ชื่อ"
            />
            <ValidationTextField
              required
              id="lastname"
              name="lastname"
              value={personnelLastname === null ? '' : personnelLastname}
              onChange={(event) => {
                setPersonnelLastname(event.target.value);
              }}
              label="นามสกุล"
            />

            {/* <div>{`position id: ${position_id !== null ? `'${position_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              value={positionName}
              onChange={(event, newValue) => {
                setPositionName(newValue);
                if (newValue !== null) {
                  setPositionId(positions.find((o) => o.position_name === newValue).position_id);
                } else {
                  setPositionId('');
                }
              }}
              id="controllable-states-positions-id"
              options={Object.values(positions).map((option) => option.position_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ตำแหน่ง" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: positionName ? 'green' : 'red',
                  },
                },
              }}
            />
          </Stack>

          <DialogContentText sx={{ width: 'auto', pl: 2, pt: 2 }}>ตั้งรหัสผ่านใหม่</DialogContentText>
          <Stack direction="row" spacing={2} sx={{ width: 'auto', p: 2 }}>
            <TextField
              id="secret"
              name="secret"
              label="รหัสผ่านใหม่"
              type={showSecret ? 'text' : 'password'}
              fullWidth
              value={personnelInputSecret === null ? '' : personnelInputSecret}
              onChange={(event) => {
                setPersonnelInputSecret(event.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                      <Iconify icon={showSecret ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="secretConfirm"
              name="secretConfirm"
              label="ยืนยันรหัสผ่านใหม่"
              type={showSecret ? 'text' : 'password'}
              fullWidth
              value={personnelInputSecretConfirm === null ? '' : personnelInputSecretConfirm}
              onChange={(event) => {
                setPersonnelInputSecretConfirm(event.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                      <Iconify icon={showSecret ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h5">ลายเซ็น</Typography>
            {imageUrl !== null && imageUrl !== undefined && imageUrl !== '' ? (
              <img src={imageUrl} alt={'ยังไม่มีลายเซ็น'} height="100px" />
            ) : (
              ``
            )}
            <input id="signature" type="file" accept="image/*" onChange={handleImageChange} />
          </Box>

          <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
            <DialogContentText>การเข้าถึงระบบ</DialogContentText>
            {/* ==== Personnel admin ==== */}
            <Checkbox checked={isPMS} onChange={handleChangePMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
            ระบบจัดการข้อมูลบุคลากร
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isPMS}
              value={PMSLevelName}
              onChange={(event, newValue) => {
                setPMSLevelName(newValue);
                if (newValue !== null) {
                  setPMSLevelId(levels.find((o) => o.level_name === newValue && o.mihapp_id === 'PMS').level_id);
                  setPMSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.level_name === newValue && o.mihapp_id === 'PMS').level_description
                    }`
                  );
                } else {
                  setPMSLevelId('');
                  setPMSLevelDescription('');
                }
              }}
              id="controllable-states-PMS-levels-id"
              // options={Object.values(levels).map((option) => option.mihapp_id === "PMS" ? `${option.level_name}` : '')}
              options={Object.values(levels)
                .map((option) => (option.mihapp_id === 'PMS' ? `${option.level_name}` : ''))
                .filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระบบจัดการข้อมูลบุคลากร" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isPMS ? (PMSLevelName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${PMSLevelDescription}`}</Typography>
            <br />
            {/* ==== END OF Personnel admin ==== */}
            {/* ==== DMIS ==== */}
            <Checkbox checked={isDMIS} onChange={handleChangeDMIS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
            ระบบแจ้งปัญหาออนไลน์
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isDMIS}
              value={DMISLevelName}
              onChange={(event, newValue) => {
                setDMISLevelName(newValue);
                if (newValue !== null) {
                  setDMISLevelId(levels.find((o) => o.level_name === newValue && o.mihapp_id === 'DMIS').level_id);
                  setDMISLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.level_name === newValue && o.mihapp_id === 'DMIS').level_description
                    }`
                  );
                } else {
                  setDMISLevelId('');
                  setDMISLevelDescription('');
                }
              }}
              id="controllable-states-DMIS-levels-id"
              options={Object.values(levels)
                .map((option) => (option.mihapp_id === 'DMIS' ? `${option.level_name}` : ''))
                .filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="หน้าที่ภายในระบบแจ้งปัญหาออนไลน์" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDMIS ? (DMISLevelViewName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${DMISLevelDescription}`}</Typography>
            <br />
            <Autocomplete
              disabled={!isDMIS}
              value={DMISLevelViewName}
              onChange={(event, newValue) => {
                setDMISLevelViewName(newValue);
                if (newValue !== null) {
                  setDMISLevelViewId(levelViews.find((o) => o.view_name === newValue).view_id);
                  setDMISLevelViewDescription(
                    `รายละเอียด: ${levelViews.find((o) => o.view_name === newValue).view_description}`
                  );
                } else {
                  setDMISLevelViewId('');
                  setDMISLevelViewDescription('');
                }
              }}
              id="controllable-states-DMIS-level-views-id"
              options={Object.values(levelViews)
                .map((option) => (option.mihapp_id === 'DMIS' ? `${option.view_name}` : ''))
                .filter(isSkip)}
              // options={Object.values(PSNLvViews).map((option) =>option.name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระดับการเข้าถึงในระบบแจ้งปัญหาออนไลน์" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDMIS ? (DMISLevelViewName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${DMISLevelViewDescription}`}</Typography>
            <br />
            {/* ==== END OF DMIS ==== */}
            {/* ==== DSMS ==== */}
            <Checkbox checked={isDSMS} onChange={handleChangeDSMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
            ระบบจองเวรแพทย์
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isDSMS}
              value={DSMSLevelName}
              onChange={(event, newValue) => {
                setDSMSLevelName(newValue);
                if (newValue !== null) {
                  setDSMSLevelId(levels.find((o) => o.level_name === newValue && o.mihapp_id === 'DSMS').level_id);
                  setDSMSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.level_name === newValue && o.mihapp_id === 'DSMS').level_description
                    }`
                  );
                } else {
                  setDSMSLevelId('');
                  setDSMSLevelDescription('');
                }
              }}
              id="controllable-states-DSMS-levels-id"
              // options={Object.values(levels).map((option) => option.mihapp_id === "PMS" ? `${option.level_name}` : '')}
              options={Object.values(levels)
                .map((option) => (option.mihapp_id === 'DSMS' ? `${option.level_name}` : ''))
                .filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระบบจองเวรแพทย์" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDSMS ? (DSMSLevelName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${DSMSLevelDescription}`}</Typography>
            <br />
            {/* ==== END OF DSMS ==== */}
            {/* ==== CBS ==== */}
            <Checkbox checked={isCBS} onChange={handleChangeCBS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
            ระบบขอใช้รถ
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isCBS}
              value={CBSLevelName}
              onChange={(event, newValue) => {
                setCBSLevelName(newValue);
                if (newValue !== null) {
                  setCBSLevelId(levels.find((o) => o.level_name === newValue && o.mihapp_id === 'CBS').level_id);
                  setCBSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.level_name === newValue && o.mihapp_id === 'CBS').level_description
                    }`
                  );
                } else {
                  setCBSLevelId('');
                  setCBSLevelDescription('');
                }
              }}
              id="controllable-states-CBS-levels-id"
              // options={Object.values(levels).map((option) => option.mihapp_id === "PMS" ? `${option.level_name}` : '')}
              options={Object.values(levels)
                .map((option) => (option.mihapp_id === 'CBS' ? `${option.level_name}` : ''))
                .filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระบบขอใช้รถ" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isCBS ? (CBSLevelName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${CBSLevelDescription}`}</Typography>
            <br />
            <Autocomplete
              disabled={!isCBS}
              value={CBSLvViewName}
              onChange={(event, newValue) => {
                setCBSLvViewName(newValue);
                if (newValue !== null) {
                  setCBSLvViewId(PSNLvViews.find((o) => o.name === newValue).id);
                  setCBSLvViewDescr(`รายละเอียด: ${PSNLvViews.find((o) => o.name === newValue).descr}`);
                } else {
                  setCBSLvViewId('');
                  setCBSLvViewDescr('');
                }
              }}
              id="controllable-states-DMIS-level-views-id"
              // options={Object.values(levelViews).map((option) => option.mihapp_id === "DMIS" ? `${option.view_name}` : '').filter(isSkip)}
              options={Object.values(PSNLvViews).map((option) => option.name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระดับการเข้าถึงในระบบแจ้งขอใช้รถ" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isCBS ? (CBSLvViewName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${CBSLvViewDescr}`}</Typography>
            <br />
            {/* ==== END OF CBS ==== */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleEdit}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {/* ======================================================================================== */}

      {/* ==================================ตั้งค่าสถานะ============================================= */}
      <Dialog fullWidth maxWidth="md" open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>ตั้งค่าสถานะ</DialogTitle>
        <DialogContent>
          <DialogContentText>กรุณาเลือกสถานะ</DialogContentText>
          <Autocomplete
            value={personnelIsactive === true ? 'Active' : 'Deactive'}
            onChange={(event, newValue) => {
              console.log(personnelId);
              setPersonnelIsactive(newValue === 'Active');
            }}
            options={['Active', 'Deactive']}
            renderInput={(params) => <TextField {...params} label="" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleStatus}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {/* ====================================================================================== */}

      {/* ==================================ลบชื่อผู้ใช้============================================= */}
      <Dialog fullWidth maxWidth="md" open={psnDelDialogOpen} onClose={handleClosePsnDelDialog}>
        <DialogTitle>ลบชื่อผู้ใช้</DialogTitle>
        <DialogContent>
          <DialogContentText>กรุณากรอกรหัสพนักงานที่เลือกเพื่อยืนยันการลบข้อมูล</DialogContentText>
          <TextField id="personnel_id" name="personnel_id" label="รหัสพนักงาน" />
          <DialogContentText sx={{ color: 'error.main' }}>
            *คำเตือน: หากลบชื่อผู้ใช้แล้วข้อมูลผู้ใช้จะหายไปอย่างถาวรไม่สามารถกู้คืนได้*
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePsnDelDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handlePsnDel}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
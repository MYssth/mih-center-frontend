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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [psnDelDialogOpen, setPsnDelDialogOpen] = useState(false);

  const [personnelId, setPersonnelId] = useState('');
  const [personnelSecret, setPersonnelSecret] = useState('');
  const [personnelFirstname, setPersonnelFirstname] = useState('');
  const [personnelLastname, setPersonnelLastname] = useState('');
  const [personnelIsactive, setPersonnelIsactive] = useState('');

  const [positionName, setPositionName] = useState('');
  const [positionId, setPositionId] = useState('');
  const [positions, setPositions] = useState([]);

  const [levels, setLevels] = useState([]);

  const [DMISLevelName, setDMISLevelName] = useState('');
  const [DMISLevelId, setDMISLevelId] = useState('');
  const [DMISLevelDescription, setDMISLevelDescription] = useState('');
  const [isDMIS, setIsDMIS] = useState(false);

  const [PMSLevelName, setPMSLevelName] = useState('');
  const [PMSLevelId, setPMSLevelId] = useState('');
  const [PMSLevelDescription, setPMSLevelDescription] = useState('');
  const [isPMS, setIsPMS] = useState(false);

  const [pageSize, setPageSize] = useState(25);

  const navigate = useNavigate();
  const isSkip = (value) => value !== '';
  const [showSecret, setShowSecret] = useState(false);

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
          setPersonnelSecret(params.row.personnel_secret);
          setPersonnelFirstname(params.row.personnel_firstname);
          setPersonnelLastname(params.row.personnel_lastname);
          setPersonnelIsactive(params.row.personnel_isactive);
          setPositionId(params.row.position_id);
          setPositionName(params.row.position_name);
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

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpositions`)
      .then((response) => response.json())
      .then((data) => {
        setPositions(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getlevels`)
      .then((response) => response.json())
      .then((data) => {
        setLevels(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

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

  const handleCloseMenu = () => {
    setOpen(null);

    setPersonnelId('');
    setPersonnelSecret('');
    setPersonnelFirstname('');
    setPersonnelLastname('');
    setPersonnelIsactive('');
    setPositionName('');
    setPositionId('');

    setDMISLevelId('');
    setDMISLevelName('');
    setDMISLevelDescription('');
    setIsDMIS(false);

    setPMSLevelId('');
    setPMSLevelName('');
    setPMSLevelDescription('');
    setIsPMS(false);
  };

  const handleOpenEditDialog = () => {

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getlevellist/${personnelId}`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          if (data[i].mihapp_id === "DMIS") {
            setDMISLevelId(data[i].level_id);
            setDMISLevelName(data[i].level_name);
            setDMISLevelDescription(data[i].level_description);
            setIsDMIS(true);
          }
          if (data[i].mihapp_id === "PMS") {
            setPMSLevelId(data[i].level_id);
            setPMSLevelName(data[i].level_name);
            setPMSLevelDescription(data[i].level_description);
            setIsPMS(true);
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
  }

  const handleEdit = () => {

    const levelList = [];

    if (isDMIS) {
      if (DMISLevelId === "") {
        alert("กรุณาใส่หน้าที่ของระบบแจ้งซ่อม");
        return;
      }
      levelList.push(DMISLevelId);
    }

    if (isPMS) {
      if (PMSLevelId === "") {
        alert("กรุณาใส่หน้าที่ของจัดการข้อมูลบุคลากร");
        return;
      }
      levelList.push(PMSLevelId);
    }

    const inputSecret = document.getElementById('secret').value;

    if (inputSecret !== "") {
      if (inputSecret === document.getElementById('secretConfirm').value) {
        setPersonnelSecret(inputSecret);
      }
      else {
        alert("กรุณากรอกรหัสผ่านให้ตรงกัน");
        return;
      }
    }

    const jsonData = {
      personnel_id: personnelId,
      personnel_secret: personnelSecret,
      personnel_firstname: personnelFirstname,
      personnel_lastname: personnelLastname,
      personnel_isactive: personnelIsactive,
      position_id: positionId,
      level_list: levelList,
    };

    if (jsonData.personnel_id === "" ||
      jsonData.personnel_secret === "" ||
      jsonData.personnel_firstname === "" ||
      jsonData.personnel_lastname === "" ||
      jsonData.position_id === "") {

      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnCrudPort}/api/updatepersonnel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('แก้ไขข้อมูลผู้ใช้สำเร็จ');
          handleCloseEditDialog();
          handleCloseMenu();
          refreshTable();
        }
        else {
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

  const handleChangePMS = (event) => {
    if (event.target.checked) {
      setIsPMS(true);
    }
    else {
      setIsPMS(false);
      setPMSLevelId("");
      setPMSLevelName("");
      setPMSLevelDescription("");
    }

  }

  const handleChangeDMIS = (event) => {
    if (event.target.checked) {
      setIsDMIS(true);
    }
    else {
      setIsDMIS(false);
      setDMISLevelId("");
      setDMISLevelName("");
      setDMISLevelDescription("");
    }

  }

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
            <DialogContentText>
              ข้อมูลส่วนตัว
            </DialogContentText>
            <TextField id="firstname" name="firstname" value={personnelFirstname === null ? "" : personnelFirstname} onChange={(event) => { setPersonnelFirstname(event.target.value) }} label="ชื่อ" />
            <TextField id="lastname" name="lastname" value={personnelLastname === null ? "" : personnelLastname} onChange={(event) => { setPersonnelLastname(event.target.value) }} label="นามสกุล" />

            {/* <div>{`position id: ${position_id !== null ? `'${position_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              value={positionName}
              onChange={(event, newValue) => {
                setPositionName(newValue);
                if (newValue !== null) {
                  setPositionId(positions.find(o => o.position_name === newValue).position_id);
                }
                else {
                  setPositionId("");
                }
              }}
              id="controllable-states-positions-id"
              options={Object.values(positions).map((option) => option.position_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ตำแหน่ง" />}
            />
          </Stack>

          <DialogContentText sx={{ width: 'auto', pl: 2, pt: 2 }}>
            ตั้งรหัสผ่านใหม่
          </DialogContentText>
          <Stack direction="row" spacing={2} sx={{ width: 'auto', p: 2 }}>

            <TextField id="secret" name="secret" label="รหัสผ่านใหม่" type={showSecret ? 'text' : 'password'} fullWidth={Boolean(true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                      <Iconify icon={showSecret ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
            <TextField id="secretConfirm" name="secretConfirm" label="ยืนยันรหัสผ่านใหม่" type={showSecret ? 'text' : 'password'} fullWidth={Boolean(true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                      <Iconify icon={showSecret ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
          </Stack>

          <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
            <DialogContentText>
              การเข้าถึงระบบ
            </DialogContentText>

            {/* ==== Personnel admin ==== */}
            <Checkbox checked={isPMS} onChange={handleChangePMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />ระบบจัดการข้อมูลบุคลากร
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isPMS}
              value={PMSLevelName}
              onChange={(event, newValue) => {
                setPMSLevelName(newValue);
                if (newValue !== null) {
                  setPMSLevelId(levels.find(o => o.level_name === newValue).level_id);
                  setPMSLevelDescription(`รายละเอียด: ${levels.find(o => o.level_name === newValue).level_description}`);
                }
                else {
                  setPMSLevelId("");
                  setPMSLevelDescription("");
                }
              }}
              id="controllable-states-PMS-levels-id"
              // options={Object.values(levels).map((option) => option.mihapp_id === "PMS" ? `${option.level_name}` : '')}
              options={Object.values(levels).map((option) => option.mihapp_id === "PMS" ? `${option.level_name}` : '').filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระบบจัดการข้อมูลบุคลากร" />}
            />
            <Typography sx={{ pl: 1.5 }}>{`${PMSLevelDescription}`}</Typography><br />
            {/* ==== END OF Personnel admin ==== */}

            {/* ==== DMIS ==== */}
            <Checkbox checked={isDMIS} onChange={handleChangeDMIS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />ระบบแจ้งซ่อม
            {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
            <Autocomplete
              disabled={!isDMIS}
              value={DMISLevelName}
              onChange={(event, newValue) => {
                setDMISLevelName(newValue);
                if (newValue !== null) {
                  setDMISLevelId(levels.find(o => o.level_name === newValue).level_id);
                  setDMISLevelDescription(`รายละเอียด: ${levels.find(o => o.level_name === newValue).level_description}`);
                }
                else {
                  setDMISLevelId("");
                  setDMISLevelDescription("");
                }
              }}
              id="controllable-states-DMIS-levels-id"
              options={Object.values(levels).map((option) => option.mihapp_id === "DMIS" ? `${option.level_name}` : '').filter(isSkip)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="หน้าที่ภายในระบบแจ้งซ่อม" />}
            />
            <Typography sx={{ pl: 1.5 }}>{`${DMISLevelDescription}`}</Typography><br />
            {/* ==== END OF DMIS ==== */}

          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleEdit}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
      {/* ======================================================================================== */}

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
      {/* ====================================================================================== */}

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

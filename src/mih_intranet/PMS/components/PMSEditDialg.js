/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Typography,
  IconButton,
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
import Iconify from '../../../components/iconify';

function PMSEditDialg({ openDialg, onCloseDialg, data, levels, levelViews, rToken }) {
  const [personnelInputSecret, setPersonnelInputSecret] = useState('');
  const [personnelInputSecretConfirm, setPersonnelInputSecretConfirm] = useState('');

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

  const [CBSLevelName, setCBSLevelName] = useState('');
  const [CBSLevelId, setCBSLevelId] = useState('');
  const [CBSLevelDescription, setCBSLevelDescription] = useState('');
  const [CBSLevelViewId, setCBSLevelViewId] = useState('');
  const [CBSLevelViewName, setCBSLevelViewName] = useState('');
  const [CBSLevelViewDescription, setCBSLevelViewDescription] = useState('');

  const [isCBS, setIsCBS] = useState(false);

  const isSkip = (value) => value !== '';
  const [showSecret, setShowSecret] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (openDialg) {
      clearData();
      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data?.psn_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.data !== null && result.data !== undefined && result.data !== '') {
            setImageUrl(result.data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevellist/${data?.psn_id}`, {
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
              setDMISLevelId(data[i].lv_id);
              setDMISLevelName(data[i].lv_name);
              setDMISLevelDescription(data[i].lv_descr);
              setDMISLevelViewId(data[i].view_id);
              setDMISLevelViewName(data[i].view_name);
              setDMISLevelViewDescription(data[i].view_descr);
              setIsDMIS(true);
            }
            if (data[i].mihapp_id === 'PMS') {
              setPMSLevelId(data[i].lv_id);
              setPMSLevelName(data[i].lv_name);
              setPMSLevelDescription(data[i].lv_descr);
              setIsPMS(true);
            }
            if (data[i].mihapp_id === 'DSMS') {
              setDSMSLevelId(data[i].lv_id);
              setDSMSLevelName(data[i].lv_name);
              setDSMSLevelDescription(data[i].lv_descr);
              setIsDSMS(true);
            }
            if (data[i].mihapp_id === 'CBS') {
              setCBSLevelId(data[i].lv_id);
              setCBSLevelName(data[i].lv_name);
              setCBSLevelDescription(data[i].lv_descr);
              setCBSLevelViewId(data[i].view_id);
              setCBSLevelViewName(data[i].view_name);
              setCBSLevelViewDescription(data[i].view_descr);
              setIsCBS(true);
            }
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [openDialg]);

  const clearData = () => {
    setPersonnelInputSecret('');
    setPersonnelInputSecretConfirm('');

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
    setCBSLevelViewId('');
    setCBSLevelViewName('');
    setCBSLevelViewDescription('');
    setIsCBS(false);

    setImageUrl(null);
  };

  const handleRstPwd = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/resetsecret/${data?.psn_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('แก้ไขข้อมูลผู้ใช้สำเร็จ กรุณาแจ้งให้ผู้ใช้ทำการเข้าสู่ระบบอีกครั้งเพื่อเปลี่ยนข้อมูล');
          onCloseDialg();
        } else {
          alert('ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
      });
  };

  const handleEdit = () => {
    const levelList = [];

    if (isDMIS) {
      if (DMISLevelId === '') {
        alert('กรุณาเลือกหน้าที่ของระบบแจ้งซ่อม');
        return;
      }
      if (DMISLevelViewId === '') {
        alert('กรุณาเลือกระดับการมองเห็นของระบบแจ้งซ่อม');
        return;
      }
      levelList.push({ lv_id: DMISLevelId, view_id: DMISLevelViewId });
    }

    if (isPMS) {
      if (PMSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบจัดการข้อมูลบุคลากร');
        return;
      }
      levelList.push({ lv_id: PMSLevelId, view_id: '' });
    }

    if (isDSMS) {
      if (DSMSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบจองเวรแพทย์');
        return;
      }
      levelList.push({ lv_id: DSMSLevelId, view_id: '' });
    }

    if (isCBS) {
      if (CBSLevelId === '') {
        alert('กรุณาใส่หน้าที่ของระบบขอใช้รถ');
        return;
      }
      if (!CBSLevelViewId || CBSLevelViewId === 'undefined') {
        alert('กรุณาเลือกระดับการมองเห็นของระบบขอใช้รถ');
        return;
      }
      levelList.push({ lv_id: CBSLevelId, view_id: CBSLevelViewId });
    }

    if (personnelInputSecret && personnelInputSecret !== personnelInputSecretConfirm) {
      alert('กรุณากรอกรหัสผ่านให้ตรงกัน');
      return;
    }

    const jsonData = {
      psn_id: data?.psn_id,
      secret: personnelInputSecret,
      lv_list: levelList,
      sig_data: selectedImage !== undefined && selectedImage !== null && selectedImage !== '' ? imageUrl : null,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/updatepersonnel`, {
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
          onCloseDialg();
        } else {
          alert('ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
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
    <div>
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <DialogContentText>ข้อมูลส่วนตัว</DialogContentText>
            <Box spacing={2}>
              รหัสพนักงาน: {data?.psn_id}
              <br />
              ชื่อ: {data?.pname} {data?.fname} {data?.lname}
              <br />
              สายงาน: {data?.fld_name}
              <br />
              ฝ่ายงาน: {data?.fac_name}
              <br />
              แผนก: {data?.dept_name}
              <br />
              ตำแหน่ง: {data?.pos_name}
              <br />
              วันที่รหัสผ่านหมดอายุ:
              {` ${
                data?.exp_date
                  ? `${new Date(data?.exp_date).getUTCDate()}/${new Date(data?.exp_date).getMonth() + 1}/${new Date(
                      data?.exp_date
                    ).getUTCFullYear()}`
                  : '-'
              }`}
            </Box>
          </Stack>

          <DialogContentText sx={{ width: 'auto', pl: 2, pt: 2 }}>ตั้งรหัสผ่านใหม่</DialogContentText>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Stack direction="row" spacing={2}>
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
            <Button variant="contained" color="error" onClick={handleRstPwd}>
              ลบรหัสผ่าน
            </Button>
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
                  setPMSLevelId(levels.find((o) => o.name === newValue && o.mihapp_id === 'PMS').id);
                  setPMSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.name === newValue && o.mihapp_id === 'PMS').descr
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
                .map((option) => (option.mihapp_id === 'PMS' ? `${option.name}` : ''))
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
                  setDMISLevelId(levels.find((o) => o.name === newValue && o.mihapp_id === 'DMIS').id);
                  setDMISLevelDescription(
                    `รายละเอียด: ${levels.find((o) => o.name === newValue && o.mihapp_id === 'DMIS').descr}`
                  );
                } else {
                  setDMISLevelId('');
                  setDMISLevelDescription('');
                }
              }}
              id="controllable-states-DMIS-levels-id"
              options={Object.values(levels)
                .map((option) => (option.mihapp_id === 'DMIS' ? `${option.name}` : ''))
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
                  setDMISLevelViewId(levelViews.find((o) => o.name === newValue).id);
                  setDMISLevelViewDescription(`รายละเอียด: ${levelViews.find((o) => o.name === newValue).descr}`);
                } else {
                  setDMISLevelViewId('');
                  setDMISLevelViewDescription('');
                }
              }}
              id="controllable-states-DMIS-level-views-id"
              options={Object.values(levelViews)
                .map((option) => option.name)
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
                  setDSMSLevelId(levels.find((o) => o.name === newValue && o.mihapp_id === 'DSMS').id);
                  setDSMSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.name === newValue && o.mihapp_id === 'DSMS').descr
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
                .map((option) => (option.mihapp_id === 'DSMS' ? `${option.name}` : ''))
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
                  setCBSLevelId(levels.find((o) => o.name === newValue && o.mihapp_id === 'CBS').id);
                  setCBSLevelDescription(
                    `รายละเอียด: ${
                      levels.find((o) => o.name === newValue && o.mihapp_id === 'CBS').descr
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
                .map((option) => (option.mihapp_id === 'CBS' ? `${option.name}` : ''))
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
              value={CBSLevelViewName}
              onChange={(event, newValue) => {
                setCBSLevelViewName(newValue);
                if (newValue !== null) {
                  setCBSLevelViewId(levelViews.find((o) => o.name === newValue).id);
                  setCBSLevelViewDescription(`รายละเอียด: ${levelViews.find((o) => o.name === newValue).descr}`);
                } else {
                  setCBSLevelViewId('');
                  setCBSLevelViewDescription('');
                }
              }}
              id="controllable-states-DMIS-level-views-id"
              // options={Object.values(levelViews).map((option) => option.mihapp_id === "DMIS" ? `${option.view_name}` : '').filter(isSkip)}
              options={Object.values(levelViews).map((option) => option.name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระดับการเข้าถึงในระบบแจ้งขอใช้รถ" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isCBS ? (CBSLevelViewName ? 'green' : 'red') : '',
                  },
                },
              }}
            />
            <Typography sx={{ pl: 1.5 }}>{`${CBSLevelViewDescription}`}</Typography>
            <br />
            {/* ==== END OF CBS ==== */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleEdit}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PMSEditDialg;

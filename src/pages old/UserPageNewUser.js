import * as React from 'react';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, TextField, Card, Button, Checkbox, Box, Divider, styled } from '@mui/material';

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

export default function UserPageNewUser() {
  const navigate = useNavigate();

  const [positionName, setPositionName] = React.useState('');
  const [positionId, setPositionId] = React.useState('');
  const [positions, setPositions] = React.useState([]);
  const [levels, setLevels] = React.useState([]);
  const [levelViews, setLevelViews] = React.useState([]);

  const [DMISLevelName, setDMISLevelName] = React.useState('');
  const [DMISLevelId, setDMISLevelId] = React.useState('');
  const [DMISLevelDescription, setDMISLevelDescription] = React.useState('');
  const [DMISLevelViewName, setDMISLevelViewName] = React.useState('');
  const [DMISLevelViewId, setDMISLevelViewId] = React.useState('');
  const [DMISLevelViewDescription, setDMISLevelViewDescription] = React.useState('');
  const [isDMIS, setIsDMIS] = React.useState(false);

  const [PMSLevelName, setPMSLevelName] = React.useState('');
  const [PMSLevelId, setPMSLevelId] = React.useState('');
  const [PMSLevelDescription, setPMSLevelDescription] = React.useState('');
  const [isPMS, setIsPMS] = React.useState(false);

  const [DSMSLevelName, setDSMSLevelName] = React.useState('');
  const [DSMSLevelId, setDSMSLevelId] = React.useState('');
  const [DSMSLevelDescription, setDSMSLevelDescription] = React.useState('');
  const [isDSMS, setIsDSMS] = React.useState(false);

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);

  const isSkip = (value) => value !== '';

  useEffect(() => {
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
      })

      .then(
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
          })
      )
      .then(
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
          })
      );
  }, []);

  const handleSubmit = () => {
    const levelList = [];
    const viewList = [];

    if (isDMIS) {
      if (DMISLevelId === '') {
        alert('กรุณาเลือกหน้าที่ของระบบแจ้งปัญหา');
        return;
      }
      if (DMISLevelViewId === '') {
        alert('กรุณาเลือกระดับการมองเห็นของระบบแจ้งปัญหา');
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

    const jsonData = {
      personnel_id: document.getElementById('username').value,
      personnel_secret: document.getElementById('password').value,
      personnel_firstname: document.getElementById('firstname').value,
      personnel_lastname: document.getElementById('lastname').value,
      personnel_isactive: '1',
      position_id: positionId,
      level_list: levelList,
      view_list: viewList,
      signature_data: imageUrl,
    };

    // console.log(`id : ${jsonData.personnel_id}`);
    // console.log(`pass : ${jsonData.personnel_secret}`);
    // console.log(`firstname : ${jsonData.personnel_firstname}`);
    // console.log(`lastname : ${jsonData.personnel_lastname}`);
    // console.log(`position id : ${jsonData.position_id}`);
    // console.log(`level_list : ${jsonData.level_list}`);
    // console.log(`level list length = ${jsonData.level_list.length}`);
    // console.log(`signature_data = ${jsonData.signature_data}`);

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
    if (jsonData.personnel_id.length !== 7) {
      alert('กรุณากรอกรหัสพนักงานให้ถูกต้อง');
      return;
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnCrudPort}/addpersonnel`, {
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
          alert('เพิ่มข้อมูลผู้ใช้สำเร็จ');
          navigate('/dashboard/user', { replace: true });
        } else if (data.status === 'duplicate') {
          alert('ชื่อผู้ใช้ซ้ำ ไม่สามารถเพิ่มข้อมูลผู้ใช้ได้');
        } else {
          alert('ไม่สามารถเพิ่มข้อมูลผู้ใช้ได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้');
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
        <title> เพิ่มผู้ใช้ใหม่ | {headSname} </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          เพิ่มผู้ใช้ใหม่
        </Typography>
        <Card>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h5">ข้อมูลส่วนตัว</Typography>
            <ValidationTextField
              required
              id="username"
              name="username"
              label="รหัสพนักงาน"
              inputProps={{ maxLength: 7 }}
            />
            <ValidationTextField required id="password" name="password" label="รหัสผ่าน (วันเดือนปีเกิด)" />
            <ValidationTextField required id="firstname" name="firstname" label="ชื่อ" />
            <ValidationTextField required id="lastname" name="lastname" label="นามสกุล" />

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

          <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h5">ลายเซ็น</Typography>
            {imageUrl ? <img src={imageUrl} alt={selectedImage.name} height="100px" /> : ``}
            <input id="signature" type="file" accept="image/*" onChange={handleImageChange} />
          </Box>

          <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h5">การเข้าถึงระบบ</Typography>
            {/* =========================================== Personnel admin ======================================================== */}
            <Checkbox onChange={handleChangePMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
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
            {/* ========================================= END OF Personnel admin ==================================================== */}
            <Divider />
            {/* ============================================= DMIS ================================================================= */}
            <Checkbox onChange={handleChangeDMIS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
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
                    borderColor: isDMIS ? (DMISLevelName ? 'green' : 'red') : '',
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
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ระดับการมองเห็นข้อมูลในระบบแจ้งปัญหาออนไลน์" />}
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
            {/* ============================================= END OF DMIS ========================================================== */}
            <Divider />
            {/* ============================================= DSMS ================================================================= */}
            <Checkbox onChange={handleChangeDSMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
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
            {/* ============================================= END OF DSMS ========================================================== */}
          </Box>

          <Box textAlign="center">
            <Button variant="contained" onClick={handleSubmit} align="center">
              เพิ่มข้อมูลผู้ใช้
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
}

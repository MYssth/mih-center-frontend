import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
// @mui
import { Stack, Typography, TextField, Divider, Button, Box, styled } from '@mui/material';
import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { SubmtERR, SubmtINC } from '../components/dialogs/response';

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

function IIOSNewCase() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [caseTypeId, setCaseTypeId] = useState('');
  const [caseTypeName, setCaseTypeName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [informerId, setInformerId] = useState([]);
  const [informerName, setInformerName] = useState('');

  const [submitERR, setSubmitERR] = useState(false);
  const [submitINC, setSubmitINC] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const token = jwtDecode(localStorage.getItem('token'));

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getpersonnel/${token.psn_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInformerId(data.psn_id);
        setInformerName(`${data.fname} ${data.lname}`);
        setDepartmentId(data.dept_id);
        setDepartmentName(data.dept_name);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      })

      .then(
        fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getdepartments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setDepartments(data);
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('cancelled');
            } else {
              console.error('Error:', error);
            }
          })
      );

    return () => {
      controller.abort();
    };
  }, []);

  const handleSubmit = () => {
    const jsonData = {
      level_id: caseTypeId,
      task_issue: document.getElementById('issue').value,
      task_serialnumber: document.getElementById('serialnumber').value,
      task_device_id: document.getElementById('deviceId').value,
      informer_id: informerId,
      informer_name: informerName,
      issue_department_id: departmentId,
      department_name: departmentName,
      phoneNumber: document.getElementById('phoneNumber').value,
    };

    // console.log(jsonData);

    // if (1) {
    //     if (caseTypeName === "" ||
    //         jsonData.level_id === "") {
    //         alert("กรุณาเลือกงานที่ต้องการแจ้งปัญหา");
    //         return;
    //     }
    //     if (jsonData.task_device_id !== "" && jsonData.task_device_id.length !== 18) {
    //         alert("กรุณาใส่รหัสทรัพย์สินให้ถูกต้อง");
    //         return;
    //     }
    //     if (jsonData.task_issue === "") {
    //         alert("กรุณาระบุรายละเอียดของปัญหา");
    //         return;
    //     }
    //     if (jsonData.issue_department_id === "") {
    //         alert("กรุณาแผนกที่พบปัญหา");
    //         return;
    //     }
    // }

    if (
      caseTypeName === '' ||
      jsonData.level_id === '' ||
      (jsonData.task_device_id !== '' && jsonData.task_device_id.length !== 18) ||
      jsonData.task_issue === '' ||
      jsonData.issue_department_id === ''
    ) {
      setSubmitINC(true);
      return;
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/addtask`, {
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
          navigate('/iiosuserdashboard', { replace: true });
        } else {
          // alert('ไม่สามารถทำการแจ้งปัญหาได้');
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // alert('เกิดข้อผิดพลาดในการแจ้งปัญหา');
        setSubmitERR(true);
      });
  };

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <IIOSSidebar name="newcase" openNav={open} onCloseNav={() => setOpen(false)} />
      <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>แจ้งปัญหาออนไลน์</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/iiosuserdashboard">หน้าหลักระบบแจ้งปัญหา</a>
              </li>
              <li className="breadcrumb-item my-2">แจ้งปัญหาออนไลน์</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                    {/* กรุณาเลือกงานที่ต้องการแจ้งซ่อม */}
                    <Typography variant="h5">ประเภทงาน</Typography>
                    <Autocomplete
                      value={caseTypeName}
                      onChange={(event, newValue) => {
                        setCaseTypeName(newValue);
                        // console.log(`caseTypeName = ${caseTypeName}`)
                        if (newValue.label === 'งาน IT') {
                          setCaseTypeId('DMIS_IT');
                        } else if (newValue.label === 'งานซ่อมบำรุงทั่วไป') {
                          setCaseTypeId('DMIS_MT');
                        } else if (newValue.label === 'งานซ่อมบำรุงเครื่องมือแพทย์') {
                          setCaseTypeId('DMIS_MER');
                        } else {
                          setCaseTypeId('');
                        }
                      }}
                      id="controllable-states-case-type-id"
                      options={[
                        { label: 'งาน IT' },
                        { label: 'งานซ่อมบำรุงทั่วไป' },
                        { label: 'งานซ่อมบำรุงเครื่องมือแพทย์' },
                      ]}
                      fullWidth
                      required
                      renderInput={(params) => (
                        <TextField required {...params} label="กรุณาเลือกงานที่ต้องการแจ้งปัญหา" />
                      )}
                      sx={{
                        '& .MuiAutocomplete-inputRoot': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: caseTypeName ? 'green' : 'red',
                          },
                        },
                      }}
                    />
                    <TextField id="phoneNumber" name="phoneNumber" label="เบอร์โทรติดต่อ" />
                  </Stack>
                  <Divider />
                  <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                    <Typography variant="h5">รายละเอียด</Typography>
                    <InputMask mask="99-99-999-999-9999" disabled={false} maskChar="">
                      {() => (
                        <TextField
                          id="deviceId"
                          name="deviceId"
                          label="รหัสทรัพย์สิน"
                          placeholder="xx-xx-xxx-xxx-xxxx"
                        />
                      )}
                    </InputMask>
                    <ValidationTextField
                      required
                      id="issue"
                      name="issue"
                      label="รายละเอียดของปัญหา (ระบุยี่ห้อ, รุ่นของเครื่อง)"
                      inputProps={{ maxLength: 140 }}
                    />
                    <TextField id="serialnumber" name="serialnumber" label="Serial Number" />
                    <Autocomplete
                      value={departmentName}
                      onChange={(event, newValue) => {
                        setDepartmentName(newValue);
                        if (newValue !== null) {
                          setDepartmentId(departments.find((o) => o.dept_name === newValue).dept_id);
                        } else {
                          setDepartmentId('');
                        }
                      }}
                      id="controllable-states-departments-id"
                      options={Object.values(departments).map((option) => option.dept_name)}
                      fullWidth
                      required
                      renderInput={(params) => <TextField required {...params} label="แผนกที่พบปัญหา" />}
                      sx={{
                        '& .MuiAutocomplete-inputRoot': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: departmentName ? 'green' : 'red',
                          },
                        },
                      }}
                    />
                  </Stack>
                  <Box textAlign="center" sx={{ mb: 1 }}>
                    <Button variant="contained" onClick={handleSubmit} align="center">
                      ส่งเรื่องแจ้งปัญหา
                    </Button>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default IIOSNewCase;

/* eslint-disable react-hooks/rules-of-hooks */
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import InputMask from "react-input-mask";
// @mui
import { Container, Stack, Typography, TextField, Card, Divider, Button, Box, styled } from '@mui/material';

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
      borderColor: 'green'
    },
    '& input:invalid + fieldset': {
      borderColor: 'red'
    },
  });

  const ValidationAutocomplete = styled(Autocomplete)({
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& .MuiAutocomplete-input': {
        borderColor: 'red'
     },
  });

export default function dmisnewcase() {

    const navigate = useNavigate();

    const [caseTypeId, setCaseTypeId] = useState('');
    const [caseTypeName, setCaseTypeName] = useState('');
    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [informerId, setInformerId] = useState([]);

    useEffect(() => {

        const token = jwtDecode(localStorage.getItem('token'));

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpersonnel/${token.personnel_id}`)
            .then((response) => response.json())
            .then((data) => {
                setInformerId(data.personnel_id);
                setDepartmentId(data.department_id);
                setDepartmentName(data.department_name);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getdepartments`)
            .then((response) => response.json())
            .then((data) => {
                setDepartments(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, []);

    const handleSubmit = () => {
        const jsonData = {
            level_id: caseTypeId,
            task_issue: document.getElementById('issue').value,
            task_serialnumber: document.getElementById('serialnumber').value,
            task_device_id: document.getElementById('deviceId').value,
            informer_id: informerId,
            issue_department_id: departmentId,
            department_name: departmentName,
            phoneNumber: document.getElementById('phoneNumber').value,
        };

        // console.log(`level_id: ${jsonData.level_id}`);
        // console.log(`task_issue: ${jsonData.task_issue}`);
        // console.log(`task_serialnumber: ${jsonData.task_serialnumber}`);
        // console.log(`task_device_id: ${jsonData.task_device_id}`);
        // console.log(`informer_id: ${jsonData.informer_id}`);
        // console.log(`issue_department_id: ${jsonData.issue_department_id}`);
        // console.log(`department_name: ${jsonData.department_name}`);
        // console.log(`phoneNumber: ${jsonData.phoneNumber}`);


        if (caseTypeName === "" ||
            jsonData.level_id === "") {
            alert("กรุณาเลือกงานที่ต้องการแจ้งซ่อม");
            return;
        }
        if (jsonData.task_device_id !== "" && jsonData.task_device_id.length !== 18) {
            alert("กรุณาใส่รหัสทรัพย์สินให้ถูกต้อง");
            return;
        }
        if (jsonData.task_issue === "") {
            alert("กรุณาระบุรายละเอียดของปัญหา");
            return;
        }
        if (jsonData.issue_department_id === "") {
            alert("กรุณาแผนกที่มีปัญหา");
            return;
        }

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/addtask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    alert('ทำการแจ้งซ่อมสำเร็จ');
                    navigate('/dmis', { replace: true });
                }
                else {
                    alert('ไม่สามารถทำการแจ้งซ่อมได้');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการแจ้งซ่อม');
            });

    }

    return (
        <>
            <Helmet>
                <title> แจ้งซ่อมอุปกรณ์ | MIH Center </title>
            </Helmet>

            <Container>

                <Typography variant="h4" sx={{ mb: 5 }}>
                    แจ้งซ่อมอุปกรณ์
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        {/* กรุณาเลือกงานที่ต้องการแจ้งซ่อม */}
                        <ValidationAutocomplete
                            value={caseTypeName}
                            onChange={(event, newValue) => {
                                setCaseTypeName(newValue);
                                // console.log(`caseTypeName = ${caseTypeName}`)
                                if (newValue.label === 'งาน IT') {
                                    setCaseTypeId("DMIS_IT");
                                }
                                else if (newValue.label === 'งานช่าง') {
                                    setCaseTypeId("DMIS_MT");
                                }
                                else {
                                    setCaseTypeId("");
                                }
                            }}
                            id="controllable-states-case-type-id"
                            options={[
                                { label: 'งาน IT' },
                                { label: 'งานช่าง' }]}
                            fullWidth
                            required
                            renderInput={(params) => <TextField required {...params} label="กรุณาเลือกงานที่ต้องการแจ้งซ่อม" />}
                        />
                        <TextField id="phoneNumber" name="phoneNumber" label="เบอร์โทรติดต่อ" />
                    </Stack>
                    <Divider />
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>รายละเอียด</Typography>
                        <InputMask
                            mask="99-99-999-999-9999"
                            disabled={false}
                            maskChar=""
                        >
                            {() => <TextField id="deviceId" name="deviceId" label="รหัสทรัพย์สิน" placeholder='xx-xx-xxx-xxx-xxxx' />}
                        </InputMask>
                        <ValidationTextField
                            required
                            id="issue"
                            name="issue"
                            label="รายละเอียดของปัญหา (ระบุยี่ห้อ, รุ่นของเครื่อง)"
                        />
                        <TextField id="serialnumber" name="serialnumber" label="Serial Number" />
                        <Autocomplete
                            value={departmentName}
                            onChange={(event, newValue) => {
                                setDepartmentName(newValue);
                                if (newValue !== null) {
                                    setDepartmentId(departments.find(o => o.department_name === newValue).department_id);
                                }
                                else {
                                    setDepartmentId("");
                                }
                            }}
                            id="controllable-states-departments-id"
                            options={Object.values(departments).map((option) => option.department_name)}
                            fullWidth
                            required
                            renderInput={(params) => <TextField required {...params} label="แผนกที่แจ้งปัญหา" />}
                        />

                    </Stack>
                    <Box textAlign='center'>
                        <Button variant="contained" onClick={handleSubmit} align='center'>
                            แจ้งซ่อมอุปกรณ์
                        </Button>
                    </Box>
                </Card>
            </Container>
        </>
    );
}
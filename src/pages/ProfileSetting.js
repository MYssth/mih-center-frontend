import { useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import {
    Container,
    Typography,
    Stack, Card,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Button,
} from '@mui/material';
import Iconify from '../components/iconify';

export default function ProfileSetting() {

    const [showSecret, setShowSecret] = useState(false);
    const [personnel, setPersonnel] = useState([]);

    const [personnelSecret, setPersonnelSecret] = useState('');
    const [personnelFirstname, setPersonnelFirstname] = useState('');
    const [personnelLastname, setPersonnelLastname] = useState('');
    const [personnelIsactive, setPersonnelIsactive] = useState('');
    const [positionId, setPositionId] = useState('');

    useEffect(() => {

        const controller = new AbortController();
        // eslint-disable-next-line prefer-destructuring
        const signal = controller.signal;
        const token = jwtDecode(localStorage.getItem('token'));

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpersonnel/${token.personnel_id}`, { signal })
            .then((response) => response.json())
            .then((data) => {
                setPersonnel(data);
                setPersonnelSecret(data.personnel_secret);
                setPersonnelFirstname(data.personnel_firstname);
                setPersonnelLastname(data.personnel_lastname);
                setPersonnelIsactive(data.personnel_isactive);
                setPositionId(data.position_id);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            });

        return () => {
            controller.abort();
        }

    }, []);

    const handleSubmit = () => {

        const secret = document.getElementById('oldSecret').value;
        const inputSecret = document.getElementById('secret').value;

        if (personnelFirstname === "") {
            alert("กรุณากรอกชื่อ");
            return;
        }
        if (personnelLastname === "") {
            alert("กรุณากรอกนามสกุล");
            return;
        }
        if (secret === "") {
            alert("กรุณากรอกรหัสผ่านเพื่อยืนยันการแก้ไขข้อมูล");
            return;
        }

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_loginPort}/api/verify/${personnel.personnel_id}/${secret}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {

                    let jsonData = {
                        personnel_id: personnel.personnel_id,
                        personnel_secret: personnelSecret,
                        personnel_firstname: personnelFirstname,
                        personnel_lastname: personnelLastname,
                        personnel_isactive: personnelIsactive,
                        position_id: positionId,
                    };

                    console.log(`inputSecret = ${inputSecret}`);
                    if (inputSecret !== "") {
                        if (inputSecret === document.getElementById('secretConfirm').value) {

                            jsonData = {
                                personnel_id: personnel.personnel_id,
                                personnel_secret: inputSecret,
                                personnel_firstname: personnelFirstname,
                                personnel_lastname: personnelLastname,
                                personnel_isactive: personnelIsactive,
                                position_id: positionId,
                            };
                        }
                        else {
                            alert("กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน");
                            return;
                        }
                    }

                    // console.log(`personnel_id: ${jsonData.personnel_id}`);
                    // console.log(`personnel_secret: ${jsonData.personnel_secret}`);
                    // console.log(`personnel_firstname: ${jsonData.personnel_firstname}`);
                    // console.log(`personnel_lastname: ${jsonData.personnel_lastname}`);
                    // console.log(`personnel_isactive: ${jsonData.personnel_isactive}`);
                    // console.log(`position_id: ${jsonData.position_id}`);

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
                                alert('แก้ไขข้อมูลผู้ใช้สำเร็จ\n*ข้อมูลชื่อ-นามสกุลที่แสดงในเมนูจะถูกเปลี่ยนเมื่อ login ใหม่*');
                                window.location.reload(false);
                            }
                            else {
                                alert('ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้');
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
                        });

                }
                else {
                    alert(data.message);
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <Helmet>
                <title> ตั้งค่าบัญชี | MIH Center </title>
            </Helmet>

            <Container>

                <Typography variant="h4" sx={{ mb: 5 }}>
                    ตั้งค่าบัญชี
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>ข้อมูลส่วนตัว</Typography>
                        <Typography variant='h7'>รหัสพนักงาน: {personnel.personnel_id}</Typography>
                        <TextField id="firstname" name="firstname" label="ชื่อ" value={personnelFirstname} onChange={(event) => { setPersonnelFirstname(event.target.value) }} />
                        <TextField id="lastname" name="lastname" label="นามสกุล" value={personnelLastname} onChange={(event) => { setPersonnelLastname(event.target.value) }} />
                        <Typography variant='h7'>ตำแหน่ง: {personnel.position_name}</Typography>
                        <Typography variant='h7'>แผนก: {personnel.department_name}</Typography>
                        <Typography variant='h7'>ฝ่าย: {personnel.faction_name}</Typography>
                        <Typography variant='h7'>สายงาน: {personnel.field_name}</Typography>
                    </Stack>

                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>เปลี่ยนรหัสผ่าน</Typography>
                        <Stack direction="row" spacing={2} sx={{ width: 'auto', }}>
                            <TextField id="secret" name="secret" label="รหัสผ่านใหม่" type='password' fullWidth={Boolean(true)} />
                            <TextField id="secretConfirm" name="secretConfirm" label="ยืนยันรหัสผ่านใหม่" type='password' fullWidth={Boolean(true)} />
                        </Stack>
                    </Stack>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h6'>กรุณากรอกรหัสผ่านเพื่อยืนยันการแก้ไขข้อมูล</Typography>
                        <TextField id="oldSecret" name="oldSecret" label="รหัสผ่านเดิม" type={showSecret ? 'text' : 'password'} fullWidth={Boolean(true)}
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
                    <Box textAlign='center'>
                        <Button variant="contained" onClick={handleSubmit} align='center'>
                            แก้ไขข้อมูล
                        </Button>
                    </Box>
                </Card>
            </Container>
        </>
    );

}
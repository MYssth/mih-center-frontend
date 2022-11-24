import * as React from 'react';
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, TextField, IconButton, InputAdornment, Card, Button, Checkbox, Box } from '@mui/material';

export default function UserPageNewUser() {
    const navigate = useNavigate();

    const [positionName, setPositionName] = React.useState('');
    const [positionId, setPositionId] = React.useState('');
    const [positions, setPositions] = React.useState([]);
    const [DMISLevelName, setDMISLevelName] = React.useState('');
    const [DMISLevelId, setDMISLevelId] = React.useState('');
    const [DMISLevelDescription, setDMISLevelDescription] = React.useState('');
    const [levels, setLevels] = React.useState([]);
    const [isDMIS, setIsDMIS] = React.useState(false);

    useEffect(() => {

        // fetch(`http://${process.env.host}:${process.env.psnDataDistPort}/api/getpositions`)
        fetch(`http://localhost:5001/api/getpositions`)
            .then((response) => response.json())
            .then((data) => {
                setPositions(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // fetch(`http://${process.env.host}:${process.env.psnDataDistPort}/api/getlevels`)
        fetch(`http://localhost:5001/api/getlevels`)
            .then((response) => response.json())
            .then((data) => {
                setLevels(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, []);

    const handleSubmit = () => {

        const levelList = [];

        if (isDMIS) {
            levelList.push(DMISLevelId);
        }

        const jsonData = {
            personnel_id: document.getElementById('username').value,
            personnel_secret: document.getElementById('password').value,
            personnel_firstname: document.getElementById('firstname').value,
            personnel_lastname: document.getElementById('lastname').value,
            personnel_isactive: "1",
            position_id: positionId,
            level_list: levelList,
        }

        // console.log(`id : ${jsonData.personnel_id}`);
        // console.log(`pass : ${jsonData.personnel_secret}`);
        // console.log(`firstname : ${jsonData.personnel_firstname}`);
        // console.log(`lastname : ${jsonData.personnel_lastname}`);
        // console.log(`position id : ${jsonData.position_id}`);
        // console.log(`level_list : ${jsonData.level_list}`);
        // console.log(`level list length = ${jsonData.level_list.length}`);

        if (jsonData.personnel_id === "" ||
            jsonData.personnel_secret === "" ||
            jsonData.personnel_firstname === "" ||
            jsonData.personnel_lastname === "" ||
            jsonData.position_id === "") {

            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        if (jsonData.personnel_id.length !== 7) {
            alert('กรุณากรอกรหัสพนักงานให้ถูกต้อง');
            return;
        }

        // fetch(`http://${process.env.host}:${process.env.userCrudPort}/api/addpersonnel`, {
        fetch(`http://localhost:5002/api/addpersonnel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    alert('เพิ่มข้อมูลผู้ใช้สำเร็จ');
                    navigate('/dashboard/user', { replace: true });
                }
                else {
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
                <title> เพิ่มผู้ใช้ใหม่ | MIH Center </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    เพิ่มผู้ใช้ใหม่
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>ข้อมูลส่วนตัว</Typography>
                        <TextField id="username" name="username" label="รหัสพนักงาน" />
                        <TextField id="password" name="password" label="รหัสผ่าน (วันเดือนปีเกิด)" />
                        <TextField id="firstname" name="firstname" label="ชื่อ" />
                        <TextField id="lastname" name="lastname" label="นามสกุล" />

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

                    <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>การเข้าถึงระบบ</Typography>

                        {/* ============================================= DMIS ================================================================= */}
                        <Checkbox onChange={handleChangeDMIS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />ระบบแจ้งซ่อม
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
                            options={Object.values(levels).map((option) => option.mihapp_id === "DMIS" ? `${option.level_name}` : '')}
                            fullWidth
                            required
                            renderInput={(params) => <TextField {...params} label="หน้าที่ภายในระบบแจ้งซ่อม" />}
                        />
                        <Typography sx={{ pl: 1.5 }}>{`${DMISLevelDescription}`}</Typography><br />
                        {/* ============================================= END OF DMIS ========================================================== */}
                    </Box>
                    <Box textAlign='center'>
                        <Button variant="contained" onClick={handleSubmit} align='center'>
                            เพิ่มข้อมูลผู้ใช้
                        </Button>
                    </Box>
                </Card>
            </Container>
        </>
    );
}
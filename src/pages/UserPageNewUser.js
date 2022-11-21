import * as React from 'react';
import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, TextField, IconButton, InputAdornment, Card, Button } from '@mui/material';

export default function UserPageNewUser() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [positionName, setPositionName] = React.useState('');
    const [positionId, setPositionId] = React.useState('');
    const [positions, setPositions] = React.useState([]);
    const [levelDescription, setLevelDescription] = React.useState([]);
    const [levelId, setLevelId] = React.useState([]);
    const [levels, setLevels] = React.useState([]);

    useEffect(() => {

        fetch('http://localhost:5001/api/getpositions')
            .then((response) => response.json())
            .then((data) => {
                setPositions(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        fetch('http://localhost:5001/api/getlevels')
            .then((response) => response.json())
            .then((data) => {
                setLevels(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, []);

    const handleSubmit = () => {
        const jsonData = {
            personnel_id: document.getElementById('username').value,
            personnel_secret: document.getElementById('password').value,
            personnel_firstname: document.getElementById('firstname').value,
            personnel_lastname: document.getElementById('lastname').value,
            personnel_isactive: "1",
            position_id: positionId,
            level_id: levelId
        }

        console.log(`id : ${jsonData.personnel_id}`);
        console.log(`pass : ${jsonData.personnel_secret}`);
        console.log(`firstname : ${jsonData.personnel_firstname}`);
        console.log(`lastname : ${jsonData.personnel_lastname}`);
        console.log(`position id : ${jsonData.position_id}`);
        console.log(`level id : ${jsonData.level_id}`);

        if (jsonData.personnel_id === "" ||
            jsonData.personnel_secret === "" ||
            jsonData.personnel_firstname === "" ||
            jsonData.personnel_lastname === "" ||
            jsonData.position_id === "" ||
            jsonData.level_id === "") {

            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        if (jsonData.personnel_id.length !== 7) {
            alert('กรุณากรอกรหัสพนักงานให้ถูกต้อง');
            return;
        }

        fetch('http://localhost:5001/api/addpersonnel', {
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
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้')
            });
    };

    return (
        <>
            <Helmet>
                <title> New user | MIH Center </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    New User
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
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

                        {/* <div>{`level id: ${level_id !== null ? `'${level_id}'` : 'null'}`}</div><br /> */}
                        <Autocomplete
                            value={levelDescription}
                            onChange={(event, newValue) => {
                                setLevelDescription(newValue);
                                if (newValue !== null) {
                                    setLevelId(levels.find(o => o.level_description === newValue).level_id);
                                }
                                else {
                                    setLevelId("");
                                }
                            }}
                            id="controllable-states-levels-id"
                            options={Object.values(levels).map((option) => option.level_description)}
                            fullWidth
                            required
                            renderInput={(params) => <TextField {...params} label="ระดับการเข้าถึง" />}
                        />

                        <Button variant="contained" onClick={handleSubmit}>
                            เพิ่มข้อมูลผู้ใช้
                        </Button>
                    </Stack>
                </Card>
            </Container>
        </>
    );
}
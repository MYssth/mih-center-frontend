import * as React from 'react';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, TextField, Card, Button, Checkbox, Box, Divider, styled } from '@mui/material';

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
        borderColor: 'green'
    },
    '& input:invalid + fieldset': {
        borderColor: 'red'
    },
});

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

    const isSkip = (value) => value !== '';

    useEffect(() => {

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpositions`)
            .then((response) => response.json())
            .then((data) => {
                setPositions(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })

            .then(

                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getlevels`)
                    .then((response) => response.json())
                    .then((data) => {
                        setLevels(data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })

            ).then(

                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getlevelviews`)
                    .then((response) => response.json())
                    .then((data) => {
                        setLevelViews(data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })

            )

    }, []);

    const handleSubmit = () => {

        const levelList = [];
        const viewList = [];

        if (isDMIS) {
            if (DMISLevelId === "") {
                alert("กรุณาเลือกหน้าที่ของระบบแจ้งซ่อม");
                return;
            }
            if (DMISLevelViewId === "") {
                alert("กรุณาเลือกระดับการมองเห็นของระบบแจ้งซ่อม");
                return;
            }
            levelList.push(DMISLevelId);
            viewList.push(DMISLevelViewId);
        }

        if (isPMS) {
            if (PMSLevelId === "") {
                alert("กรุณาใส่หน้าที่ของจัดการข้อมูลบุคลากร");
                return;
            }
            levelList.push(PMSLevelId);
        }

        const jsonData = {
            personnel_id: document.getElementById('username').value,
            personnel_secret: document.getElementById('password').value,
            personnel_firstname: document.getElementById('firstname').value,
            personnel_lastname: document.getElementById('lastname').value,
            personnel_isactive: "1",
            position_id: positionId,
            level_list: levelList,
            view_list: viewList,
        };

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

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnCrudPort}/api/addpersonnel`, {
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
                else if (data.status === 'duplicate') {
                    alert('ชื่อผู้ใช้ซ้ำ ไม่สามารถเพิ่มข้อมูลผู้ใช้ได้');
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
            setDMISLevelViewId("");
            setDMISLevelViewName("");
            setDMISLevelViewDescription("");
        }

    }

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
                        <ValidationTextField required id="username" name="username" label="รหัสพนักงาน" inputProps={{ maxLength: 7 }} />
                        <ValidationTextField required id="password" name="password" label="รหัสผ่าน (วันเดือนปีเกิด)" />
                        <ValidationTextField required id="firstname" name="firstname" label="ชื่อ" />
                        <ValidationTextField required id="lastname" name="lastname" label="นามสกุล" />

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
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: positionName ? 'green' : 'red'
                                    }
                                }
                            }}
                        />

                    </Stack>

                    <Box spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>การเข้าถึงระบบ</Typography>

                        {/* =========================================== Personnel admin ======================================================== */}
                        <Checkbox onChange={handleChangePMS} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />ระบบจัดการข้อมูลบุคลากร
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
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: isPMS ? (PMSLevelName ? 'green' : 'red') : ''
                                    }
                                }
                            }}
                        />
                        <Typography sx={{ pl: 1.5 }}>{`${PMSLevelDescription}`}</Typography><br />
                        {/* ========================================= END OF Personnel admin ==================================================== */}

                        <Divider />

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
                            options={Object.values(levels).map((option) => option.mihapp_id === "DMIS" ? `${option.level_name}` : '').filter(isSkip)}
                            fullWidth
                            required
                            renderInput={(params) => <TextField {...params} label="หน้าที่ภายในระบบแจ้งซ่อม" />}
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: isDMIS ? (DMISLevelName ? 'green' : 'red') : ''
                                    }
                                }
                            }}
                        />
                        <Typography sx={{ pl: 1.5 }}>{`${DMISLevelDescription}`}</Typography><br />
                        <Autocomplete
                            disabled={!isDMIS}
                            value={DMISLevelViewName}
                            onChange={(event, newValue) => {
                                setDMISLevelViewName(newValue);
                                if (newValue !== null) {
                                    setDMISLevelViewId(levelViews.find(o => o.view_name === newValue).view_id);
                                    setDMISLevelViewDescription(`รายละเอียด: ${levelViews.find(o => o.view_name === newValue).view_description}`);
                                }
                                else {
                                    setDMISLevelViewId("");
                                    setDMISLevelViewDescription("");
                                }
                            }}
                            id="controllable-states-DMIS-level-views-id"
                            options={Object.values(levelViews).map((option) => option.mihapp_id === "DMIS" ? `${option.view_name}` : '').filter(isSkip)}
                            fullWidth
                            required
                            renderInput={(params) => <TextField {...params} label="ระดับการมองเห็นข้อมูลในระบบแจ้งซ่อม" />}
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: isDMIS ? (DMISLevelViewName ? 'green' : 'red') : ''
                                    }
                                }
                            }}
                        />
                        <Typography sx={{ pl: 1.5 }}>{`${DMISLevelViewDescription}`}</Typography><br />
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
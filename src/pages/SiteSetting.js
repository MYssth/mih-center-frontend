/* eslint-disable object-shorthand */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    Stack,
    TextField,
    Box,
    styled,
    Button,
} from '@mui/material';

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
        borderColor: 'green'
    },
    '& input:invalid + fieldset': {
        borderColor: 'red'
    },
});

const headSname = `${localStorage.getItem('sname')} Center`;

export default function SiteSetting() {

    const [imageUrl, setImageUrl] = useState(null);
    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/getsitesetting`)
            .then((response) => response.json())
            .then((data) => {
                setFname(data.fname);
                setSname(data.sname);
                if (data.logo !== null && data.logo !== undefined && data.logo !== "") {
                    setImageUrl(data.logo);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleImageChange = (e) => {

        if (e.target.files[0] === undefined) {
            return;
        }
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result);
        };

        reader.readAsDataURL(e.target.files[0]);

    }

    const handleEdit = () => {

        if (fname === "") {
            alert("กรุณากรอกชื่อเต็มโรงพยาบาล");
            return;
        }
        if (sname === "") {
            alert("กรุณากรอกชื่อย่อโรงพยาบาล");
            return;
        }

        const jsonData = {
            fname: fname,
            sname: sname,
            logo: imageUrl,
        };

        // console.log(`fname: ${jsonData.fname}`);
        // console.log(`sname: ${jsonData.sname}`);
        // console.log(`logo: ${jsonData.logo}`);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/updatesitesetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
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

    };

    return (
        <>
            <Helmet>
                <title> ตั้งค่า | {headSname} </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    ตั้งค่า
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Box spacing={2} sx={{ width: 'auto' }}>
                            <Typography variant='h5'>ตราสัญลักษณ์โรงพยาบาล</Typography>
                            {imageUrl ? <img src={imageUrl} alt={`ไม่มีตราสัญลักษณ์โรงพยาบาล`} height="100px" /> : `ไม่มีตราสัญลักษณ์โรงพยาบาล`}
                            <br />
                            <input id='signature' type="file" accept="image/*" onChange={handleImageChange} />
                        </Box>
                        <Typography variant='h5'>ข้อมูลโรงพยาบาล</Typography>
                        <ValidationTextField id="siteFName" name="siteFName" inputProps={{ maxLength: 50 }} value={fname} onChange={(event) => { setFname(event.target.value) }} label="ชื่อเต็มโรงพยาบาล" />
                        <ValidationTextField id="siteSName" name="siteSName" inputProps={{ maxLength: 5 }} value={sname} onChange={(event) => { setSname(event.target.value) }} label="ชื่อย่อโรงพยาบาล" />
                    </Stack>
                    <Button variant="contained" onClick={handleEdit}>แก้ไขข้อมูล</Button>
                </Card>
            </Container>
        </>
    );
}
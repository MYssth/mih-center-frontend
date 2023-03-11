import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    Stack,
    TextField,
    Box,

} from '@mui/material';

export default function SiteSetting() {

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
        if (e.target.files[0] === undefined) {
            setImageUrl("");
            return;
        }
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result);
        };

        reader.readAsDataURL(e.target.files[0]);

    }

    return (
        <>
            <Helmet>
                <title> ตั้งค่าเว็บไซต์ | MIH Center </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    ตั้งค่าเว็บไซต์
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Box spacing={2} sx={{ width: 'auto' }}>
                            <Typography variant='h5'>ตราสัญลักษณ์โรงพยาบาล</Typography>
                            {imageUrl ? <img src={imageUrl} alt={selectedImage.name} height="100px" /> : `ไม่มีตราสัญลักษณ์โรงพยาบาล`}
                            <br/>
                            <input id='signature' type="file" accept="image/*" onChange={handleImageChange} />
                        </Box>
                        <Typography variant='h5'>ข้อมูลโรงพยาบาล</Typography>
                        <TextField id="siteFName" name="siteFName" label="ชื่อเต็มโรงพยาบาล" />
                        <TextField id="siteSName" name="siteSName" label="ชื่อย่อโรงพยาบาล" />
                    </Stack>
                </Card>
            </Container>
        </>
    );
}
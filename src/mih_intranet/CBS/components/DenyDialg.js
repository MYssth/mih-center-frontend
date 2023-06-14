/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import CBSSubmtERR from './SubmtERR';
import CBSSubmtComp from './SubmtComp';

let token = "";

function CBSDenyDialg({ openDialg, onCloseDialg, data }) {

    const [id, setId] = useState('');
    const [submitComp, setSubmitComp] = useState(false);
    const [submitERR, setSubmitERR] = useState(false);


    useEffect(() => {

        token = jwtDecode(localStorage.getItem('token'));

    }, []);

    useEffect(() => {
        if (openDialg) {
            setId(data.id);
        }

    }, [openDialg]);

    const handleDeny = () => {
        const jsonData = {
            id: id,
            permit_pid: token.personnel_id,
        }

        // console.log(jsonData);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/denybook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    setSubmitComp(true);
                }
                else {
                    setSubmitERR(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้');
            });
    };

    return (
        <>
            <CBSSubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
            <CBSSubmtComp openDialg={submitComp} onCloseDialg={() => {
                setSubmitComp(false);
                onCloseDialg();
            }} />

            <Dialog
                open={openDialg}
                onClose={onCloseDialg}
            >
                <DialogTitle>
                    ปฏิเสธคำขอเลขที่ {data?.id}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant='subtitle1' textAlign={'center'} color={'error.main'} > คุณต้องการปฏิเสธคำขอใช้รถใช่หรือไม่</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeny} className="btn btn-danger">
                        ปฏิเสธคำขอใช้รถ
                    </Button>
                    <Button onClick={onCloseDialg}>ปิด</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CBSDenyDialg
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
    TextField,
    styled,
} from '@mui/material';
import {
    SubmtComp,
    SubmtERR,
    SubmtINC,
} from '../../../../components/dialogs/response';

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
        borderColor: 'green'
    },
    '& input:invalid + fieldset': {
        borderColor: 'red'
    },
});

let token = "";

function CBSDenyDialg({ openDialg, onCloseDialg, data }) {

    const [id, setId] = useState('');
    const [submitComp, setSubmitComp] = useState(false);
    const [submitERR, setSubmitERR] = useState(false);
    const [submitINC, setSubmitINC] = useState(false);


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
            note: document.getElementById('note').value,
        }

        if(!jsonData.note){
            setSubmitINC(true);
            return;
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
                setSubmitERR(true);
            });
    };

    return (
        <>
            <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
            <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
            <SubmtComp openDialg={submitComp} onCloseDialg={() => {
                setSubmitComp(false);
                onCloseDialg();
            }} />

            <Dialog
                open={openDialg}
                onClose={onCloseDialg}
            >
                <DialogTitle>
                    ยกเลิกคำขอเลขที่ {data?.id}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                        <Grid item xs={12}>
                            {/* <Typography variant='subtitle1' textAlign={'center'} color={'error.main'} > กรุณาระบุหมายเหตุการยกเลิก</Typography> */}
                            <Typography variant='subtitle1' > กรุณาระบุหมายเหตุการยกเลิก</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ValidationTextField
                            required
                                fullWidth
                                id="note"
                                name="note"
                                label="หมายเหตุการยกเลิก"
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeny} className="btn btn-danger">
                        ยกเลิกคำขอใช้รถ
                    </Button>
                    <Button onClick={onCloseDialg}>ปิด</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CBSDenyDialg
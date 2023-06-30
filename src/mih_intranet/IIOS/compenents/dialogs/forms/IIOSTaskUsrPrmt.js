import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Autocomplete,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    SubmtERR,
    SubmtINC,
} from '../../../../components/dialogs/response';

function IIOSTaskUsrPrmt({ openDialg, onCloseDialg, data, permitId }) {

    const [levelId, setLevelId] = useState('');
    const [statusIdRequest, setStatusIdRequest] = useState('');
    const [pChange, setPChange] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const [submitINC, setSubmitINC] = useState(false);
    const [submitERR, setSubmitERR] = useState(false);

    const isSkip = (value) => value !== '';

    useEffect(() => {
        if (openDialg) {
            // setTaskId(data.task_id);
            setLevelId(data.level_id);
            setStatusIdRequest(data.status_id_request);
            setPChange(data.status_id_request === 5 && data.category_id === 1);
            setCategoryId(data.category_id);
            setCategoryName(data.category_name);

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcategories/${data.level_id}`)
                .then((response) => response.json())
                .then((data) => {
                    setCategories(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [openDialg])

    const handlePermitTask = (permitCase) => {

        const jsonData = {
            task_id: data.task_id,
            level_id: data.level_id,
            permit_id: permitId,
            taskCase: permitCase,
        };

        // console.log(jsonData);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/processtask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    onCloseDialg();
                }
                else {
                    // alert('ไม่สามารถยืนยันการตรวจสอบงานได้');
                    setSubmitERR(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // alert('เกิดข้อผิดพลาดในการยืนยันตรวจสอบงาน');
                setSubmitERR(true);
            });
    }

    return (
        <>
            <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
            <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
            <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
                <DialogTitle>อนุมัติงานรออนุมัติแก้ไขโปรแกรม</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        คุณต้องการอนุมัติงานนี้ใช่หรือไม่
                    </DialogContentText>
                    <br />
                </DialogContent>
                <DialogActions>
                    <div style={{ flex: '1 0 0' }} />
                    <Button onClick={onCloseDialg}>ยกเลิก</Button>
                    <Button variant="contained" onClick={() => handlePermitTask("usrPermit")}>อนุมัติ</Button>
                    <Button variant="contained" color="error" onClick={() => handlePermitTask("reject")}>ไม่อนุมัติ</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default IIOSTaskUsrPrmt
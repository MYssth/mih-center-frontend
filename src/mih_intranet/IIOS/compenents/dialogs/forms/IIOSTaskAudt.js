/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
} from '@mui/material';

function IIOSTaskAudt({ openDialg, onCloseDialg, data, auditId }) {

    const [auditComment, setAuditComment] = useState('');

    useEffect(() => {
        if (openDialg) {
            setAuditComment(data.audit_comment);
        }
    }, [openDialg]);

    const handleAuditTaskComment = () => {

        const jsonData = {
            task_id: data.task_id,
            level_id: data.level_id,
            audit_comment: auditComment,
            taskCase: "comment",
        };

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
                    alert('ไม่สามารถบันทึกหมายเหตุการตรวจรับงานได้');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกหมายเหตุการตรวจรับงาน');
            });

    }

    const handleAuditTask = () => {

        const jsonData = {
            task_id: data.task_id,
            level_id: data.level_id,
            audit_id: auditId,
            status_id: data.status_id,
            audit_comment: auditComment,
            taskCase: "audit",
        };

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
                    alert('ไม่สามารถตรวจรับงานได้');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการตรวจรับงาน');
            });
    }

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
                <DialogTitle>ตรวจรับงาน</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        คุณต้องการตรวจรับงานนี้ใช่หรือไม่
                    </DialogContentText>
                    <TextField id="auditComment" name="auditComment"
                        value={auditComment === null ? "" : auditComment}
                        onChange={(event) => { setAuditComment(event.target.value) }}
                        fullWidth
                        sx={{ mt: 1 }}
                        label="หมายเหตุการตรวจรับ" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDialg} >ยกเลิก</Button>
                    <Button variant="contained" onClick={handleAuditTaskComment} >บันทึกหมายเหตุ</Button>
                    <Button variant="contained" onClick={handleAuditTask} >ยืนยันการตรวจรับงาน</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default IIOSTaskAudt
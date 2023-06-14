import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

function CBSSubmtComp({ openDialg, onCloseDialg }) {
    return (
        <>
            <Dialog
                open={openDialg}
                onClose={onCloseDialg}
            >
                <DialogTitle>
                    Success!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ดำเนินการเสร็จสิ้น
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDialg}>ปิด</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CBSSubmtComp
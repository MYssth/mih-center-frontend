/* eslint-disable import/no-unresolved */
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Box,
    styled,
} from '@mui/material';
import reportPDF from 'src/pages/DMIS/components/report-pdf';


const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
}));



export default function showDetail(task, open) {

    let focusTask = task;
    let focusTaskDialogOpen = open;

    // const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(true);
    // const [focusTask, setFocusTask] = useState(task);

    const handleCloseFocusTaskDialog = () => {
        focusTask = "";
        focusTaskDialogOpen = false;
    }

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={focusTaskDialogOpen} onClose={handleCloseFocusTaskDialog}>
                <DialogTitle>รายละเอียดงานแจ้งปัญหาออนไลน์</DialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.status_name}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>เลขที่เอกสาร:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_id}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>ประเภทงาน:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.level_id === "DMIS_IT" ? "IT" : (focusTask.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>วันที่แจ้ง:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_date_start ? (focusTask.task_date_start).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.issue_department_name}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_issue}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>Serial Number:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_serialnumber}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>รหัสทรัพย์สิน:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_device_id}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.informer_firstname} {focusTask.informer_lastname}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_phone_no}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>วันที่รับเรื่อง:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_date_accept ? (focusTask.task_date_accept).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>เวลาดำเนินงาน:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.estimation_name}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>ผู้รับเรื่อง:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.receiver_firstname} {focusTask.receiver_lastname}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>วันที่ดำเนินการล่าสุด:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_date_process ? (focusTask.task_date_process).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>ผู้รับผิดชอบ:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.operator_firstname} {focusTask.operator_lastname}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_note}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>วันที่เสร็จสิ้น:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_date_end ? (focusTask.task_date_end).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>รายละเอียดการแก้ไขปัญหา:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_solution}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusTask.task_cost}</Item>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFocusTaskDialog}>ปิดหน้าต่าง</Button>
                    <Button onClick={() => { reportPDF(focusTask) }}>ปริ้นเอกสาร</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
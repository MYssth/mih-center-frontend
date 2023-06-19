import * as React from 'react';
import {
    DataGrid,
    gridClasses,
    GridToolbar
} from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
    Stack,
    Typography,
    Divider,
    TextField,
    Button,
    alpha,
    styled,
    Box,
    Checkbox,
    Grid,
} from '@mui/material';
import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { IIOSTaskDetail } from './compenents/dialogs/taskdetails';

const dateFns = require('date-fns');

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}`]: {
        // backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));

const headSname = `${localStorage.getItem('sname')} Center`;

function IIOSReport() {

    const [open, setOpen] = useState(false);
    const [openTaskDetail, setOpenTaskDetail] = useState(false);
    const [focusTask, setFocusTask] = useState([]);

    const [fromDate, setFromDate] = useState('');
    // const [toDate, setToDate] = useState(dateFns.format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(new Date());
    const [taskList, setTaskList] = useState([]);
    const [completeTaskList, setCompleteTaskList] = useState([]);
    const [filterTaskList, setFilterTaskList] = useState([]);

    const [isIncomplete, setIsincomplete] = useState(false);
    const [mode, setMode] = useState("");

    const [pageSize, setPageSize] = useState(25);

    useEffect(() => {

        const controller = new AbortController();
        // eslint-disable-next-line prefer-destructuring
        const signal = controller.signal;
        const token = jwtDecode(localStorage.getItem('token'));

        for (let i = 0; i < token.level_list.length; i += 1) {
            if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT" ||
                token.level_list[i].level_id === "DMIS_USER" || token.level_list[i].level_id === "DMIS_MER" ||
                token.level_list[i].level_id === "DMIS_ENV" || token.level_list[i].level_id === "DMIS_HIT" ||
                token.level_list[i].level_id === "DMIS_ALL") {
                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getalltasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}`, { signal })
                    .then((response) => response.json())
                    .then((data) => {
                        setCompleteTaskList(data);
                        setFilterTaskList(data);
                    })
                    .catch((error) => {
                        if (error.name === "AbortError") {
                            console.log("cancelled")
                        }
                        else {
                            console.error('Error:', error);
                        }
                    });

                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/report`)
                    .then((response) => response.json())
                    .then((data) => {
                        setTaskList(data);
                    })
                    .catch((error) => {
                        if (error.name === "AbortError") {
                            console.log("cancelled")
                        }
                        else {
                            console.error('Error:', error);
                        }
                    });
                break;
            }
        }

        return () => {
            controller.abort();
        }

    }, []);

    const handleFindTaskId = () => {
        setMode("byId");
        if (isIncomplete) {
            setFilterTaskList(taskList.filter(dt => (dt.task_id).includes(document.getElementById('taskId').value)));
        }
        else {
            setFilterTaskList(completeTaskList.filter(dt => (dt.task_id).includes(document.getElementById('taskId').value)));
        }
    };

    const handleFindDate = () => {
        setMode("byDate");
        const tmpFromDate = dateFns.format(fromDate, 'yyyy-MM-dd');
        if (isIncomplete) {
            setFilterTaskList(taskList.filter(dt => dt.task_date_start >= tmpFromDate && dt.task_date_start <= dateFns.format(dateFns.addDays(new Date(toDate), 1), 'yyyy-MM-dd')));
        }
        else {
            setFilterTaskList(completeTaskList.filter(dt => dt.task_date_start >= tmpFromDate && dt.task_date_start <= dateFns.format(dateFns.addDays(new Date(toDate), 1), 'yyyy-MM-dd')));
        }

    }

    const handleOnlyIncomplete = (event) => {
        const tmpFromDate = dateFns.format(fromDate, 'yyyy-MM-dd')
        if (event.target.checked) {
            setIsincomplete(true);
            if (mode === "byId") {
                setFilterTaskList(taskList.filter(dt => (dt.task_id).includes(document.getElementById('taskId').value)));
            }
            else if (mode === "byDate") {
                setFilterTaskList(taskList.filter(dt => dt.task_date_start >= tmpFromDate && dt.task_date_start <= dateFns.format(dateFns.addDays(new Date(toDate), 1), 'yyyy-MM-dd')));
            }
            else {
                setFilterTaskList(taskList);
            }
        }
        else {
            setIsincomplete(false);
            if (mode === "byId") {
                setFilterTaskList(completeTaskList.filter(dt => (dt.task_id).includes(document.getElementById('taskId').value)));
            }
            else if (mode === "byDate") {
                setFilterTaskList(completeTaskList.filter(dt => dt.task_date_start >= tmpFromDate && dt.task_date_start <= dateFns.format(dateFns.addDays(new Date(toDate), 1), 'yyyy-MM-dd')));
            }
            else {
                setFilterTaskList(completeTaskList);
            }
        }
    }

    const columns = [
        {
            field: 'action',
            disableExport: true,
            headerName: '',
            width: 90,
            sortable: false,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    // reportPDF(params.row);
                    setFocusTask(params.row);
                    setOpenTaskDetail(true);
                };

                return <Button variant="contained" onClick={onClick}>ปริ้น</Button>;
            },
        },
        {
            field: 'id',
            headerName: 'id',
            width: 50,
        },
        {
            field: 'no',
            headerName: 'ลำดับที่',
            width: 50,
            sortable: false,
            valueGetter: (index) =>
                index.api.getRowIndex(index.row.id) + 1,
        },
        {
            field: 'task_id',
            headerName: 'เลขที่เอกสาร',
            width: 100,
        },
        {
            field: 'level_id',
            headerName: 'ประเภทงาน',
            width: 100,
            valueGetter: (params) =>
                `${params.row.level_id === "DMIS_IT" ? "IT" : (params.row.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}`,
        },
        {
            field: 'informer_firstname',
            headerName: 'ผู้แจ้ง',
            width: 100,
            valueGetter: (params) =>
                `${(params.row.informer_firstname)} ${(params.row.informer_lastname)}`,
        },
        {
            field: 'issue_department_name',
            headerName: 'แผนกที่แจ้งปัญหา',
            width: 110,
        },
        {
            field: 'task_issue',
            headerName: 'รายละเอียดของปัญหา',
            width: 200,
        },
        {
            field: 'task_device_id',
            headerName: 'รหัสทรัพย์สิน',
            width: 110,
        },
        {
            field: 'task_solution',
            headerName: 'รายละเอียดการแก้ปัญหา',
            width: 200,
        },
        {
            field: 'task_date_start',
            headerName: 'วันที่แจ้งปัญหา',
            width: 120,
            valueGetter: (params) =>
                `${(params.row.task_date_start).replace("T", " ").replace(".000Z", " น.")}`,
        },
        {
            field: 'task_date_accept',
            headerName: 'วันที่รับเรื่อง',
            width: 120,
            valueGetter: (params) =>
                `${(params.row.task_date_accept).replace("T", " ").replace(".000Z", " น.")}`,
        },
        {
            field: 'task_date_process',
            headerName: 'วันที่ดำเนินการล่าสุด',
            width: 120,
            valueGetter: (params) =>
                `${(params.row.task_date_process).replace("T", " ").replace(".000Z", " น.")}`,
        },
        {
            field: 'task_date_end',
            headerName: 'วันที่เสร็จสิ้น',
            width: 120,
            valueGetter: (params) =>
                `${params.row.task_date_end === null ? "" : (params.row.task_date_end).replace("T", " ").replace(".000Z", " น.")}`,
        },
        {
            field: 'status_name',
            headerName: 'สถานะ',
            width: 125,
            valueGetter: (params) =>
                `${(params.row.task_iscomplete === null || params.row.task_iscomplete === "") ? params.row.status_id_request === null || params.row.status_id_request === "" ? params.row.status_name : `${params.row.status_name} (รออนุมัติ)` : params.row.status_id === 5 || params.row.status_id === 0 ? params.row.status_name : params.row.status_id === 3 ? `ดำเนินการเสร็จสิ้น (เปลี่ยนอะไหล่)` : `ดำเนินการเสร็จสิ้น (${params.row.status_name})`}`,
        },
        {
            field: 'receiver_firstname',
            headerName: 'ผู้รับเรื่อง',
            width: 100,
            valueGetter: (params) =>
                `${params.row.receiver_firstname === null || params.row.receiver_firstname === "" ? "" : `${params.row.receiver_firstname} ${params.row.receiver_lastname}`}`,
        },
        {
            field: 'operator_firstname',
            headerName: 'ผู้รับผิดชอบ',
            width: 100,
            valueGetter: (params) =>
                `${params.row.operator_firstname === null || params.row.operator_firstname === "" ? "" : `${params.row.operator_firstname} ${params.row.operator_lastname}`}`,
        },
        {
            field: 'estimation_name',
            headerName: 'เวลาดำเนินงาน',
            width: 120,
        },
        {
            field: 'task_cost',
            headerName: 'งบประมาณที่ใช้',
            width: 120,
            valueGetter: (params) =>
                `${params.row.task_cost === null || params.row.task_cost === "" ? "0" : params.row.task_cost}`,
        },
        {
            field: 'task_serialnumber',
            headerName: 'serialnumber',
            width: 110,
        },
        {
            field: 'task_phone_no',
            headerName: 'เบอร์โทรติดต่อ',
            width: 110,
        },
        {
            field: 'task_note',
            headerName: 'หมายเหตุ',
            width: 150,
        },
        {
            field: 'category_name',
            headerName: 'หมวดหมู่งาน',
            width: 100,
        },
    ];

    return (
        <>
            <Helmet>
                <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
            </Helmet>

            <MainHeader onOpenNav={() => setOpen(true)} />
            <IIOSSidebar name="report" openNav={open} onCloseNav={() => setOpen(false)} />

            <IIOSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>รายงาน</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item my-2">
                                <a href="/intranet">หน้าหลัก</a>
                            </li>
                            <li className="breadcrumb-item my-2">
                                <a href="/iiosuserdashboard">หน้าหลักระบบแจ้งปัญหา</a>
                            </li>
                            <li className="breadcrumb-item my-2">รายงาน</li>
                        </ol>
                    </nav>
                </div>

                {/* <!-- End Page Title --> */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    <Stack direction="row" spacing={10} sx={{ width: 'auto', p: 2 }}>
                                        <Box>
                                            <Typography variant='h5'>ค้นหาตามเลขที่เอกสาร</Typography>
                                            <Stack direction="row" spacing={1}>
                                                <TextField id="taskId" name="taskId" label="เลขที่ใบงาน" />
                                                <Button variant="contained" sx={{ width: 100 }} onClick={handleFindTaskId} >ค้นหา</Button>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Typography variant='h5'>ค้นหาตามวันเวลาที่แจ้งปัญหา</Typography>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack direction="row" spacing={1}>
                                                    <DatePicker
                                                        disableFuture
                                                        format="dd-MM-yyyy"
                                                        maxDate={toDate}
                                                        label="จากวันที่"
                                                        value={fromDate}
                                                        onChange={(newValue) => {
                                                            setFromDate(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    <DatePicker
                                                        disableFuture
                                                        format="dd-MM-yyyy"
                                                        minDate={fromDate}
                                                        label="ถึงวันที่"
                                                        value={toDate}
                                                        onChange={(newValue) => {
                                                            setToDate(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    <Button variant="contained" onClick={handleFindDate} sx={{ width: 100 }}>ค้นหา</Button>
                                                </Stack>
                                            </LocalizationProvider>
                                        </Box>
                                    </Stack>
                                    <Divider />
                                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                                        <Grid container>
                                            <Grid item sm={12} md={9.5}>
                                                <Typography variant='h5'>รายการงานแจ้งปัญหาออนไลน์</Typography>
                                            </Grid>
                                            <Grid item sm={12} md={2.5} >
                                                <Box>
                                                    <Checkbox onChange={handleOnlyIncomplete} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />ซ่อนงานที่ดำเนินการเสร็จสิ้น
                                                </Box>
                                            </Grid>

                                        </Grid>
                                        <div style={{ width: '100%' }}>
                                            <StripedDataGrid
                                                getRowClassName={(params) =>
                                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                                }
                                                autoHeight
                                                getRowHeight={() => 'auto'}
                                                sx={{
                                                    [`& .${gridClasses.cell}`]: {
                                                        py: 1,
                                                    },
                                                }}
                                                disableSelectionOnClick
                                                columns={columns}
                                                rows={filterTaskList}
                                                pageSize={pageSize}
                                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                components={{
                                                    Toolbar: GridToolbar,
                                                    // Toolbar: CustomToolbar,
                                                }}
                                                initialState={{
                                                    columns: {
                                                        columnVisibilityModel: {
                                                            // Hide columns status and traderName, the other columns will remain visible
                                                            id: false,
                                                            task_cost: false,
                                                            task_date_accept: false,
                                                            task_date_process: false,
                                                            task_serialnumber: false,
                                                            receiver_firstname: false,
                                                            task_phone_no: false,
                                                        },
                                                    },
                                                }}
                                                componentsProps={{
                                                    toolbar: {
                                                        csvOptions: { utf8WithBom: true, },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

export default IIOSReport
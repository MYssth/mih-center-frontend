import { Helmet } from 'react-helmet-async';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// @mui
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
    styled,
    alpha,
    Box,
    Button,
} from '@mui/material';
import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { IIOSTaskDetail } from './compenents/dialogs/taskdetails';
import { IIOSTaskUsrPrmt } from './compenents/dialogs/forms';

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

function QuickSearchToolbar() {
    return (
        <Box
            sx={{
                p: 0.5,
                pb: 0,
            }}
        >
            <GridToolbarQuickFilter />
            <Button variant="outlined" sx={{ ml: 1 }} startIcon={<Icon icon="ic:baseline-refresh" width="24" height="24" />} onClick={() => { window.location.reload(false); }} >แสดงทั้งหมด</Button>
        </Box>
    );
}

let tokenData = "";
let pid = "";

const headSname = `${localStorage.getItem('sname')} Center`;

function IIOSUsrPermit() {

    const columns = [
        {
            field: 'action',
            disableExport: true,
            headerName: '',
            minWidth: 120,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const onClick = () => {
                    setFocusTask(params.row);
                    setOpenTaskPrmt(true);
                    // return alert(`you choose level = ${params.row.level_id}`);
                };

                return <Button variant="contained" onClick={onClick}>ดำเนินการ</Button>;
            },
        },
        {
            field: 'id',
            headerName: 'ลำดับที่',
            minWidth: 50,
            flex: 1,
        },
        {
            field: 'task_id',
            headerName: 'เลขที่เอกสาร',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'level_id',
            headerName: 'ประเภทงาน',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) =>
                `${params.row.level_id === "DMIS_IT" ? "IT" : (params.row.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}`,
        },
        {
            field: 'task_issue',
            headerName: 'ปัญหา',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'task_note',
            headerName: 'หมายเหตุ',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'issue_department_name',
            headerName: 'แผนก',
            minWidth: 130,
            flex: 1,
        },
        {
            field: 'informer_firstname',
            headerName: 'ผู้แจ้ง',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'task_date_start',
            headerName: 'วันที่แจ้ง',
            minWidth: 110,
            flex: 1.1,
            valueGetter: (params) =>
                `${(params.row.task_date_start).replace("T", " ").replace(".000Z", " น.")}`,
        },
        {
            field: 'operator_firstname',
            headerName: 'ผู้รับผิดชอบ',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'task_device_id',
            headerName: 'รหัสทรัพย์สิน',
            width: 150,
        },

    ];

    const [pageSize, setPageSize] = useState(10);
    const [permitTaskList, setPermitTaskList] = useState([]);
    const [focusTask, setFocusTask] = useState('');
    const [permitId, setPermitId] = useState('');
    const [open, setOpen] = useState(false);
    const [openTaskDetail, setOpenTaskDetail] = useState(false);
    const [openTaskPrmt, setOpenTaskPrmt] = useState(false);

    useEffect(() => {

        const token = jwtDecode(localStorage.getItem('token'));
        setPermitId(token.personnel_id);
        pid = token.personnel_id;
        for (let i = 0; i < token.level_list.length; i += 1) {
            if (token.level_list[i].mihapp_id === "DMIS") {
                tokenData = token.level_list[i];
                refreshTable();
                break;
            }
        }
    }, []);

    function refreshTable() {
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getusrprmttasklist/${pid}/${tokenData.view_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPermitTaskList(data);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            });
    }

    return (
        <>
            <Helmet>
                <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
            </Helmet>

            <MainHeader onOpenNav={() => setOpen(true)} />
            <IIOSSidebar name="usrpermit" openNav={open} onCloseNav={() => setOpen(false)} />

            <IIOSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

            <IIOSTaskUsrPrmt
                openDialg={openTaskPrmt}
                onCloseDialg={() => {
                    setOpenTaskPrmt(false);
                    refreshTable();
                }}
                data={focusTask}
                permitId={permitId}
            />

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>งานรออนุมัติแก้ไขโปรแกรม</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item my-2">
                                <a href="/intranet">หน้าหลัก</a>
                            </li>
                            <li className="breadcrumb-item my-2">
                                <a href="/iiosuserdashboard">หน้าหลักระบบแจ้งปัญหา</a>
                            </li>
                            <li className="breadcrumb-item my-2">งานรออนุมัติแก้ไขโปรแกรม</li>
                        </ol>
                    </nav>
                </div>

                {/* <!-- End Page Title --> */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    <div style={{ display: 'flex', height: '100%' }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <StripedDataGrid
                                                autoHeight
                                                getRowHeight={() => 'auto'}
                                                sx={{
                                                    [`& .${gridClasses.cell}`]: {
                                                        py: 1,
                                                    },
                                                }}
                                                columns={columns}
                                                rows={permitTaskList}
                                                pageSize={pageSize}
                                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                rowsPerPageOptions={[10, 25, 100]}
                                                onCellDoubleClick={(params) => {
                                                    setFocusTask(params.row);
                                                    setOpenTaskDetail(true);
                                                }}
                                                hideFooterSelectedRowCount
                                                initialState={{
                                                    columns: {
                                                        columnVisibilityModel: {
                                                            // Hide columns status and traderName, the other columns will remain visible
                                                            id: false,
                                                            task_device_id: false,
                                                        },
                                                    },
                                                }}
                                                components={{ Toolbar: QuickSearchToolbar }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

export default IIOSUsrPermit
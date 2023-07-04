/* eslint-disable object-shorthand */
/* eslint-disable import/extensions */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
    styled,
    alpha,
} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import 'moment/locale/th'
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

export default function CBSDashboard() {

    const columns = [
        {
            field: 'from_time',
            headerName: 'เวลาไป',
            flex: 1,
            minWidth: 60,
            valueGetter: (params) =>
                `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(new Date(params.row.from_date).getUTCMinutes()).padStart(2, '0')}`
        },
        {
            field: 'to_time',
            headerName: 'เวลากลับ',
            flex: 1,
            minWidth: 60,
            valueGetter: (params) =>
                `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(new Date(params.row.to_date).getUTCMinutes()).padStart(2, '0')}`
        },
        {
            field: 'place',
            headerName: 'สถานที่',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'car_reg_no',
            headerName: 'ทะเบียนรถ',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'status_id',
            headerName: 'สถานะ',
            flex: 1,
            minWidth: 70,
            renderCell: (params) => (
                params.row.status_id === 1 ?
                    <span className="badge rounded-pill bg-danger">ขอใช้รถ</span>
                    : params.row.status_id === 2 ?
                        <span className="badge rounded-pill bg-warning">รออนุมัติ</span>
                        : params.row.status_id === 3 ?
                            <span className="badge rounded-pill bg-success">อนุมัติ</span>
                            : params.row.status_id === 4 ?
                                <span className="badge rounded-pill bg-primary">เสร็จสิ้น</span>
                                : <span className="badge rounded-pill bg-secondary">ยกเลิก</span>
            ),
        },

    ];

    const localizer = momentLocalizer(moment);

    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);

    const [sched, setSched] = useState([]);
    const [statCntr, setStatCntr] = useState({});

    useEffect(() => {

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getallschedtoday`)
            .then((response) => response.json())
            .then((data) => {
                setSched(data);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            });

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getstatcntr`)
            .then((response) => response.json())
            .then((data) => {
                setStatCntr(data);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            });

    }, []);

    return (
        <>
            <Helmet>
                <title> ระบบขอใช้รถ | {headSname} </title>
            </Helmet>

            <div>
                <MainHeader onOpenNav={() => setOpen(true)} />
                <CBSSidebar name="dashboard" openNav={open} onCloseNav={() => setOpen(false)} />
                {/* <!-- ======= Main ======= --> */}
                <main id="main" className="main">
                    <div className="pagetitle">
                        <h1>หน้าหลักระบบขอใช้รถ - Car Booking Service (CBS) version: {process.env.REACT_APP_CBS_version ? `v${process.env.REACT_APP_CBS_version}` : `Unknown`}</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item my-2">
                                    <a href="../mih-intranet.html">หน้าหลัก</a>
                                </li>
                                <li className="breadcrumb-item my-2">หน้าหลักระบบขอใช้รถ</li>
                            </ol>
                        </nav>
                    </div>
                    {/* <!-- End Page Title --> */}
                    <section className="section dashboard">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-xxl-3 col-md-6">
                                        <a className="nav-link collapsed" href="/cbspermitreq">
                                            <div className="card info-card request-card">
                                                <div className="card-body">
                                                    <h2 className="card-title">ขอใช้รถ | Request</h2>

                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="bi bi-chat-left-text" />
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-end justify-content-end"
                                                            style={{ "width": "100%" }}
                                                        >
                                                            <h1>{statCntr.request}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <a className="nav-link collapsed" href="/cbspermit">
                                            <div className="card info-card waitapprov-card">
                                                <div className="card-body">
                                                    <h2 className="card-title">รออนุมัติ | Wait Approve</h2>

                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="bi bi-journal-text" />
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-end justify-content-end"
                                                            style={{ "width": "100%" }}
                                                        >
                                                            <h1>{statCntr.permitRep}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <a className="nav-link collapsed" href="/cbsuserec">
                                            <div className="card info-card approv-card">
                                                <div className="card-body">
                                                    <h2 className="card-title">อนุมัติ | Approve</h2>

                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="bi bi-journal-check" />
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-end justify-content-end"
                                                            style={{ "width": "100%" }}
                                                        >
                                                            <h1>{statCntr.permit}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="card info-card total-card">
                                            <div className="card-body">
                                                <h2 className="card-title">จำนวนรถทั้งหมด | Total</h2>

                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i className="bi bi-car-front" />
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-end justify-content-end"
                                                        style={{ "width": "100%" }}
                                                    >
                                                        <h1>{statCntr.car_amt}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="carlendar">
                                        <div>
                                            <Calendar
                                                localizer={localizer}
                                                // events={myEventsList}
                                                startAccessor="start"
                                                endAccessor="end"
                                                style={{ height: 500 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">รายการขอใช้รถ | Today</h5>

                                        {/* <!-- Table with hoverable rows --> */}

                                        <StripedDataGrid
                                            autoHeight
                                            getRowHeight={() => 'auto'}
                                            sx={{
                                                [`& .${gridClasses.cell}`]: {
                                                    py: 1,
                                                },
                                            }}
                                            columns={columns}
                                            rows={sched}
                                            pageSize={pageSize}
                                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                            rowsPerPageOptions={[10, 25, 100]}
                                            hideFooterPagination
                                            hideFooterSelectedRowCount
                                            // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                                            // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                                            initialState={{
                                                columns: {
                                                    columnVisibilityModel: {
                                                        // Hide columns status and traderName, the other columns will remain visible
                                                        // id: false,
                                                    },
                                                },
                                            }}
                                        // components={{ Toolbar: QuickSearchToolbar }}
                                        />
                                        {/* <!-- End Table with hoverable rows --> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

        </>
    );
}
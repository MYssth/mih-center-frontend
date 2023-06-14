/* eslint-disable import/extensions */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
    styled,
    alpha,
} from '@mui/material';
import MainHeader from '../layouts/MainHeader';
import CBSSidebar from './components/Sidebar';

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
            field: 'id',
            headerName: 'เลขที่',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'from_date',
            headerName: 'วันที่ไป',
            flex: 1,
            minWidth: 100,
            valueGetter: (params) =>
                `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,

        },
        {
            field: 'from_time',
            headerName: 'เวลาไป',
            flex: 1,
            minWidth: 60,
            valueGetter: (params) =>
                `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(new Date(params.row.from_date).getUTCMinutes()).padStart(2, '0')}`
        },
        {
            field: 'to_date',
            headerName: 'วันที่กลับ',
            flex: 1,
            minWidth: 100,
            valueGetter: (params) =>
                `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,

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
            field: 'car_type_name',
            headerName: 'ประเภทรถ',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'place',
            headerName: 'สถานที่',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'is_permit',
            headerName: 'สถานะ',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                params.row.is_permit === null ?
                    <span className="badge rounded-pill bg-warning">รออนุมัติ</span>
                    : params.row.is_permit ?
                        <span className="badge rounded-pill bg-success">อนุมัติ</span>
                        : <span className="badge rounded-pill bg-danger">ไม่อนุมัติ</span>
            ),
        },

    ];

    const [open, setOpen] = useState(false);

    const [sched, setSched] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getallsched`)
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

    }, []);

    return (
        <>
            <Helmet>
                <title> ข้อมูลผู้ใช้ | {headSname} </title>
            </Helmet>

            <div>
                <MainHeader onOpenNav={() => setOpen(true)} />
                <CBSSidebar name="dashboard" openNav={open} onCloseNav={() => setOpen(false)} />
                {/* <!-- ======= Main ======= --> */}
                <main id="main" className="main">
                    <div className="pagetitle">
                        <h1>หน้าหลักระบบขอใช้รถ</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item my-2">
                                    <a href="/intranet">หน้าหลัก</a>
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
                                        <div className="card info-card sales-card">
                                            <div className="card-body">
                                                <h2 className="card-title">รายการขอใช้รถวันนี้</h2>

                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i className="bi bi-car-front" />
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-end justify-content-end"
                                                    // style="width: 100%"
                                                    >
                                                        <h1>8</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="card info-card sales-card">
                                            <div className="card-body">
                                                <h2 className="card-title">อนุมัติ</h2>

                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i className="bi bi-car-front" />
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-end justify-content-end"
                                                    // style="width: 100%"
                                                    >
                                                        <h1>2</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="card info-card sales-card">
                                            <div className="card-body">
                                                <h2 className="card-title">รออนุมัติ</h2>

                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i className="bi bi-car-front" />
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-end justify-content-end"
                                                    // style="width: 100%"
                                                    >
                                                        <h1>6</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="card info-card sales-card">
                                            <div className="card-body">
                                                <h2 className="card-title">จำนวนรถทั้งหมด</h2>

                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                                                    >
                                                        <i className="bi bi-car-front" />
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-end justify-content-end"
                                                    // style="width: 100%"
                                                    >
                                                        <h1>20</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">รายการขอใช้รถ | Today</h5>

                                        {/* <!-- Table with stripped rows --> */}
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
                                        {/* <!-- End Table with stripped rows --> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" />
                    </section>
                </main>
            </div>

        </>
    );
}
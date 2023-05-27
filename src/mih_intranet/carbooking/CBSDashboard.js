/* eslint-disable import/extensions */
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import MainHeader from '../component/MainHeader';
import CBSSidebar from './component/CBSSidebar';

const headSname = `${localStorage.getItem('sname')} Center`;

export default function CBSDashboard() {
    const [open, setOpen] = useState(false);

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
                                        <table className="table datatable">
                                            <thead>
                                                <tr>
                                                    <th scope="col">วันที่</th>
                                                    <th scope="col">เวลา</th>
                                                    <th scope="col">ประเภทรถ</th>
                                                    <th scope="col">สถานที่</th>
                                                    <th scope="col">แผนก</th>
                                                    <th scope="col">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">31/03/2566</th>
                                                    <td>15.00 - 16.00</td>
                                                    <td>รถกระบะ</td>

                                                    <td>ห้องปฏิบัติการ</td>
                                                    <td>ส่ง LAB บขส</td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-primary"
                                                        >อนุมัติ</span
                                                        >
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">31/03/2566</th>
                                                    <td>15.00 - 16.00</td>
                                                    <td>รถกระบะ</td>

                                                    <td>ห้องปฏิบัติการ</td>
                                                    <td>ส่ง LAB บขส</td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-warning"
                                                        >รออนุมัติ</span
                                                        ><i className="bi bi-pencil-square ms-3" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">31/03/2566</th>
                                                    <td>15.00 - 16.00</td>
                                                    <td>รถกระบะ</td>

                                                    <td>ห้องปฏิบัติการ</td>
                                                    <td>ส่ง LAB บขส</td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-warning"
                                                        >รออนุมัติ</span
                                                        >
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">31/03/2566</th>
                                                    <td>15.00 - 16.00</td>
                                                    <td>รถกระบะ</td>

                                                    <td>ห้องปฏิบัติการ</td>
                                                    <td>ส่ง LAB บขส</td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-warning"
                                                        >รออนุมัติ</span
                                                        >
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">31/03/2566</th>
                                                    <td>15.00 - 16.00</td>
                                                    <td>รถกระบะ</td>

                                                    <td>ห้องปฏิบัติการ</td>
                                                    <td>ส่ง LAB บขส</td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-warning"
                                                        >รออนุมัติ</span
                                                        >
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
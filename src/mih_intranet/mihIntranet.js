import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import MainHeader from './component/MainHeader';
import MainSidebar from './component/MainSidebar';

const headSname = `${localStorage.getItem('sname')} Center`;

export default function MIHIntranet() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title> หน้าระบบภายในใหม่ | {headSname} </title>
            </Helmet>

            <div>
                <MainHeader onOpenNav={() => setOpen(true)} />
                <MainSidebar openNav={open} onCloseNav={() => setOpen(false)} />
                {/* <!-- ======= Main ======= --> */}
                <main id="main" className="main">
                    <section className="section dashboard">
                        <div className="row">
                            {/* <!-- Left side columns --> */}
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card recent-sales">
                                            <div className="card-body">
                                                <h5 className="card-title">ประกาศ / ใบสื่อสารองค์กรภายใน</h5>

                                                <table className="table table-borderless table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">ประเภท</th>
                                                            <th scope="col">เลขที่</th>
                                                            <th scope="col">เรื่อง</th>
                                                            <th scope="col">วันที่</th>
                                                            <th scope="col">ฝ่าย</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row" className="badge bg-primary">
                                                                <i className="bi bi-bookmark me-1" />ประกาศ
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td>
                                                                <a href="#">เรื่องประกาศ</a>
                                                            </td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>บริหาร</td>
                                                        </tr>
                                                        <tr />
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="badge bg-primary">
                                                                <i className="bi bi-bookmark me-1" />ประกาศ
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">เรื่องประกาศ</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>บริหาร</td>
                                                        </tr>
                                                        <tr />
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="badge bg-success">
                                                                <i className="bi bi-bookmark me-1" />ใบสื่อสารองค์กร
                                                            </th>
                                                            <td>001/2566</td>
                                                            <td><a href="#">ใบสื่อสารองค์กร</a></td>
                                                            <td>01 เม.ย. 2566</td>
                                                            <td>เทคโนโลยีสารสนเทศ</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">ข่าวสาร และกิจกรรม</h5>
                                                <div className="news">
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                    <div className="post-item clearfix mb-5">
                                                        <img src="assets/img/news-1.jpg" alt="" />
                                                        <h4>
                                                            <a href="#">Nihil blanditiis at in nihil autem</a>
                                                        </h4>
                                                        <p>
                                                            Sit recusandae non aspernatur laboriosam. Quia enim
                                                            eligendi sed ut harum...
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Right side columns --> */}
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body pb-5">
                                        <h5 className="card-title">
                                            รายการขอใช้ห้องประชุม <span>| ToDay</span>
                                        </h5>
                                        <div className="activity">
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">11.00 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">13.30 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body pb-5">
                                        <h5 className="card-title">รายการขอใช้รถ <span>| ToDay</span></h5>
                                        <div className="activity">
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">11.00 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ไปร้านขายยาอิสานโอสถ</div>
                                            </div>
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">13.30 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ไปยโสธร</div>
                                            </div>
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">16.30 น.</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">ไปส่ง LAB</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body pb-5">
                                        <h5 className="card-title">
                                            ปฏิทินกิจกรรม <span>| This Month</span>
                                        </h5>

                                        <div className="activity">
                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                                                <div className="activity-content">คลีนนิ่งเดย์ ประจำเดือน</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-danger align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-primary align-self-start" />
                                                <div className="activity-content">
                                                    ประชุมคณะกรรมการความเสี่ยง
                                                </div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activite-label">01 เม.ย. 2566</div>
                                                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                                                <div className="activity-content">ประชุมเตรียมความพร้อม</div>
                                            </div>
                                        </div>
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
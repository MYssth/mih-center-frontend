import { Helmet } from 'react-helmet-async';
import MainHeader from './components/MainHeader';

const headSname = `${localStorage.getItem('sname')} Center`;

export default function mihIntranet() {

    return (
        <>
            <Helmet>
                <title> ข้อมูลผู้ใช้ | {headSname} </title>
            </Helmet>

            <div>
                <MainHeader />
                {/* <!-- ======= Sidebar ======= --> */}
                <aside id="sidebar" className="sidebar">
                    <ul className="sidebar-nav" id="sidebar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="mih-intranet.html">
                                <i className="bi bi-house" />
                                <span>หน้าหลัก</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-tools" />
                                <span>ระบบแจ้งปัญหา/แจ้งซ่อม</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-people" />
                                <span>ระบบขอใช้ห้องประชุม</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-car-front" />
                                <span>ระบบขอใช้รถ</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-graph-up" />
                                <span>ระบบบริหารความเสี่ยง</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-book" />
                                <span>การจัดการความรู้</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-calendar3" />
                                <span>ตารางการทำงานแพทย์</span>
                            </a>
                        </li>
                        <li className="nav-heading">เอกสารเผยแพร่</li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-bookmark" />
                                <span>ประกาศ</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#">
                                <i className="bi bi-file-earmark-text" />
                                <span>ใบสื่อสารองค์กรภายใน</span>
                            </a>
                        </li>
                        <li className="nav-heading">Download</li>
                        <li className="nav-item">
                            <a
                                className="nav-link collapsed"
                                data-bs-target="#hims-manual-nav"
                                data-bs-toggle="collapse"
                                href="#"
                            >
                                <i className="bi bi-journal-text" />
                                <span>คู่มือการใช้งานระบบ HIMS</span
                                ><i className="bi bi-chevron-down ms-auto" />
                            </a>
                            <ul
                                id="hims-manual-nav"
                                className="nav-content collapse"
                                data-bs-parent="#sidebar-nav"
                            >
                                <li>
                                    <a href="#">
                                        <i className="bi bi-circle" /><span>Front Office</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="bi bi-circle" /><span>Back Office</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link collapsed"
                                data-bs-target="#form-nav"
                                data-bs-toggle="collapse"
                                href="#"
                            >
                                <i className="bi bi-file-pdf" /><span>แบบฟอร์ม</span
                                ><i className="bi bi-chevron-down ms-auto" />
                            </a>
                            <ul
                                id="form-nav"
                                className="nav-content collapse"
                                data-bs-parent="#sidebar-nav"
                            >
                                <li>
                                    <a href="#">
                                        <i className="bi bi-circle" /><span>ฝ่ายเทคโนโลยีสารสนเทศ</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="bi bi-circle" /><span>ฝ่ายการพยาบาล</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="bi bi-circle" /><span>ฝ่ายเทคนิคบริการ</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
                {/* <!-- ======= Main ======= --> */}
                <main id="main" className="main">
                    <section className="section profile">
                        <div className="row">
                            <div className="col-xl-4">
                                <div className="card">
                                    <div
                                        className="card-body profile-card pt-4 d-flex flex-column align-items-center"
                                    >
                                        <img
                                            src="assets/img/user profile.webp"
                                            alt="Profile"
                                            className="rounded-circle"
                                        />
                                        <h2>Karnanan Purimanuruk</h2>
                                        <h3>Information Technology Dep.</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-8">
                                <div className="card">
                                    <div className="card-body pt-3">
                                        {/* <!-- Bordered Tabs --> */}
                                        <ul className="nav nav-tabs nav-tabs-bordered">
                                            <li className="nav-item">
                                                <button
                                                    className="nav-link active"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-overview"
                                                >
                                                    Overview
                                                </button>
                                            </li>

                                            <li className="nav-item">
                                                <button
                                                    className="nav-link"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-edit"
                                                >
                                                    Edit Profile
                                                </button>
                                            </li>

                                            <li className="nav-item">
                                                <button
                                                    className="nav-link"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-change-password"
                                                >
                                                    Change Password
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content pt-2">
                                            <div
                                                className="tab-pane fade show active profile-overview"
                                                id="profile-overview"
                                            >
                                                <h5 className="card-title">Profile Details</h5>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">ชื่อ-นามสกุล</div>
                                                    <div className="col-lg-9 col-md-8">Karnanan Purimanuruk</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">ตำแหน่ง</div>
                                                    <div className="col-lg-9 col-md-8">
                                                        เจ้าหน้าที่เทคโนโลยีสารสนเทศ
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">แผนก</div>
                                                    <div className="col-lg-9 col-md-8">เทคโนโลยีสารสนเทศ</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">ฝ่าย</div>
                                                    <div className="col-lg-9 col-md-8">เทคโนโลยีสารสนเทศ</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">รหัส</div>
                                                    <div className="col-lg-9 col-md-8">5900284</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">โทร</div>
                                                    <div className="col-lg-9 col-md-8">542</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                                    <div className="col-lg-9 col-md-8">it@mukinter.com</div>
                                                </div>
                                            </div>

                                            <div
                                                className="tab-pane fade profile-edit pt-3"
                                                id="profile-edit"
                                            >
                                                {/* <!-- Profile Edit Form --> */}
                                                <form>
                                                    <div className="row mb-3">
                                                        <label
                                                            for="profileImage"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >Profile Image</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <img
                                                                src="assets/img/user profile.webp"
                                                                alt="Profile"
                                                            />
                                                            <div className="pt-2">
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-primary btn-sm"
                                                                    title="Upload new profile image"
                                                                ><i className="bi bi-upload" />
                                                                </a>
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-danger btn-sm"
                                                                    title="Remove my profile image"
                                                                ><i className="bi bi-trash" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="fullName"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >ชื่อ-นามสกุล</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="fullName"
                                                                type="text"
                                                                className="form-control"
                                                                id="fullName"
                                                                value="Karnanan Purimanuruk"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="about"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >เกี่ยวกับ</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <textarea
                                                                name="about"
                                                                className="form-control"
                                                                id="about"
                                                                style="height: 100px"
                                                            >
                                                                Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea
                                                            >
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="position"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >ตำแหน่ง</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="position"
                                                                type="text"
                                                                className="form-control"
                                                                id="position"
                                                                value="เจ้าหน้าที่เทคโนโลยีสารสนเทศ"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="division"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >แผนก</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="division"
                                                                type="text"
                                                                className="form-control"
                                                                id="division"
                                                                value="เทคโนโลยีสารสนเทศ"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="department"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >ฝ่าย</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="department"
                                                                type="text"
                                                                className="form-control"
                                                                id="department"
                                                                value="เทคโนโลยีสารสนเทศ"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="emp-code"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >รหัสพนักงาน</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="emp-code"
                                                                type="text"
                                                                className="form-control"
                                                                id="emp-code"
                                                                value="5900284"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="phone"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >โทรศัพท์</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="phone"
                                                                type="text"
                                                                className="form-control"
                                                                id="phone"
                                                                value="542"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="Email"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >Email</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                className="form-control"
                                                                id="Email"
                                                                value="it@mukinter.com"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <button type="submit" className="btn btn-primary">
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </form>
                                                {/* <!-- End Profile Edit Form --> */}
                                            </div>

                                            <div className="tab-pane fade pt-3" id="profile-change-password">
                                                {/* <!-- Change Password Form --> */}
                                                <form>
                                                    <div className="row mb-3">
                                                        <label
                                                            for="currentPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >Current Password</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                className="form-control"
                                                                id="currentPassword"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="newPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >New Password</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="newpassword"
                                                                type="password"
                                                                className="form-control"
                                                                id="newPassword"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label
                                                            for="renewPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >Re-enter New Password</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="renewpassword"
                                                                type="password"
                                                                className="form-control"
                                                                id="renewPassword"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <button type="submit" className="btn btn-primary">
                                                            Change Password
                                                        </button>
                                                    </div>
                                                </form>
                                                {/* <!-- End Change Password Form --> */}
                                            </div>
                                        </div>
                                        {/* <!-- End Bordered Tabs --> */}
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
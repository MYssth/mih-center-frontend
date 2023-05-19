/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import {
    Grid,
    Stack,
    Typography,
    TextField,

} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import thLocale from "date-fns/locale/th";
import MainHeader from '../component/MainHeader'
import CBSSidebar from './component/CBSSidebar'

function CBSBooking() {
    return (
        <div>
            <MainHeader />
            <CBSSidebar name="booking" />

            {/* <!-- ======= Main ======= --> */}
            <main id="main" className="main">
                <section className="section">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* <!-- Bordered Tabs --> */}
                                    <ul className="nav nav-tabs nav-tabs-bordered">
                                        <li className="nav-item">
                                            <button
                                                className="nav-link active"
                                                data-bs-toggle="tab"
                                                data-bs-target="#carbooking-form"
                                            >
                                                ขอใช้รถ
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className="nav-link"
                                                data-bs-toggle="tab"
                                                data-bs-target="#carbooking-list"
                                            >
                                                รายการขอใช้รถ
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content pt-3">
                                        <div
                                            className="tab-pane fade show active profile-overview pt-2"
                                            id="carbooking-form"
                                        >
                                            <h5 className="card-title">แบบฟอร์มขอใช้รถ</h5>

                                            <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                                                <Grid item md={3}>
                                                    {/* <label htmlFor="departures-datetime" className="form-label">วันที่-เวลา</label> */}
                                                    <Typography>วันที่-เวลา</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                                                        <DatePicker label="เลือกวันที่" format="dd/MM/yyyy" />
                                                    </LocalizationProvider>
                                                    <div className="invalid-feedback">กรุณาระบุวันที่-เวลา</div>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="arrivals-datetime" className="form-label">ถึงวันที่-เวลา</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        // required=""
                                                        id="arrivals-datetime"
                                                    />
                                                    <div className="invalid-feedback">กรุณาระบุวันที่-เวลา</div>
                                                </Grid>
                                                <Grid item md={4}>
                                                    <label htmlFor="inputlocation" className="form-label">สถานที่</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        // required=""
                                                        id="inputlocation"
                                                    />
                                                    <div className="invalid-feedback">กรุณาระบุสถานที่</div>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <label htmlFor="inputstate" className="form-label">จังหวัด</label>
                                                    <select id="inputstate" className="form-select" required>
                                                        <option selected disabled value="">
                                                            กรุณาเลือก...
                                                        </option>
                                                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                                        <option value="กระบี่">กระบี่ </option>
                                                        <option value="กาญจนบุรี">กาญจนบุรี </option>
                                                        <option value="กาฬสินธุ์">กาฬสินธุ์ </option>
                                                        <option value="กำแพงเพชร">กำแพงเพชร </option>
                                                        <option value="ขอนแก่น">ขอนแก่น</option>
                                                        <option value="จันทบุรี">จันทบุรี</option>
                                                        <option value="ฉะเชิงเทรา">ฉะเชิงเทรา </option>
                                                        <option value="ชัยนาท">ชัยนาท </option>
                                                        <option value="ชัยภูมิ">ชัยภูมิ </option>
                                                        <option value="ชุมพร">ชุมพร </option>
                                                        <option value="ชลบุรี">ชลบุรี </option>
                                                        <option value="เชียงใหม่">เชียงใหม่ </option>
                                                        <option value="เชียงราย">เชียงราย </option>
                                                        <option value="ตรัง">ตรัง </option>
                                                        <option value="ตราด">ตราด </option>
                                                        <option value="ตาก">ตาก </option>
                                                        <option value="นครนายก">นครนายก </option>
                                                        <option value="นครปฐม">นครปฐม </option>
                                                        <option value="นครพนม">นครพนม </option>
                                                        <option value="นครราชสีมา">นครราชสีมา </option>
                                                        <option value="นครศรีธรรมราช">นครศรีธรรมราช </option>
                                                        <option value="นครสวรรค์">นครสวรรค์ </option>
                                                        <option value="นราธิวาส">นราธิวาส </option>
                                                        <option value="น่าน">น่าน </option>
                                                        <option value="นนทบุรี">นนทบุรี </option>
                                                        <option value="บึงกาฬ">บึงกาฬ</option>
                                                        <option value="บุรีรัมย์">บุรีรัมย์</option>
                                                        <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์ </option>
                                                        <option value="ปทุมธานี">ปทุมธานี </option>
                                                        <option value="ปราจีนบุรี">ปราจีนบุรี </option>
                                                        <option value="ปัตตานี">ปัตตานี </option>
                                                        <option value="พะเยา">พะเยา </option>
                                                        <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา </option>
                                                        <option value="พังงา">พังงา </option>
                                                        <option value="พิจิตร">พิจิตร </option>
                                                        <option value="พิษณุโลก">พิษณุโลก </option>
                                                        <option value="เพชรบุรี">เพชรบุรี </option>
                                                        <option value="เพชรบูรณ์">เพชรบูรณ์ </option>
                                                        <option value="แพร่">แพร่ </option>
                                                        <option value="พัทลุง">พัทลุง </option>
                                                        <option value="ภูเก็ต">ภูเก็ต </option>
                                                        <option value="มหาสารคาม">มหาสารคาม </option>
                                                        <option value="มุกดาหาร">มุกดาหาร </option>
                                                        <option value="แม่ฮ่องสอน">แม่ฮ่องสอน </option>
                                                        <option value="ยโสธร">ยโสธร </option>
                                                        <option value="ยะลา">ยะลา </option>
                                                        <option value="ร้อยเอ็ด">ร้อยเอ็ด </option>
                                                        <option value="ระนอง">ระนอง </option>
                                                        <option value="ระยอง">ระยอง </option>
                                                        <option value="ราชบุรี">ราชบุรี</option>
                                                        <option value="ลพบุรี">ลพบุรี </option>
                                                        <option value="ลำปาง">ลำปาง </option>
                                                        <option value="ลำพูน">ลำพูน </option>
                                                        <option value="เลย">เลย </option>
                                                        <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                                                        <option value="สกลนคร">สกลนคร</option>
                                                        <option value="สงขลา">สงขลา </option>
                                                        <option value="สมุทรสาคร">สมุทรสาคร </option>
                                                        <option value="สมุทรปราการ">สมุทรปราการ </option>
                                                        <option value="สมุทรสงคราม">สมุทรสงคราม </option>
                                                        <option value="สระแก้ว">สระแก้ว </option>
                                                        <option value="สระบุรี">สระบุรี </option>
                                                        <option value="สิงห์บุรี">สิงห์บุรี </option>
                                                        <option value="สุโขทัย">สุโขทัย </option>
                                                        <option value="สุพรรณบุรี">สุพรรณบุรี </option>
                                                        <option value="สุราษฎร์ธานี">สุราษฎร์ธานี </option>
                                                        <option value="สุรินทร์">สุรินทร์ </option>
                                                        <option value="สตูล">สตูล </option>
                                                        <option value="หนองคาย">หนองคาย </option>
                                                        <option value="หนองบัวลำภู">หนองบัวลำภู </option>
                                                        <option value="อำนาจเจริญ">อำนาจเจริญ </option>
                                                        <option value="อุดรธานี">อุดรธานี </option>
                                                        <option value="อุตรดิตถ์">อุตรดิตถ์ </option>
                                                        <option value="อุทัยธานี">อุทัยธานี </option>
                                                        <option value="อุบลราชธานี">อุบลราชธานี</option>
                                                        <option value="อ่างทอง">อ่างทอง </option>
                                                        <option value="อื่นๆ">อื่นๆ</option>
                                                    </select>

                                                    <div className="invalid-feedback">กรุณาระบุจังหวัด</div>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputlocation" className="form-label">จำนวนผู้โดยสาร</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        // required=""
                                                        id="inputlocation"
                                                    />
                                                    <div className="invalid-feedback">กรุณาระบุสถานที่</div>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputtel" className="form-label">เบอร์โทรศัพท์ติดต่อ</label>
                                                    <input type="tel" className="form-control" id="inputtel" />
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputcar" className="form-label">ประเภทรถ</label>
                                                    <select id="inputcar" className="form-select">
                                                        <option selected>ไม่ระบุ...</option>
                                                        <option>รถตู้</option>
                                                        <option>รถกระบะ</option>
                                                        <option>รถพยาบาล</option>
                                                    </select>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputstaff" className="form-label">พนักงานขับรถ</label>
                                                    <select id="inputstaff" className="form-select">
                                                        <option selected>ไม่ระบุ...</option>
                                                        <option>...</option>
                                                    </select>
                                                </Grid>

                                                <Grid item md={12}>
                                                    <label htmlFor="inputdetail" className="form-label">รายละเอียด</label>
                                                    <textarea
                                                        // type="text"
                                                        className="form-control"
                                                        // required=""
                                                        id="inputdetail"
                                                    />
                                                    <div className="invalid-feedback">กรุณาระบุรายละเอียด</div>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Stack direction="row" spacing={1}>
                                                        <button type="submit" className="btn btn-primary">
                                                            บันทึก
                                                        </button>
                                                        <button type="submit" className="btn btn-success">
                                                            พิมพ์
                                                        </button>
                                                        <button type="submit" className="btn btn-danger">
                                                            ยกเลิก
                                                        </button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                        </div>

                                        <div
                                            className="tab-pane fade profile-overview pt-2"
                                            id="carbooking-list"
                                        >
                                            <h5 className="card-title">รายการขอใช้รถ</h5>
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
    )
}

export default CBSBooking
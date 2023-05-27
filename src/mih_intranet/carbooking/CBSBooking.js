/* eslint-disable jsx-a11y/label-has-associated-control */
// import React from 'react'
import { useEffect, useState } from 'react';
import {
    Grid,
    Stack,
    Typography,
    TextField,
    Autocomplete,

} from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import thLocale from "date-fns/locale/th";
import MainHeader from '../component/MainHeader'
import CBSSidebar from './component/CBSSidebar'

function CBSBooking() {
    const [open, setOpen] = useState(false);

    const [carType, setCarType] = useState([]);
    const [carTypeId, setCarTypeId] = useState('');
    const [carTypeName, setCarTypeName] = useState('');

    useEffect(() => {

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getcartype`)
            .then((response) => response.json())
            .then((data) => {
                setCarType(data);
                setCarTypeId(0);
                setCarTypeName("ไม่ระบุ");
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            })

    }, []);

    const provinceList = [
        { label: "กรุงเทพมหานคร" },
        { label: "กระบี่" },
        { label: "กาญจนบุรี" },
        { label: "กาฬสินธุ์" },
        { label: "กำแพงเพชร" },
        { label: "ขอนแก่น" },
        { label: "จันทบุรี" },
        { label: "ฉะเชิงเทรา" },
        { label: "ชัยนาท" },
        { label: "ชัยภูมิ" },
        { label: "ชุมพร" },
        { label: "ชลบุรี" },
        { label: "เชียงใหม่" },
        { label: "เชียงราย" },
        { label: "ตรัง" },
        { label: "ตราด" },
        { label: "ตาก" },
        { label: "นครนายก" },
        { label: "นครปฐม" },
        { label: "นครพนม" },
        { label: "นครราชสีมา" },
        { label: "นครศรีธรรมราช" },
        { label: "นครสวรรค์" },
        { label: "นราธิวาส" },
        { label: "น่าน" },
        { label: "นนทบุรี" },
        { label: "บึงกาฬ" },
        { label: "บุรีรัมย์" },
        { label: "ประจวบคีรีขันธ์" },
        { label: "ปทุมธานี" },
        { label: "ปราจีนบุรี" },
        { label: "ปัตตานี" },
        { label: "พะเยา" },
        { label: "พระนครศรีอยุธยา" },
        { label: "พังงา" },
        { label: "พิจิตร" },
        { label: "พิษณุโลก" },
        { label: "เพชรบุรี" },
        { label: "เพชรบูรณ์" },
        { label: "แพร่" },
        { label: "พัทลุง" },
        { label: "ภูเก็ต" },
        { label: "มหาสารคาม" },
        { label: "มุกดาหาร" },
        { label: "แม่ฮ่องสอน" },
        { label: "ยโสธร" },
        { label: "ยะลา" },
        { label: "ร้อยเอ็ด" },
        { label: "ระนอง" },
        { label: "ระยอง" },
        { label: "ราชบุรี" },
        { label: "ลพบุรี" },
        { label: "ลำปาง" },
        { label: "ลำพูน" },
        { label: "เลย" },
        { label: "ศรีสะเกษ" },
        { label: "สกลนคร" },
        { label: "สงขลา" },
        { label: "สมุทรสาคร" },
        { label: "สมุทรปราการ" },
        { label: "สมุทรสงคราม" },
        { label: "สระแก้ว" },
        { label: "สระบุรี" },
        { label: "สิงห์บุรี" },
        { label: "สุโขทัย" },
        { label: "สุพรรณบุรี" },
        { label: "สุราษฎร์ธานี" },
        { label: "สุรินทร์" },
        { label: "สตูล" },
        { label: "หนองคาย" },
        { label: "หนองบัวลำภู" },
        { label: "อำนาจเจริญ" },
        { label: "อุดรธานี" },
        { label: "อุตรดิตถ์" },
        { label: "อุทัยธานี" },
        { label: "อุบลราชธานี" },
        { label: "อ่างทอง" },
        { label: "อื่นๆ" },
    ]

    return (
        <div>
            <MainHeader onOpenNav={() => setOpen(true)} />
            <CBSSidebar name="booking" openNav={open} onCloseNav={() => setOpen(false)} />

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
                                                <Grid item md={4}>
                                                    <label htmlFor="departures-datetime" className="form-label">วันที่-เวลา</label><br />
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                                                        <Stack direction="row" spacing={1}>
                                                            <DatePicker label="เลือกวันที่ไป" format="dd/MM/yyyy" />
                                                            <TimePicker label="เลือกเวลาไป" ampm={false} timeStep={15} />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                    <div className="invalid-feedback">กรุณาระบุวันที่-เวลา</div>
                                                </Grid>
                                                <Grid item md={4}>
                                                    <label htmlFor="arrivals-datetime" className="form-label">ถึงวันที่-เวลา</label><br />
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                                                        <Stack direction="row" spacing={1}>
                                                            <DatePicker label="เลือกวันที่กลับ" format="dd/MM/yyyy" />
                                                            <TimePicker label="เลือกเวลากลับ" ampm={false} timeStep={15} />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                    <div className="invalid-feedback">กรุณาระบุวันที่-เวลา</div>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <label htmlFor="inputlocation" className="form-label">สถานที่</label><br />
                                                    <TextField id="place" name="place" label="สถานที่" />
                                                    <div className="invalid-feedback">กรุณาระบุสถานที่</div>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <label htmlFor="inputstate" className="form-label">จังหวัด</label><br />
                                                    <Autocomplete
                                                        defaultValue="มุกดาหาร"
                                                        id="controllable-states-province-list"
                                                        options={provinceList}
                                                        fullWidth
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />

                                                    <div className="invalid-feedback">กรุณาระบุจังหวัด</div>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputlocation" className="form-label">จำนวนผู้โดยสาร</label><br />
                                                    <TextField fullWidth id="paxAmt" name="paxAmt" label="จำนวนผู้โดยสาร" />
                                                    <div className="invalid-feedback">กรุณาระบุสถานที่</div>
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputtel" className="form-label">เบอร์โทรศัพท์ติดต่อ</label><br />
                                                    <TextField fullWidth id="telNo" name="telNo" label="เบอร์โทรศัพท์ติดต่อ" />
                                                </Grid>
                                                <Grid item md={3}>
                                                    <label htmlFor="inputcar" className="form-label">ประเภทรถ</label>
                                                    <Autocomplete
                                                        value={carTypeName}
                                                        onChange={(event, newValue) => {
                                                            setCarTypeName(newValue);
                                                            if (newValue !== null) {
                                                                setCarTypeId(carType.find(o => o.name === newValue).id);
                                                            }
                                                            else {
                                                                setCarTypeId(0);
                                                                setCarTypeName("ไม่ระบุ");
                                                            }
                                                        }}
                                                        id="controllable-states-car-type-id"
                                                        options={Object.values(carType).map((option) => option.name)}
                                                        fullWidth
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
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
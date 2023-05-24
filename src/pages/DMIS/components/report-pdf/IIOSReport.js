/* eslint-disable radix */
/* eslint-disable react/style-prop-object */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import imageToBase64 from 'image-to-base64/browser';

const dateFns = require('date-fns');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
    THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew-Bold.ttf',
        italics: 'THSarabunNew-Italic.ttf',
        bolditalics: 'THSarabunNew-BoldItalic.ttf'
    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
}

let cmBox = "";
let noSig = "";
let inforSig = "";
let recvSig = "";
let operSig = "";
let permitSig = "";
let endSig = "";
let endName = "";
let pconfirmSig = "";
let pconfirmName = "";
let auditSig = "";
let header = {};

export default async function IIOSReport(data) {

    noSig = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/nosignature.png`)}`;
    cmBox = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/CMBox.png`)}`;

    header = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/getsitesetting`)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
            console.error('Error:', error);
        });

    inforSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.informer_id}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                return data.signature_data;
            }
            return noSig;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    if (data.receiver_id !== "" && data.receiver_id !== null) {
        recvSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.receiver_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                    return data.signature_data;
                }
                return noSig;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        recvSig = await noSig;
    }

    if (data.operator_id !== "" && data.operator_id !== null) {
        operSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.operator_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                    return data.signature_data;
                }
                return noSig;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        operSig = await noSig;
    }

    if (data.permit_id !== "" && data.permit_id !== null) {
        permitSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.permit_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                    return data.signature_data;
                }
                return noSig;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        permitSig = await noSig;
    }

    if (data.audit_id !== "" && data.audit_id !== null) {
        auditSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.audit_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                    return data.signature_data;
                }
                return noSig;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        auditSig = await noSig;
    }

    if (data.pconfirm_id !== "" && data.pconfirm_id !== null) {

        pconfirmName = `${data.pconfirm_firstname} ${data.pconfirm_lastname}`;

        pconfirmSig = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.pconfirm_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== "") {
                    return data.signature_data;
                }
                return noSig;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        pconfirmSig = await noSig;
    }

    if (data.operator_id !== "" && data.operator_id !== null && data.task_iscomplete) {
        endSig = await operSig
        endName = await `${data.operator_firstname} ${data.operator_lastname}`;
    }
    else {
        endSig = await noSig;
    }

    // eslint-disable-next-line new-cap
    const html = await htmlToPdfmake(`
        <table data-pdfmake="{'layout':'noBorders'}">
            <tr>
                <td><img src="${header.logo}" width="50" alt="logo" /></td>
                <td><h2>โรงพยาบาลมุกดาหารอินเตอร์เนชั่นแนล</h2></td>
            </tr>
        </table><table class="marbot" data-pdfmake="{'widths':['auto','*','auto']}">
                <tr>
                    <td style="text-align:center">รหัสแบบฟอร์ม<br />
                        DMIS-001</td>
                    <td style="text-align:center"><strong>ใบแจ้งซ่อม/แจ้งติดตั้ง/แจ้งปัญหา<br />
                        ${data.level_id === 'DMIS_IT' ? '(งานเทคโนโลยีสารสนเทศ)' : (data.level_id === 'DMIS_MT' ? '(งานซ่อมบำรุงทั่วไป)' : '(งานซ่อมบำรุงเครื่องมือแพทย์)')}</strong></td>
                    <td>เริ่มใช้วันที่ 23 พ.ค. 2566<br />
                        ปรับปรุงครั้งที่ 4 เมื่อ 23 พ.ค. 2566</td>
                </tr>
        </table><table data-pdfmake="{'heights':['auto',105],'widths':['*']}">
            <tr>
                <td><table data-pdfmake="{'widths':['*','auto'],'layout':'noBorders'}"><tr><td><strong>รายละเอียดการแจ้งปัญหา</strong></td><td><div style="text-align:right">เลขที่เอกสาร ${data.task_id}</div></td></tr></table></td>
            </tr>
            <tr>
                <td>ชื่อผู้แจ้ง: ${data.informer_firstname} ${data.informer_lastname}\tตำแหน่ง: ${data.informer_position_name}\tเบอร์โทรศัพท์: ${data.task_phone_no === null || data.task_phone_no === "" ? "ไม่ได้ระบุ" : data.task_phone_no}<br />
                    แผนกที่พบปัญหา: ${data.issue_department_name}\tวันที่แจ้ง: ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7), 'dd/MM/yyyy')}<br />
                    รหัสทรัพย์สิน: ${data.task_device_id === null || data.task_device_id === "" ? "ไม่ได้ระบุ" : data.task_device_id}\tSerial number: ${data.task_serialnumber === null || data.task_serialnumber === "" ? "ไม่ได้ระบุ" : data.task_serialnumber}<br />
                    รายละเอียดของปัญหา: ${data.task_issue}</td>
            </tr>
        </table><table data-pdfmake="{'layout':'noBorders'}" data-pdfmake="{'widths':['*','*']}">
            <tr>
                <td style="text-align:center"><table data-pdfmake="{'widths':['*',105,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${inforSig}" width="110" height="30" alt="inforSig" /></td><td><div style="text-align:left">ผู้แจ้ง</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${data.informer_firstname} ${data.informer_lastname})<br/>
                    ${`วันที่ ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7), 'dd/MM/yyyy')}`}</td></td></table></td>

                <td style="text-align:center"><table data-pdfmake="{'widths':['*',110,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${recvSig}" width="110" height="30" alt="recvSig" /></td><td><div style="text-align:left">ผู้รับเรื่อง</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${data.receiver_firstname === null || data.receiver_firstname === "" ? "........................................" : `${data.receiver_firstname} ${data.receiver_lastname}`})<br/>
                    ${`วันที่${data.task_date_accept === null || data.task_date_accept === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_accept), 543), 7), 'dd/MM/yyyy')}`}`}</td></td></table></td>
            </tr>
        </table><table data-pdfmake="{'heights':['auto',65],'widths':['*']}">
            <tr>
                <td><strong>การประเมิณงาน</strong></td>
            </tr>
            <tr>
                <td>การดำเนินงาน: ${data.status_id !== 2 && data.status_id !== 5 ? data.status_name : "ดำเนินการโดยผู้รับผิดชอบ"}<br />
                    หมายเหตุ: ${data.task_note === null || data.task_note === "" ? "-" : data.task_note}</td>
                </tr>
        </table><table data-pdfmake="{'layout':'noBorders'}" data-pdfmake="{'widths':['*','*']}">
            <tr>
                <td style="text-align:center"><table data-pdfmake="{'widths':['*',110,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${operSig}" width="110" height="30" alt="operSig" /></td><td><div style="text-align:left">ผู้ดำเนินการ</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${data.operator_firstname === null || data.operator_firstname === "" ? "........................................" : `${data.operator_firstname} ${data.operator_lastname}`})<br/>
                    ${`วันที่ ${data.task_date_process === null || data.task_date_process === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_process), 543), 7), 'dd/MM/yyyy')}`}`}</td></td></table></td>

                <td style="text-align:center"><table data-pdfmake="{'widths':['*',110,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${permitSig}" width="110" height="30" alt="permitSig" /></td><td><div style="text-align:left">ผู้ตรวจสอบ</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${data.permit_firstname === null || data.permit_firstname === "" ? "........................................" : `${data.permit_firstname} ${data.permit_lastname}`})<br/>
                    ${`วันที่ ${data.permit_date === null || data.permit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.permit_date), 543), 7), 'dd/MM/yyyy')}`}`}</td></td></table></td>
            </tr>
        </table><table data-pdfmake="{'heights':['auto',105],'widths':['*']}">
            <tr>
                <td><strong>ผลการดำเนินงาน</strong></td>
            </tr>
            <tr>
                <td>งบประมาณที่ใช้: ${data.task_cost === null || data.task_cost === "" ? "0" : data.task_cost}<br/>
                รายละเอียดการแก้ไขปัญหา: ${data.status_name === "ยกเลิก" ? "ยกเลิกใบงาน" : (data.task_iscomplete === null || data.task_iscomplete === "") ? "-<br/>" : data.task_solution}<br/>
                    หมายเหตุ: ${data.complete_note !== null ? data.complete_note : "-"}</td>
            </tr>
        </table>${data.is_program_change === null || data.is_program_change === "" ? "" : `<table data-pdfmake="{'layout':'noBorders'}"><tr><td><img src="${cmBox}" width="20" alt="cmBox" /></td><td>โปรแกรมได้รับการทดสอบ UAT แล้ว ขอนุมัติวางโปรแกรม</td></tr></table>`}<table data-pdfmake="{'widths':['*','*','*'], 'layout':'noBorders'}">
            <tr style="text-align:center">
                <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ดำเนินการ</td></tr>
                    <tr><td><img src="${endSig}" width="110" height="30" alt="endSig" /></td></tr>
                    <tr><td>(${endName === null || endName === "" ? "........................................" : `${endName}`})</td></tr>
                    <tr><td>${`วันที่ ${data.task_date_end === null || data.task_date_end === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_end), 543), 7), 'dd/MM/yyyy')}`}`}</td></tr>
                </table></td>

                <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้อนุมัติวางโปรแกรม (ถ้ามี)</td></tr>
                    <tr><td><img src="${pconfirmSig}" width="110" height="30" alt="pconfirmSig" /></td></tr>
                    <tr><td>(${pconfirmName === null || pconfirmName === "" ? "........................................" : `${pconfirmName}`})</td></tr>
                    <tr><td>${`วันที่ ${data.pconfirm_date === null || data.pconfirm_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.pconfirm_date), 543), 7), 'dd/MM/yyyy')}`}`}</td></tr>
                </table></td>

                <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้รับทราบผลดำเนินงาน</td></tr>
                    <tr><td><img src="${auditSig}" width="110" height="30" alt="auditSig" /></td></tr>
                    <tr><td>(${data.audit_firstname === null || data.audit_firstname === "" ? "........................................" : `${data.audit_firstname} ${data.audit_lastname}`})</td></tr>
                    <tr><td>${`วันที่${data.audit_date === null || data.audit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.audit_date), 543), 7), 'dd/MM/yyyy')}`}`}</td></tr>
                </table></td></tr></table>`, {
        removeExtraBlanks: true,
        defaultStyles: { // change the default styles
            table: ''

        }
    });

    const date = new Date();

    const docDefinition = {
        info: {
            title: `IIOS${date.getDate()}${(`0${parseInt(date.getMonth())+1}`).slice(-2)}${date.getFullYear()}`,
        },
        content: [
            html
        ],
        defaultStyle: {
            font: 'THSarabunNew',
            fontSize: 16,
        },
        styles: {
            center: {
                marginBottom: 0,
                marginLeft: 15,
                alignment: 'center',
            },
            marbot: {
                marginBottom: 7
            },
            test: {
                marginLeft: 2
            }
        },
    };
    pdfMake.createPdf(docDefinition).open();
    return null;
}
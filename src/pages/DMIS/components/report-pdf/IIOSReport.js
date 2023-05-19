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

let noSig = "";
let inforSig = "";
let recvSig = "";
let operSig = "";
let permitSig = "";
let auditSig = "";
let endSig = "";
let endName = "";
let pconfirmSig = "";
let pconfirmName = "";
let header = {};

export default async function IIOSReport(data) {

    noSig = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/nosignature.png`)}`;

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
        </table><table border="1" cellpadding="1" cellspacing="1" data-pdfmake="{'widths':['auto','*','auto']}">
                <tr>
                    <td style="text-align:center">รหัสแบบฟอร์ม<br />
                        DMIS-001</td>
                    <td style="text-align:center"><strong>ใบแจ้งซ่อม/แจ้งติดตั้ง/แจ้งปัญหา<br />
                        ${data.level_id === 'DMIS_IT' ? '(งานเทคโนโลยีสารสนเทศ)' : (data.level_id === 'DMIS_MT' ? '(งานซ่อมบำรุงทั่วไป)' : '(งานซ่อมบำรุงเครื่องมือแพทย์)')}</strong></td>
                    <td>เริ่มใช้วันที่ 22 พ.ค. 2566<br />
                        ปรับปรุงครั้งที่ 4 เมื่อ 19 พ.ค. 2566</td>
                </tr>
        </table><div style="text-align:right">เลขที่เอกสาร ${data.task_id}</div><table border="1" cellpadding="1" cellspacing="1" data-pdfmake="{'widths':['*']}">
            <tr>
                <td><strong>รายละเอียดการแจ้งปัญหา</strong></td>
            </tr>
            <tr>
                <td>ชื่อผู้แจ้ง: ${data.informer_firstname} ${data.informer_lastname}\tตำแหน่ง: ${data.informer_position_name}\tเบอร์โทรศัพท์: ${data.task_phone_no === null || data.task_phone_no === "" ? "ไม่ได้ระบุ" : data.task_phone_no}<br />
                    แผนกที่พบปัญหา: ${data.issue_department_name}\tวันที่แจ้ง: ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7), 'dd/MM/yyyy')}<br />
                    รหัสทรัพย์สิน: ${data.task_device_id === null || data.task_device_id === "" ? "ไม่ได้ระบุ" : data.task_device_id}\tSerial number: ${data.task_serialnumber === null || data.task_serialnumber === "" ? "ไม่ได้ระบุ" : data.task_serialnumber}<br />
                    รายละเอียดของปัญหา: ${data.task_issue}<br />
                    &nbsp;</td>
            </tr>
        </table><table border="1" cellpadding="1" cellspacing="1" data-pdfmake="{'widths':['*','*']}">
            <tr>
                <td style="text-align:center"><table data-pdfmake="{'widths':['auto',110,'auto']}"><tr><td><br /><div style="text-align:right">ลงชื่อ</div></td><td><img src="${inforSig}" width="110" height="40" alt="inforSig" /></td><td><br /><div style="text-align:left">ผู้แจ้ง</div></td></tr></table>
                (${data.informer_firstname} ${data.informer_lastname})</td>
                <td></td>
            </tr>
        </table>

            <table border="1" cellpadding="1" cellspacing="1">
                <tbody>
                    <tr>
                        <td>การประเมิณงาน</td>
                    </tr>
                    <tr>
                        <td>การดำเนินงาน: *สถานะการดำเนินงาน*<br />
                            หมายเหตุ: *หมายเหตุการดำเนินงาน*<br />
                            &nbsp;</td>
                    </tr>
                </tbody>
            </table>

            <table border="1" cellpadding="1" cellspacing="1">
                <tbody>
                    <tr>
                        <td style="text-align:center">ลงชื่อ *รูปลายเซ็นผู้ดำเนินการ*&nbsp;ผู้ดำเนินการ<br />
                            (*ชื่อผู้ดำเนินการ*)<br />
                            วันที่ *วันที่ดำเนินการ*</td>
                        <td style="text-align:center">ลงชื่อ *รูปลายเซ็นผู้ตรวจสอบ*&nbsp;ผู้ตรวจสอบ<br />
                            (*ชื่อผู้ตรวจสอบ*)<br />
                            วันที่ *วันที่ตรวจสอบ*</td>
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

            <table border="1" cellpadding="1" cellspacing="1">
                <tbody>
                    <tr>
                        <td>ผลการดำเนินงาน</td>
                    </tr>
                    <tr>
                        <td>งบประมาณที่ใช้: *งบประมาณที่ใช้*<br />
                            รายละเอียดการแก้ไขปัญหา: *รายละเอียดการแก้ไขปัญหา*<br />
                            <br />
                            หมายเหคุ: *หมายเหตุการแก้ไขปัญหา*<br />
                            &nbsp;</td>
                    </tr>
                </tbody>
            </table>

            <table border="1" cellpadding="1" cellspacing="1">
                <tbody>
                    <tr>
                        <td style="text-align:center">ลงชื่อ *รูปลายเซ็นผู้ปิดงาน*&nbsp;ผู้ปิดงาน<br />
                            (*ชื่อผู้ปิดงาน*)<br />
                            วันที่ *วันที่เสร็จสิ้น*</td>
                        <td style="text-align:center">ขออนุมัติวางโปรแกรม (ถ้ามี)<br />
                            ลงชื่อ *รูปลายเซ็นผู้อนุมัติ*&nbsp;ผู้อนุมัติ<br />
                            (*ชื่อผู้อนุมัติ*)<br />
                            วันที่ *วันที่อนุมัติ*</td>
                        <td style="text-align:center">ลงชื่อ *รูปลายเซ็นผู้รับทราบผลดำเนินงาน*&nbsp;ผู้รับทราบผลดำเนินงาน<br />
                            (*ชื่อผู้รับทราบผลดำเนินงาน*)<br />
                            วันที่ *วันที่รับทราบผลดำเนินงาน*</td>
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

    `);

    console.log(html);

    const docDefinition = {
        content: [
            html
        ],
        defaultStyle: {
            font: 'THSarabunNew',
            fontSize: 16,
        },
    };
    pdfMake.createPdf(docDefinition).open();
    return null;
}
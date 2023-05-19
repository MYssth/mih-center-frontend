import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import imageToBase64 from 'image-to-base64/browser';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const dateFns = require('date-fns');

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

export default async function getImgBase64(data) {

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

  await printPDF(data);

  return null;
}

function printPDF(data) {
  const docDefinition = {
    pageOrientation: 'portrait',
    content: [
      {
        columns: [
          {
            image: header.logo,
            fit: [50, 50],
            width: 50,
          },
          {
            text: header.fname,
            style: 'title',
            margin: [10, 10],
          },
        ]
      },
      {
        style: 'tableExample',
        table: {
          widths: ['auto', '*', 'auto'],
          body: [
            [{ text: 'รหัสแบบฟอร์ม\nDMIS-001', alignment: 'center' }, { text: `ใบแจ้งซ่อม/แจ้งติดตั้ง/แจ้งปัญหา\n${data.level_id === 'DMIS_IT' ? '(งานเทคโนโลยีสารสนเทศ)' : (data.level_id === 'DMIS_MT' ? '(งานซ่อมบำรุงทั่วไป)' : '(งานซ่อมบำรุงเครื่องมือแพทย์)')}`, style: 'header', alignment: 'center' }, { text: 'เริ่มใช้วันที่ 13 มี.ค. 2566\nปรับปรุงครั้งที่ 3 เมื่อ 13 มี.ค. 2566' }]
          ]
        },

      },
      '\n',
      { text: `เลขที่เอกสาร ${data.task_id}`, alignment: 'right' },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          heights: [10, 'auto'],
          body: [
            [{ text: 'รายละเอียดการแจ้งปัญหา', style: 'header2' }],
            [{
              text: [
                `ชื่อผู้แจ้ง: ${data.informer_firstname} ${data.informer_lastname}\tตำแหน่ง: ${data.informer_position_name}\tเบอร์โทรศัพท์: ${data.task_phone_no === null || data.task_phone_no === "" ? "ไม่ได้ระบุ" : data.task_phone_no}\n`,
                `แผนกที่พบปัญหา: ${data.issue_department_name}\tวันที่แจ้ง: ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7), 'dd/MM/yyyy')}\n`,
                `รหัสทรัพย์สิน: ${data.task_device_id === null || data.task_device_id === "" ? "ไม่ได้ระบุ" : data.task_device_id}\t`,
                `Serial number: ${data.task_serialnumber === null || data.task_serialnumber === "" ? "ไม่ได้ระบุ" : data.task_serialnumber}\n`,
                `รายละเอียดของปัญหา: ${data.task_issue}\n`,
              ]
            }],
          ]
        }
      },
      {
        columns: [
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: inforSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ผู้แจ้ง', width: 60 },
            ]
          },
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: recvSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n" },
              { text: 'ผู้รับเรื่อง' },
            ]
          },
        ]
      },
      {
        columns: [
          {
            text: `(${data.informer_firstname} ${data.informer_lastname})`,
            alignment: 'center',
            width: 260,
          },
          {
            text: `${data.receiver_firstname === null || data.receiver_firstname === "" ? "(........................................)" : `(${data.receiver_firstname} ${data.receiver_lastname})`}`,
            alignment: 'center',
            width: 260,
          },
        ]
      },
      {
        columns: [
          {
            text: `วันที่ ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7), 'dd/MM/yyyy')}`,
            alignment: 'center',
            width: 260,
          },
          {
            text: `วันที่${data.task_date_accept === null || data.task_date_accept === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_accept), 543), 7), 'dd/MM/yyyy')}`}`,
            alignment: 'center',
            width: 260,
          },
        ]
      },
      '\n',
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          heights: [10, 'auto'],
          body: [
            [{ text: 'การประเมินงาน', style: 'header2' }],
            [{
              text: [
                `การดำเนินงาน: ${data.status_id !== 2 && data.status_id !== 5 ? data.status_name : "ดำเนินการโดยผู้รับผิดชอบ"}\n`,
                `หมายเหตุ: ${data.task_note === null || data.task_note === "" ? "" : data.task_note}\n`,
              ]
            }],
          ]
        }
      },
      {
        columns: [
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: operSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ผู้ดำเนินการ', width: 60 },
            ]
          },
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: permitSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n" },
              { text: 'ผู้ตรวจสอบ' },
            ]
          },
        ]
      },
      {
        columns: [
          {
            text: `${data.operator_firstname === null || data.operator_firstname === "" ? "(........................................)" : `(${data.operator_firstname} ${data.operator_lastname})`}`,
            alignment: 'center',
            width: 260,
          },
          {
            text: `${data.permit_firstname === null || data.permit_firstname === "" ? "(........................................)" : `(${data.permit_firstname} ${data.permit_lastname})`}`,
            alignment: 'center',
            width: 260,
          },
        ]
      },
      {
        columns: [
          {
            text: `วันที่${data.task_date_process === null || data.task_date_process === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_process), 543), 7), 'dd/MM/yyyy')}`}`,
            alignment: 'center',
            width: 260,
          },
          {
            text: `วันที่${data.permit_date === null || data.permit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.permit_date), 543), 7), 'dd/MM/yyyy')}`}`,
            alignment: 'center',
            width: 260,
          },
        ]
      },
      "\n",
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          heights: [10, 'auto'],
          body: [
            [{ text: 'ผลการดำเนินงาน', style: 'header2' }],
            [{
              text: [
                // `วันที่เสร็จสิ้นการดำเนินงาน: ${data.status_name === "ยกเลิก" ? dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_process), 543), 7), 'dd/MM/yyyy') : data.task_date_end === null || data.task_date_end === "" ? "-" : dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_end), 543), 7), 'dd/MM/yyyy')}\t`,
                `งบประมาณที่ใช้: ${data.task_cost === null || data.task_cost === "" ? "0" : data.task_cost}\n`,
                `รายละเอียดการแก้ไขปัญหา: ${data.status_name === "ยกเลิก" ? "ยกเลิกใบงาน" : (data.task_iscomplete === null || data.task_iscomplete === "") ? "-" : data.task_solution}\n`,
                `หมายเหตุ: ${data.complete_note !== null ? data.complete_note : ""}`,
              ]
            }],
          ]
        }
      },
      {
        columns: [
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: endSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n" },
              { text: 'ผู้ปิดงาน' },
            ]
          },
        ]
      },
      {
        columns: [
          {
            text: `${endName === "" ? "(........................................)" : `(${endName})`}`,
            alignment: 'center',
            width: '*',
          },
        ]
      },
      {
        columns: [
          {
            text: `วันที่${data.task_date_end === null || data.task_date_end === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.task_date_end), 543), 7), 'dd/MM/yyyy')}`}`,
            alignment: 'center',
            width: '*',
          },
        ]
      },

      {
        columns: [
          {
            text: [
              { text: "\n", width: 60 },
              { text: 'ลงชื่อ', alignment: 'right', width: 60 },
            ]
          },
          {
            image: pconfirmSig,
            fit: [110, 40],
            width: 110,
            alignment: 'center',
          },
          {
            text: [
              { text: "\n" },
              { text: 'ผู้อนุมัติ' },
            ]
          },
        ]
      },
      {
        columns: [
          {
            text: `${pconfirmName === "" ? "(........................................)" : `(${pconfirmName})`}`,
            alignment: 'center',
            width: '*',
          },
        ]
      },
      {
        columns: [
          {
            text: `วันที่${data.pconfirm_date === null || data.pconfirm_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.pconfirm_date), 543), 7), 'dd/MM/yyyy')}`}`,
            alignment: 'center',
            width: '*',
          },
        ]
      },
      //   {
      //     columns: [
      //       {
      //         text: [
      //           { text: "\n", width: 60 },
      //           { text: 'ลงชื่อ', alignment: 'right', width: 60 },
      //         ]
      //       },
      //       {
      //         image: auditSig,
      //         fit: [110, 40],
      //         width: 110,
      //         alignment: 'center',
      //       },
      //       {
      //         text: [
      //           { text: "\n" },
      //           { text: 'ผู้รับทราบผลดำเนินงาน' },
      //         ]
      //       },
      //     ]
      //   },
      //   {
      //     columns: [
      //       {
      //         text: `${data.audit_firstname === null || data.audit_firstname === "" ? "(........................................)" : `(${data.audit_firstname} ${data.audit_lastname})`}`,
      //         alignment: 'center',
      //         width: '*',
      //       },
      //     ]
      //   },
      //   {
      //     columns: [
      //       {
      //         text: `วันที่${data.audit_date === null || data.audit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.audit_date), 543), 7), 'dd/MM/yyyy')}`}`,
      //         alignment: 'center',
      //         width: '*',
      //       },
      //     ]
      //   },

    ],
    defaultStyle: {
      font: 'THSarabunNew',
      fontSize: 16,
    },
    styles: {
      title: {
        fontSize: 20,
        bold: true
      },
      header: {
        fontSize: 16,
        bold: true
      },
      header2: {
        fontSize: 16,
        bold: true
      },
      anotherStyle: {
        italics: true,
        alignment: 'right'
      }
    },
  };
  pdfMake.createPdf(docDefinition).open()
}
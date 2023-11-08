/* eslint-disable radix */
/* eslint-disable react/style-prop-object */
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from 'html-to-pdfmake';
import imageToBase64 from 'image-to-base64/browser';

import pdfFonts from '../../../../fonts/custom-fonts';

const dateFns = require('date-fns');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

let logo = '';
let cmBox = '';
let noSig = '';
let inforSig = '';
let recvSig = '';
let operSig = '';
let usrPermitSig = '';
let permitSig = '';
let endSig = '';
let endName = '';
let pconfirmSig = '';
let pconfirmName = '';
let osconfirmSig = '';
let osconfirmName = '';
let auditSig = '';
const rToken = localStorage.getItem('token');

function clearData() {
  inforSig = '';
  recvSig = '';
  operSig = '';
  usrPermitSig = '';
  permitSig = '';
  endSig = '';
  endName = '';
  pconfirmSig = '';
  pconfirmName = '';
  osconfirmSig = '';
  osconfirmName = '';
  auditSig = '';
}

export default async function IIOSReport(data) {
  await clearData();
  noSig = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/nosignature.png`)}`;
  cmBox = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/CMBox.png`)}`;
  logo = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/logo.png`)}`;

  inforSig = await fetch(
    `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.informer_id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.data !== null && data.data !== undefined && data.data !== '') {
        return data.data;
      }
      return noSig;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  if (data.receiver_id !== '' && data.receiver_id !== null) {
    recvSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.receiver_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    recvSig = await noSig;
  }

  if (data.operator_id !== '' && data.operator_id !== null) {
    operSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.operator_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    operSig = await noSig;
  }

  if (data.user_permit_id !== '' && data.user_permit_id !== null) {
    usrPermitSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.user_permit_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    usrPermitSig = await noSig;
  }

  if (data.permit_id !== '' && data.permit_id !== null) {
    permitSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.permit_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    permitSig = await noSig;
  }

  if (data.audit_id !== '' && data.audit_id !== null) {
    auditSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.audit_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    auditSig = await noSig;
  }

  if (data.pconfirm_id !== '' && data.pconfirm_id !== null) {
    pconfirmName = `${data.pconfirm_firstname} ${data.pconfirm_lastname}`;

    pconfirmSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.pconfirm_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    pconfirmSig = await noSig;
  }

  if (data.osconfirm_id !== '' && data.osconfirm_id !== null) {
    osconfirmName = `${data.osconfirm_firstname} ${data.osconfirm_lastname}`;

    osconfirmSig = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getsignature/${data.osconfirm_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined && data.data !== '') {
          return data.data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    osconfirmSig = await noSig;
  }

  if (data.operator_id !== '' && data.operator_id !== null && data.task_date_end) {
    endSig = await operSig;
    endName = await `${data.operator_firstname} ${data.operator_lastname}`;
  } else {
    endSig = await noSig;
  }

  // eslint-disable-next-line new-cap
  const html = await htmlToPdfmake(
    `
        <table data-pdfmake="{'layout':'noBorders'}">
            <tr>
              <td><img src="${logo}" width="200" alt="logo" /></td>  
            </tr>
        </table><table class="marbot" data-pdfmake="{'widths':['auto','*','auto']}">
                <tr>
                    <td style="text-align:center">รหัสแบบฟอร์ม<br />
                        DMIS-001</td>
                    <td style="text-align:center"><strong>ใบแจ้งซ่อม/แจ้งติดตั้ง/แจ้งปัญหา<br />
                        ${
                          data.level_id === 'DMIS_IT'
                            ? '(งานเทคโนโลยีสารสนเทศ)'
                            : data.level_id === 'DMIS_MT'
                            ? '(งานซ่อมบำรุงทั่วไป)'
                            : '(งานซ่อมบำรุงเครื่องมือแพทย์)'
                        }</strong></td>
                    <td>เริ่มใช้วันที่ 7 พ.ย. 2566<br />
                        ปรับปรุงครั้งที่ 6 เมื่อ 7 พ.ย. 2566</td>
                </tr>
        </table><table data-pdfmake="{'heights':['auto',105],'widths':['*']}">
            <tr>
                <td><table data-pdfmake="{'widths':['*','auto'],'layout':'noBorders'}"><tr><td><strong>รายละเอียดการแจ้งปัญหา</strong></td><td><div style="text-align:right">เลขที่เอกสาร ${
                  data.task_id
                }</div></td></tr></table></td>
            </tr>
            <tr>
                <td>ชื่อผู้แจ้ง: ${data.informer_firstname} ${data.informer_lastname}\tตำแหน่ง: ${
      data.informer_position_name
    }\tเบอร์โทรศัพท์: ${
      data.task_phone_no === null || data.task_phone_no === '' ? 'ไม่ได้ระบุ' : data.task_phone_no
    }<br />
                    แผนกที่พบปัญหา: ${data.issue_department_name}\tวันที่แจ้ง: ${dateFns.format(
      dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7),
      'dd/MM/yyyy'
    )}<br />
                    รหัสทรัพย์สิน: ${
                      data.task_device_id === null || data.task_device_id === '' ? 'ไม่ได้ระบุ' : data.task_device_id
                    }\tSerial number: ${
      data.task_serialnumber === null || data.task_serialnumber === '' ? 'ไม่ได้ระบุ' : data.task_serialnumber
    }<br />
                    รายละเอียดของปัญหา: ${data.task_issue}</td>
            </tr>
        </table><table data-pdfmake="{'layout':'noBorders'}" data-pdfmake="{'widths':['*','*']}">
            <tr>
                <td style="text-align:center"><table data-pdfmake="{'widths':['*',105,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${inforSig}" width="110" height="30" alt="inforSig" /></td><td><div style="text-align:left">ผู้แจ้ง</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${data.informer_firstname} ${data.informer_lastname})<br/>
                    ${`วันที่ ${dateFns.format(
                      dateFns.subHours(dateFns.addYears(new Date(data.task_date_start), 543), 7),
                      'dd/MM/yyyy'
                    )}`}</td></td></table></td>

                <td style="text-align:center"><table data-pdfmake="{'widths':['*',110,'*'],'layout':'noBorders'}">
                    <tr><td class="center"><div style="text-align:right">ลงชื่อ</div></td><td><img src="${recvSig}" width="110" height="30" alt="recvSig" /></td><td><div style="text-align:left">ผู้รับเรื่อง</div></td></tr>
                    </table><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}">
                    <tr><td>(${
                      !data.receiver_firstname || data.receiver_firstname === undefined
                        ? '........................................'
                        : `${data.receiver_firstname} ${data.receiver_lastname}`
                    })<br/>
                    ${`วันที่${
                      !data.task_date_accept || data.task_date_accept === undefined
                        ? '...................................'
                        : ` ${dateFns.format(
                            dateFns.subHours(dateFns.addYears(new Date(data.task_date_accept), 543), 7),
                            'dd/MM/yyyy'
                          )}`
                    }`}</td></td></table></td>
            </tr>
        </table><table data-pdfmake="{'heights':['auto',85],'widths':['*']}">
            <tr>
                <td><strong>การประเมินงาน</strong></td>
            </tr>
            <tr>
                <td>การดำเนินงาน: ${
                  data.status_id !== 2 && data.status_id !== 5
                    ? data.status_id === 3
                      ? 'เปลี่ยนอะไหล่'
                      : data.status_name
                    : 'ดำเนินการโดยผู้รับผิดชอบ'
                }<br />
                งบประมาณที่ใช้: ${!data.task_cost || data.task_cost === undefined ? '0' : data.task_cost}<br/>
                    หมายเหตุ: ${data.task_note === null || data.task_note === '' ? '-' : data.task_note}</td>
                </tr>
        </table><table data-pdfmake="{'widths':${
          data.level_id === 'DMIS_IT' && data.category_id === 16 ? "['*','*','*']" : "['*','*']"
        }, 'layout':'noBorders'}">
        <tr style="text-align:center">
            <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ดำเนินการ</td></tr>
                <tr><td><img src="${operSig}" width="110" height="30" alt="operSig" /></td></tr>
                <tr><td>(${
                  !data.operator_firstname || data.operator_firstname === undefined || !data.operator_id
                    ? '........................................'
                    : `${data.operator_firstname} ${data.operator_lastname}`
                })</td></tr>
                <tr><td>${`วันที่ ${
                  !data.task_date_process || data.task_date_process === undefined
                    ? '...................................'
                    : ` ${dateFns.format(
                        dateFns.subHours(dateFns.addYears(new Date(data.task_date_process), 543), 7),
                        'dd/MM/yyyy'
                      )}`
                }`}</td></tr>
            </table></td>

            ${
              data.level_id === 'DMIS_IT' && data.category_id === 16
                ? `<td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ตรวจสอบ</td></tr>
            <tr><td><img src="${usrPermitSig}" width="110" height="30" alt="usrPermitSig" /></td></tr>
            <tr><td>(${
              !data.user_permit_firstname || data.user_permit_firstname === undefined
                ? '........................................'
                : `${data.user_permit_firstname} ${data.user_permit_lastname}`
            })</td></tr>
            <tr><td>${`วันที่ ${
              !data.user_permit_date || data.user_permit_date === undefined
                ? '...................................'
                : ` ${dateFns.format(
                    dateFns.subHours(dateFns.addYears(new Date(data.user_permit_date), 543), 7),
                    'dd/MM/yyyy'
                  )}`
            }`}</td></tr>
        </table></td>`
                : ''
            }

            <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>${
              data.level_id === 'DMIS_IT' && data.category_id === 16 ? `ผู้อนุมัติแก้ไขโปรแกรม` : `ผู้ตรวจสอบ`
            }</td></tr>
                    <tr><td><img src="${permitSig}" width="110" height="30" alt="permitSig" /></td></tr>
                    <tr><td>(${
                      !data.permit_firstname || data.permit_firstname === undefined
                        ? '........................................'
                        : `${data.permit_firstname} ${data.permit_lastname}`
                    })</td></tr>
                    <tr><td>${`วันที่${
                      !data.permit_date || data.permit_date === undefined
                        ? '...................................'
                        : ` ${dateFns.format(
                            dateFns.subHours(dateFns.addYears(new Date(data.permit_date), 543), 7),
                            'dd/MM/yyyy'
                          )}`
                    }`}</td></tr>
                </table></td></tr></table><table data-pdfmake="{'heights':['auto',85],'widths':['*']}">
            <tr>
                <td><strong>ผลการดำเนินงาน</strong></td>
            </tr>
            <tr>
                <td>รายละเอียดการแก้ไขปัญหา: ${
                  data.status_name === 'ยกเลิก'
                    ? 'ยกเลิกใบงาน'
                    : !data.task_date_end || data.task_date_end === undefined
                    ? '-<br/>'
                    : data.task_solution
                }<br/>
                    หมายเหตุ: ${
                      data.complete_note !== null && data.complete_note !== '' && data.permit_id !== null
                        ? data.complete_note
                        : '-'
                    }</td>
            </tr>
        </table>${
          !data.is_program_change
            ? ''
            : `<table data-pdfmake="{'layout':'noBorders'}"><tr><td><img src="${cmBox}" width="20" alt="cmBox" /></td><td>โปรแกรมได้รับการทดสอบ UAT แล้ว ขอนุมัติวางโปรแกรม</td></tr></table>`
        }<table data-pdfmake="{'widths':${
      data.level_id === 'DMIS_IT' ||
      ((data.level_id === 'DMIS_MT' || data.level_id === 'DMIS_MER') && data.status_id === 4)
        ? "['*','*','*']"
        : "['*','*']"
    }, 'layout':'noBorders'}">
            <tr style="text-align:center">
                <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ดำเนินการ</td></tr>
                    <tr><td><img src="${endSig}" width="110" height="30" alt="endSig" /></td></tr>
                    <tr><td>(${
                      !endName || endName === undefined ? '........................................' : `${endName}`
                    })</td></tr>
                    <tr><td>${`วันที่ ${
                      !data.task_date_end || data.task_date_end === undefined
                        ? '...................................'
                        : ` ${dateFns.format(
                            dateFns.subHours(dateFns.addYears(new Date(data.task_date_end), 543), 7),
                            'dd/MM/yyyy'
                          )}`
                    }`}</td></tr>
                </table></td>

                ${
                  data.level_id === 'DMIS_IT'
                    ? `<td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้อนุมัติวางโปรแกรม (ถ้ามี)</td></tr>
            <tr><td><img src="${pconfirmSig}" width="110" height="30" alt="pconfirmSig" /></td></tr>
            <tr><td>(${
              !pconfirmName || pconfirmName === undefined
                ? '........................................'
                : `${pconfirmName}`
            })</td></tr>
            <tr><td>${`วันที่ ${
              !data.pconfirm_date || data.pconfirm_date === undefined
                ? '...................................'
                : ` ${dateFns.format(
                    dateFns.subHours(dateFns.addYears(new Date(data.pconfirm_date), 543), 7),
                    'dd/MM/yyyy'
                  )}`
            }`}</td></tr>
        </table></td>`
                    : (data.level_id === 'DMIS_MT' || data.level_id === 'DMIS_MER') && data.status_id === 4
                    ? `<td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ตรวจสอบ</td></tr>
                    <tr><td><img src="${osconfirmSig}" width="110" height="30" alt="osconfirmSig" /></td></tr>
                    <tr><td>(${
                      !osconfirmName || osconfirmName === undefined
                        ? '........................................'
                        : `${osconfirmName}`
                    })</td></tr>
                    <tr><td>${`วันที่ ${
                      !data.osconfirm_date || data.osconfirm_date === undefined
                        ? '...................................'
                        : ` ${dateFns.format(
                            dateFns.subHours(dateFns.addYears(new Date(data.osconfirm_date), 543), 7),
                            'dd/MM/yyyy'
                          )}`
                    }`}</td></tr>
                </table></td>`
                    : ''
                }
                <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้รับทราบผลดำเนินงาน</td></tr>
                    <tr><td><img src="${auditSig}" width="110" height="30" alt="auditSig" /></td></tr>
                    <tr><td>(${
                      !data.audit_firstname || data.audit_firstname === undefined
                        ? '........................................'
                        : `${data.audit_firstname} ${data.audit_lastname}`
                    })</td></tr>
                    <tr><td>${`วันที่${
                      !data.audit_date || data.audit_date === undefined
                        ? '...................................'
                        : ` ${dateFns.format(
                            dateFns.subHours(dateFns.addYears(new Date(data.audit_date), 543), 7),
                            'dd/MM/yyyy'
                          )}`
                    }`}</td></tr>
                </table></td></tr></table>`,
    {
      removeExtraBlanks: true,
      defaultStyles: {
        // change the default styles
        table: '',
      },
    }
  );

  const date = new Date();

  const docDefinition = {
    info: {
      title: `IIOS${date.getDate()}${`0${parseInt(date.getMonth()) + 1}`.slice(-2)}${date.getFullYear()}`,
    },
    content: [html],
    defaultStyle: {
      font: 'THSarabunNew',
      fontSize: 14,
    },
    styles: {
      center: {
        marginBottom: 0,
        marginLeft: 15,
        alignment: 'center',
      },
      marbot: {
        marginBottom: 7,
      },
      test: {
        marginLeft: 2,
      },
    },
  };
  pdfMake.createPdf(docDefinition).open();
  return null;
}

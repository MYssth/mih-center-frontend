import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from 'html-to-pdfmake';
import imageToBase64 from 'image-to-base64/browser';
import { th } from 'date-fns/locale';

import pdfFonts from '../../../../fonts/custom-fonts';

const dateFns = require('date-fns');
// const formatDistance = require('date-fns/formatDistance');

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
let noSig = '';
let reqSig = '';
let rcvSig = '';
let permitSig = '';
let recSig = '';
// let header = {};
let grpList = '';

export default async function CBSReqDoc(data) {
  noSig = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/DMIS/nosignature.png`)}`;
  logo = await `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/logo.png`)}`;

  //   header = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/getsitesetting`)
  //     .then((response) => response.json())
  //     .then((data) => data)
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });

  grpList = await fetch(
    `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getschedidingrpid/${data.grp_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        return data;
      }
      return '-';
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  reqSig = await fetch(
    `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.req_pid}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== '') {
        return data.signature_data;
      }
      return noSig;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  if (data.rcv_pid !== '' && data.rcv_pid !== null) {
    rcvSig = await fetch(
      `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.rcv_pid}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== '') {
          return data.signature_data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    rcvSig = await noSig;
  }

  if (data.permit_pid !== '' && data.permit_pid !== null) {
    permitSig = await fetch(
      `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.permit_pid}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== '') {
          return data.signature_data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    permitSig = await noSig;
  }

  if (data.rec_pid !== '' && data.rec_pid !== null) {
    recSig = await fetch(
      `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getsignature/${data.rec_pid}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.signature_data !== null && data.signature_data !== undefined && data.signature_data !== '') {
          return data.signature_data;
        }
        return noSig;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    recSig = await noSig;
  }

  const html = await htmlToPdfmake(
    `<img src="${logo}" width="250" alt="logo" />
    <table data-pdfmake="{'layout':'noBorders', 'widths':['*']}">
        <tr>
            <td style="text-align:center"><h4>แบบฟอร์มขอใช้รถ</h4></td>
        </tr>
    </table>
    <table data-pdfmake="{'layout':'noBorders', 'widths':['*']}">
      <tr>
        <td>
          เลขที่: ${data.id}\tเลขกลุ่ม: ${data?.grp_id ? data.grp_id : '-'}</br>
          เลขที่ใบงานในกลุ่ม: ${grpList}</br>
          ชื่อผู้ขอใช้รถ: ${data.req_name}\tแผนก: ${data.dept_name}\tโทร: ${data?.tel_no ? data.tel_no : '-'}</br>
          ขอใช้รถวันที่: ${dateFns.format(
            dateFns.subHours(dateFns.addYears(new Date(data.from_date), 543), 7),
            'dd/MM/yyyy เวลา HH:mm น.'
            // ,{ locale: th }
          )} ถึง วันที่ ${dateFns.format(
      dateFns.subHours(dateFns.addYears(new Date(data.to_date), 543), 7),
      'dd/MM/yyyy เวลา HH:mm น.'
    )}</br>
          จำนวนผู้โดยสาร: ${data.pax_amt} คน\tสถานที่: ${data.place}\tจังหวัด: ${data.province}</br>
          ประเภทรถ: ${data?.car_type_name ? data.car_type_name : 'ยังไม่ระบุ'}\tรถที่ขอใช้: ${
      data?.car_name ? `${data.car_reg_no} ${data.car_name}` : 'ยังไม่ระบุ'
    }\tพนักงานขับรถ: ${data?.drv_name ? data.drv_name : 'ยังไม่ระบุ'}</br>
          รายละเอียด: ${data.detail}
        </td>
      </tr>
    </table>
    <table data-pdfmake="{'widths':['*','*','*'], 'layout':'noBorders'}">
      <tr style="text-align:center">
        <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้ขอใช้รถ</td></tr>
          <tr><td><img src="${reqSig}" width="110" height="30" alt="reqSig" /></td></tr>
          <tr><td>(${data.req_name})</td></tr>
          <tr><td>วันที่ ${dateFns.format(
            dateFns.subHours(dateFns.addYears(new Date(data.req_date), 543), 7),
            'dd/MM/yyyy'
          )}
          </td></tr>
        </table></td>
          <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้รับคำขอใช้รถ</td></tr>
            <tr><td><img src="${rcvSig}" width="110" height="30" alt="rcvSig" /></td></tr>
            <tr><td>(${
              data.rcv_name === null || data.rcv_name === '' || data.rcv_name === undefined
                ? '........................................'
                : `${data.rcv_name}`
            })</td></tr>
            <tr><td>วันที่ ${
              data.rcv_date === null || data.rcv_date === ''
                ? '...................................'
                : `${dateFns.format(dateFns.subHours(dateFns.addYears(new Date(data.rcv_date), 543), 7), 'dd/MM/yyyy')}`
            }
          </td></tr>
        </table></td>
          <td><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้อนุมัติคำขอใช้รถ</td></tr>
            <tr><td><img src="${permitSig}" width="110" height="30" alt="permitSig" /></td></tr>
            <tr><td>(${
              data.permit_name === null || data.permit_name === '' || data.permit_name === undefined
                ? '........................................'
                : `${data.permit_name}`
            })</td></tr>
            <tr><td>วันที่ ${
              data.permit_date === null || data.permit_date === ''
                ? '...................................'
                : ` ${dateFns.format(
                    dateFns.subHours(dateFns.addYears(new Date(data.permit_date), 543), 7),
                    'dd/MM/yyyy'
                  )}`
            }
          </td></tr>
          </table></td>
          </tr>
        </table>
        <hr>
        <table data-pdfmake="{'layout':'noBorders', 'widths':['*']}">
            <tr>
                <td style="text-align:center"><h4>บันทึกการใช้รถ</h4></td>
            </tr>
        </table>
        <table data-pdfmake="{'layout':'noBorders', 'widths':['*','*']}">
          <tr>
            <td>
              <strong>รถออก</strong></br>
              วันที่: ${
                data.dep_date === null || data.dep_date === ''
                  ? '.............................. เวลา .................'
                  : ` ${dateFns.format(
                      dateFns.subHours(dateFns.addYears(new Date(data.dep_date), 543), 7),
                      'dd/MM/yyyy เวลา HH:mm น.'
                    )}`
              } เลขไมล์: ${data?.dep_mi ? data.dep_mi : '-'}
            </td>
            <td>
              <strong>รถเข้า</strong></br>
              วันที่: ${
                data.arr_date === null || data.arr_date === ''
                  ? '.............................. เวลา .................'
                  : ` ${dateFns.format(
                      dateFns.subHours(dateFns.addYears(new Date(data.arr_date), 543), 7),
                      'dd/MM/yyyy เวลา HH:mm น.'
                    )}`
              } เลขไมล์: ${data?.arr_mi ? data.arr_mi : '-'}
            </td>
          </tr>
        </table>
        <table data-pdfmake="{'widths':['*','*','*'],'layout':'noBorders'}">
          <tr>
            <td>
              รวมระยะเวลา: ${
                data?.arr_date && data?.dep_date
                  ? dateFns.formatDistance(new Date(data.dep_date), new Date(data.arr_date), { locale: th })
                  : '-'
              }</br>
              รวมระยะทาง: ${data?.arrmi && data?.dep_mi ? data.arr_mi - data.dep_mi : '-'}</br>
            </td>
            <td></td>
            <td style="text-align:center"><table data-pdfmake="{'widths':['*'],'layout':'noBorders'}"><tr><td>ผู้บันทึก</td></tr>
                <tr><td><img src="${recSig}" width="110" height="30" alt="rcvSig" /></td></tr>
                <tr><td>(${
                  data.rec_name === null || data.rec_name === '' || data.rec_name === undefined
                    ? '........................................'
                    : `${data.rec_name}`
                })</td></tr>
                <tr><td>วันที่ ${
                  data.rec_date === null || data.rec_date === ''
                    ? '...................................'
                    : ` ${dateFns.format(
                        dateFns.subHours(dateFns.addYears(new Date(data.rec_date), 543), 7),
                        'dd/MM/yyyy'
                      )}`
                }
                </td></tr>
              </table>
            </td>
          </tr>
        </table>`,
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
      title: `CBS${date.getDate()}${`0${parseInt(date.getMonth(), 10) + 1}`.slice(-2)}${date.getFullYear()}`,
    },
    content: [html],
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

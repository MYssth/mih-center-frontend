const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');
const moment = require('moment');

moment.locale('en');

export default async function CBSSchedListExcel(data, rToken) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ExcelJS sheet');

  worksheet.getColumn('A').width = 12;
  worksheet.getColumn('B').width = 6;
  worksheet.getColumn('C').width = 12;
  worksheet.getColumn('D').width = 24;
  worksheet.getColumn('E').width = 31;
  worksheet.getColumn('F').width = 20;
  worksheet.getColumn('G').width = 14;
  worksheet.getColumn('H').width = 13;
  worksheet.getColumn('I').width = 96;
  worksheet.getColumn('J').width = 56;
  worksheet.getColumn('K').width = 19;
  worksheet.getColumn('L').width = 12;
  worksheet.getColumn('M').width = 6;
  worksheet.getColumn('N').width = 12;
  worksheet.getColumn('O').width = 6;
  worksheet.getColumn('P').width = 23;
  worksheet.getColumn('Q').width = 12;
  worksheet.getColumn('R').width = 6;
  worksheet.getColumn('S').width = 23;
  worksheet.getColumn('T').width = 12;
  worksheet.getColumn('U').width = 6;
  worksheet.getColumn('V').width = 15;
  worksheet.getColumn('W').width = 15;
  worksheet.getColumn('X').width = 12;
  worksheet.getColumn('Y').width = 23;

  worksheet.getCell('A1').value = 'รายงานขอใช้รถโรงพยาบาลมุกดาหารอินเตอร์เนชั่นแนล';
  worksheet.getCell('A1').font = {
    name: 'TH SarabunPSK',
    size: 20,
    bold: true,
  };
  worksheet.mergeCells('A1:Y1');
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

  let row = 3;
  const HFont = {
    name: 'TH Sarabun New',
    size: 16,
    bold: true,
  };
  const NFont = {
    name: 'TH Sarabun New',
    size: 16,
  };
  const border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  worksheet.getCell(`A${row}`).value = 'วันที่ส่ง';
  worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`A${row}`).font = HFont;
  worksheet.getCell(`A${row}`).border = border;

  worksheet.getCell(`B${row}`).value = 'เวลา';
  worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`B${row}`).font = HFont;
  worksheet.getCell(`B${row}`).border = border;

  worksheet.getCell(`C${row}`).value = 'เลขที่';
  worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`C${row}`).font = HFont;
  worksheet.getCell(`C${row}`).border = border;

  worksheet.getCell(`D${row}`).value = 'ชื่อผู้ขอใช้รถ';
  worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`D${row}`).font = HFont;
  worksheet.getCell(`D${row}`).border = border;

  worksheet.getCell(`E${row}`).value = 'แผนก';
  worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`E${row}`).font = HFont;
  worksheet.getCell(`E${row}`).border = border;

  worksheet.getCell(`F${row}`).value = 'ฝ่าย';
  worksheet.getCell(`F${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`F${row}`).font = HFont;
  worksheet.getCell(`F${row}`).border = border;

  worksheet.getCell(`G${row}`).value = 'ประเภทรถ';
  worksheet.getCell(`G${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`G${row}`).font = HFont;
  worksheet.getCell(`G${row}`).border = border;

  worksheet.getCell(`H${row}`).value = 'ทะเบียนรถ';
  worksheet.getCell(`H${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`H${row}`).font = HFont;
  worksheet.getCell(`H${row}`).border = border;

  worksheet.getCell(`I${row}`).value = 'เหตุผลการขอ';
  worksheet.getCell(`I${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`I${row}`).font = HFont;
  worksheet.getCell(`I${row}`).border = border;

  worksheet.getCell(`J${row}`).value = 'สถานที่';
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).font = HFont;
  worksheet.getCell(`J${row}`).border = border;

  worksheet.getCell(`K${row}`).value = 'ชื่อผู้ขับ';
  worksheet.getCell(`K${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`K${row}`).font = HFont;
  worksheet.getCell(`K${row}`).border = border;

  worksheet.getCell(`L${row}`).value = 'วันที่ไป';
  worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`L${row}`).font = HFont;
  worksheet.getCell(`L${row}`).border = border;

  worksheet.getCell(`M${row}`).value = 'เวลา';
  worksheet.getCell(`M${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`M${row}`).font = HFont;
  worksheet.getCell(`M${row}`).border = border;

  worksheet.getCell(`N${row}`).value = 'วันที่กลับ';
  worksheet.getCell(`N${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`N${row}`).font = HFont;
  worksheet.getCell(`N${row}`).border = border;

  worksheet.getCell(`O${row}`).value = 'เวลา';
  worksheet.getCell(`O${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`O${row}`).font = HFont;
  worksheet.getCell(`O${row}`).border = border;

  worksheet.getCell(`P${row}`).value = 'ชื่อผู้รับใบขอใช้รถ';
  worksheet.getCell(`P${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`P${row}`).font = HFont;
  worksheet.getCell(`P${row}`).border = border;

  worksheet.getCell(`Q${row}`).value = 'วันที่รับงาน';
  worksheet.getCell(`Q${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`Q${row}`).font = HFont;
  worksheet.getCell(`Q${row}`).border = border;

  worksheet.getCell(`R${row}`).value = 'เวลา';
  worksheet.getCell(`R${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`R${row}`).font = HFont;
  worksheet.getCell(`R${row}`).border = border;

  worksheet.getCell(`S${row}`).value = 'ชื่อผู้อนุมัติขอใช้รถ';
  worksheet.getCell(`S${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`S${row}`).font = HFont;
  worksheet.getCell(`S${row}`).border = border;

  worksheet.getCell(`T${row}`).value = 'วันที่อนุมัติ';
  worksheet.getCell(`T${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`T${row}`).font = HFont;
  worksheet.getCell(`T${row}`).border = border;

  worksheet.getCell(`U${row}`).value = 'เวลา';
  worksheet.getCell(`U${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`U${row}`).font = HFont;
  worksheet.getCell(`U${row}`).border = border;

  worksheet.getCell(`V${row}`).value = 'เลขไมล์ก่อนออก';
  worksheet.getCell(`V${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`V${row}`).font = HFont;
  worksheet.getCell(`V${row}`).border = border;

  worksheet.getCell(`W${row}`).value = 'เลขไมล์หลังออก';
  worksheet.getCell(`W${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`W${row}`).font = HFont;
  worksheet.getCell(`W${row}`).border = border;

  worksheet.getCell(`X${row}`).value = 'สถานะ';
  worksheet.getCell(`X${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`X${row}`).font = HFont;
  worksheet.getCell(`X${row}`).border = border;

  worksheet.getCell(`Y${row}`).value = 'หมายเหตุ';
  worksheet.getCell(`Y${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`Y${row}`).font = HFont;
  worksheet.getCell(`Y${row}`).border = border;

  row += 1;

  for (let i = 0; i < data.length; i += 1) {
    if (data.length !== 0) {
      worksheet.getCell(`A${row}`).value = `${new Date(data[i].req_date).getDate()}/${
        new Date(data[i].req_date).getMonth() + 1
      }/${new Date(data[i].req_date).getFullYear()}`;
      worksheet.getCell(`A${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`A${row}`).font = NFont;
      worksheet.getCell(`A${row}`).border = border;

      worksheet.getCell(`B${row}`).value = `${moment.utc(data[i].req_date).format('HH:mm')}`;
      worksheet.getCell(`B${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`B${row}`).font = NFont;
      worksheet.getCell(`B${row}`).border = border;

      worksheet.getCell(`C${row}`).value = data[i].id;
      worksheet.getCell(`C${row}`).font = NFont;
      worksheet.getCell(`C${row}`).border = border;

      worksheet.getCell(`D${row}`).value = data[i].req_name;
      worksheet.getCell(`D${row}`).font = NFont;
      worksheet.getCell(`D${row}`).border = border;

      worksheet.getCell(`E${row}`).value = data[i].dept_name;
      worksheet.getCell(`E${row}`).font = NFont;
      worksheet.getCell(`E${row}`).border = border;

      worksheet.getCell(`F${row}`).value = data[i].fac_name;
      worksheet.getCell(`F${row}`).font = NFont;
      worksheet.getCell(`F${row}`).border = border;

      worksheet.getCell(`G${row}`).value = data[i].car_type_name;
      worksheet.getCell(`G${row}`).font = NFont;
      worksheet.getCell(`G${row}`).border = border;

      worksheet.getCell(`H${row}`).value = data[i].car_reg_no;
      worksheet.getCell(`H${row}`).font = NFont;
      worksheet.getCell(`H${row}`).border = border;

      worksheet.getCell(`I${row}`).value = data[i].detail;
      worksheet.getCell(`I${row}`).font = NFont;
      worksheet.getCell(`I${row}`).border = border;

      worksheet.getCell(`J${row}`).value = data[i].place;
      worksheet.getCell(`J${row}`).font = NFont;
      worksheet.getCell(`J${row}`).border = border;

      worksheet.getCell(`K${row}`).value = data[i].drv_name;
      worksheet.getCell(`K${row}`).font = NFont;
      worksheet.getCell(`K${row}`).border = border;

      worksheet.getCell(`L${row}`).value = `${moment.utc(data[i].from_date).format('DD/MM/YYYY')}`;
      worksheet.getCell(`L${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`L${row}`).font = NFont;
      worksheet.getCell(`L${row}`).border = border;

      worksheet.getCell(`M${row}`).value = `${moment.utc(data[i].from_date).format('HH:mm')}`;
      worksheet.getCell(`M${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`M${row}`).font = NFont;
      worksheet.getCell(`M${row}`).border = border;

      worksheet.getCell(`N${row}`).value = `${moment.utc(data[i].to_date).format('DD/MM/YYYY')}`;
      worksheet.getCell(`N${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`N${row}`).font = NFont;
      worksheet.getCell(`N${row}`).border = border;

      worksheet.getCell(`O${row}`).value = `${moment.utc(data[i].to_date).format('HH:mm')}`;
      worksheet.getCell(`O${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`O${row}`).font = NFont;
      worksheet.getCell(`O${row}`).border = border;

      worksheet.getCell(`P${row}`).value = data[i].rcv_name ?? '-';
      worksheet.getCell(`P${row}`).font = NFont;
      worksheet.getCell(`P${row}`).border = border;

      worksheet.getCell(`Q${row}`).value = data[i].rcv_date
        ? `${moment.utc(data[i].rcv_date).format('DD/MM/YYYY')}`
        : '-';
      worksheet.getCell(`Q${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`Q${row}`).font = NFont;
      worksheet.getCell(`Q${row}`).border = border;

      worksheet.getCell(`R${row}`).value = data[i].rcv_date ? `${moment.utc(data[i].rcv_date).format('HH:mm')}` : '-';
      worksheet.getCell(`R${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`R${row}`).font = NFont;
      worksheet.getCell(`R${row}`).border = border;

      worksheet.getCell(`S${row}`).value = data[i].permit_name ?? '-';
      worksheet.getCell(`S${row}`).font = NFont;
      worksheet.getCell(`S${row}`).border = border;

      worksheet.getCell(`T${row}`).value = data[i].rcv_date
        ? `${moment.utc(data[i].permit_date).format('DD/MM/YYYY')}`
        : '-';
      worksheet.getCell(`T${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`T${row}`).font = NFont;
      worksheet.getCell(`T${row}`).border = border;

      worksheet.getCell(`U${row}`).value = data[i].rcv_date
        ? `${moment.utc(data[i].permit_date).format('HH:mm')}`
        : '-';
      worksheet.getCell(`U${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`U${row}`).font = NFont;
      worksheet.getCell(`U${row}`).border = border;

      worksheet.getCell(`V${row}`).value = data[i].dep_mi ?? '-';
      worksheet.getCell(`V${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`V${row}`).font = NFont;
      worksheet.getCell(`V${row}`).border = border;

      worksheet.getCell(`W${row}`).value = data[i].arr_mi ?? '-';
      worksheet.getCell(`W${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`W${row}`).font = NFont;
      worksheet.getCell(`W${row}`).border = border;

      worksheet.getCell(`X${row}`).value = data[i].status_name;
      worksheet.getCell(`X${row}`).font = NFont;
      worksheet.getCell(`X${row}`).border = border;

      worksheet.getCell(`Y${row}`).value = data[i].note;
      worksheet.getCell(`Y${row}`).font = NFont;
      worksheet.getCell(`Y${row}`).border = border;

      row += 1;
    }
  }

  row += 2;
  worksheet.mergeCells(`A${row}:I${row}`);
  worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`A${row}`).value = `ลงชื่อ ..................................................................... ผู้จัดทำ`;
  worksheet.getCell(`A${row}`).font = NFont;

  worksheet.mergeCells(`J${row}:Y${row}`);
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).value = `ลงชื่อ ..................................................................... ผู้ตรวจสอบ`;
  worksheet.getCell(`J${row}`).font = NFont;

  row+=1;
  worksheet.mergeCells(`A${row}:I${row}`);
  worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`A${row}`).value = `(                                                                  )`;
  worksheet.getCell(`A${row}`).font = NFont;

  worksheet.mergeCells(`J${row}:Y${row}`);
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).value = `(                                                                  )`;
  worksheet.getCell(`J${row}`).font = NFont;

  row+=1;
  worksheet.mergeCells(`A${row}:I${row}`);
  worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`A${row}`).value = `วันที่ ........................................................`;
  worksheet.getCell(`A${row}`).font = NFont;

  worksheet.mergeCells(`J${row}:Y${row}`);
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).value = `วันที่ ........................................................`;
  worksheet.getCell(`J${row}`).font = NFont;

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(
      blob,
      `รายงานของใช้รถ_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}.xlsx`
    );
  });
}

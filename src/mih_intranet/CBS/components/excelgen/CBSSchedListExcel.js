const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');

export default async function CBSSchedListExcel(data, rToken) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ExcelJS sheet');

  worksheet.getColumn('A').width = 11;
  worksheet.getColumn('B').width = 24;
  worksheet.getColumn('C').width = 31;
  worksheet.getColumn('D').width = 20;
  worksheet.getColumn('E').width = 14;
  worksheet.getColumn('F').width = 13;
  worksheet.getColumn('G').width = 96;
  worksheet.getColumn('H').width = 56;
  worksheet.getColumn('I').width = 12;
  worksheet.getColumn('J').width = 19;
  worksheet.getColumn('K').width = 6;
  worksheet.getColumn('L').width = 23;
  worksheet.getColumn('M').width = 15;
  worksheet.getColumn('N').width = 15;

  worksheet.getCell('A1').value = 'ทะเบียนคุมใบขอใช้รถโรงพยาบาลมุกดาหารอินเตอร์เนชั่นแนล';
  worksheet.getCell('A1').font = {
    name: 'TH SarabunPSK',
    size: 20,
    bold: true,
  };
  worksheet.mergeCells('A1:N1');
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

  worksheet.getCell(`B${row}`).value = 'ชื่อผู้ขอใช้รถ';
  worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`B${row}`).font = HFont;
  worksheet.getCell(`B${row}`).border = border;

  worksheet.getCell(`C${row}`).value = 'แผนก';
  worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`C${row}`).font = HFont;
  worksheet.getCell(`C${row}`).border = border;

  worksheet.getCell(`D${row}`).value = 'ฝ่าย';
  worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`D${row}`).font = HFont;
  worksheet.getCell(`D${row}`).border = border;

  worksheet.getCell(`E${row}`).value = 'ประเภทรถ';
  worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`E${row}`).font = HFont;
  worksheet.getCell(`E${row}`).border = border;

  worksheet.getCell(`F${row}`).value = 'ทะเบียนรถ';
  worksheet.getCell(`F${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`F${row}`).font = HFont;
  worksheet.getCell(`F${row}`).border = border;

  worksheet.getCell(`G${row}`).value = 'เหตุผลการขอ';
  worksheet.getCell(`G${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`G${row}`).font = HFont;
  worksheet.getCell(`G${row}`).border = border;

  worksheet.getCell(`H${row}`).value = 'สถานที่';
  worksheet.getCell(`H${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`H${row}`).font = HFont;
  worksheet.getCell(`H${row}`).border = border;

  worksheet.getCell(`I${row}`).value = 'วันที่ขอใช้รถ';
  worksheet.getCell(`I${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`I${row}`).font = HFont;
  worksheet.getCell(`I${row}`).border = border;

  worksheet.getCell(`J${row}`).value = 'ชื่อผู้ขับ';
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).font = HFont;
  worksheet.getCell(`J${row}`).border = border;

  worksheet.getCell(`K${row}`).value = 'เวลา';
  worksheet.getCell(`K${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`K${row}`).font = HFont;
  worksheet.getCell(`K${row}`).border = border;

  worksheet.getCell(`L${row}`).value = 'ชื่อผู้รับใบขอใช้รถ';
  worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`L${row}`).font = HFont;
  worksheet.getCell(`L${row}`).border = border;

  worksheet.getCell(`M${row}`).value = 'เลขไมล์ก่อนออก';
  worksheet.getCell(`M${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`M${row}`).font = HFont;
  worksheet.getCell(`M${row}`).border = border;

  worksheet.getCell(`N${row}`).value = 'เลขไมล์หลังออก';
  worksheet.getCell(`N${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`N${row}`).font = HFont;
  worksheet.getCell(`N${row}`).border = border;

  row += 1;

  for (let i = 0; i < data.length; i += 1) {
    if (data.length !== 0) {
      worksheet.getCell(`A${row}`).value = `${new Date(data[i].req_date).getDate()}/${new Date(
        data[i].req_date
      ).getMonth()}/${new Date(data[i].req_date).getFullYear()}`;
      worksheet.getCell(`A${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`A${row}`).font = NFont;
      worksheet.getCell(`A${row}`).border = border;

      worksheet.getCell(`B${row}`).value = data[i].req_name;
      worksheet.getCell(`B${row}`).font = NFont;
      worksheet.getCell(`B${row}`).border = border;

      worksheet.getCell(`C${row}`).value = data[i].dept_name;
      worksheet.getCell(`C${row}`).font = NFont;
      worksheet.getCell(`C${row}`).border = border;

      worksheet.getCell(`D${row}`).value = data[i].fac_name;
      worksheet.getCell(`D${row}`).font = NFont;
      worksheet.getCell(`D${row}`).border = border;

      worksheet.getCell(`E${row}`).value = data[i].car_type_name;
      worksheet.getCell(`E${row}`).font = NFont;
      worksheet.getCell(`E${row}`).border = border;

      worksheet.getCell(`F${row}`).value = data[i].car_reg_no;
      worksheet.getCell(`F${row}`).font = NFont;
      worksheet.getCell(`F${row}`).border = border;

      worksheet.getCell(`G${row}`).value = data[i].detail;
      worksheet.getCell(`G${row}`).font = NFont;
      worksheet.getCell(`G${row}`).border = border;

      worksheet.getCell(`H${row}`).value = data[i].place;
      worksheet.getCell(`H${row}`).font = NFont;
      worksheet.getCell(`H${row}`).border = border;

      worksheet.getCell(`I${row}`).value = `${new Date(data[i].from_date).getDate()}/${new Date(
        data[i].from_date
      ).getMonth()}/${new Date(data[i].from_date).getFullYear()}`;
      worksheet.getCell(`I${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`I${row}`).font = NFont;
      worksheet.getCell(`I${row}`).border = border;

      worksheet.getCell(`J${row}`).value = data[i].drv_name;
      worksheet.getCell(`J${row}`).font = NFont;
      worksheet.getCell(`J${row}`).border = border;

      worksheet.getCell(`K${row}`).value = `${String(new Date(data[i].from_date).getHours()).padStart(2, '0')}:${String(
        new Date(data[i].from_date).getMinutes()
      ).padStart(2, '0')}`;
      worksheet.getCell(`K${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`K${row}`).font = NFont;
      worksheet.getCell(`K${row}`).border = border;

      worksheet.getCell(`L${row}`).value = data[i].rcv_name ?? '-';
      worksheet.getCell(`L${row}`).font = NFont;
      worksheet.getCell(`L${row}`).border = border;
      
      worksheet.getCell(`M${row}`).value = data[i].dep_mi ?? '-';
      worksheet.getCell(`M${row}`).font = NFont;
      worksheet.getCell(`M${row}`).border = border;
      
      worksheet.getCell(`N${row}`).value = data[i].arr_mi ?? '-';
      worksheet.getCell(`N${row}`).font = NFont;
      worksheet.getCell(`N${row}`).border = border;

      row += 1;
    }
  }

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, 'output.xlsx');
  });
}

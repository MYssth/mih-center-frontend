const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');
const moment = require('moment');

moment.locale('en');

export default async function CBSSchedListExcel(data, rToken) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ExcelJS sheet');

  worksheet.getColumn('A').width = 12;
  worksheet.getColumn('B').width = 12;
  worksheet.getColumn('C').width = 24;
  worksheet.getColumn('D').width = 31;
  worksheet.getColumn('E').width = 20;
  worksheet.getColumn('F').width = 14;
  worksheet.getColumn('G').width = 13;
  worksheet.getColumn('H').width = 96;
  worksheet.getColumn('I').width = 56;
  worksheet.getColumn('J').width = 19;
  worksheet.getColumn('K').width = 12;
  worksheet.getColumn('L').width = 6;
  worksheet.getColumn('M').width = 12;
  worksheet.getColumn('N').width = 6;
  worksheet.getColumn('O').width = 23;
  worksheet.getColumn('P').width = 23;
  worksheet.getColumn('Q').width = 15;
  worksheet.getColumn('R').width = 15;
  worksheet.getColumn('S').width = 12;
  worksheet.getColumn('T').width = 23;

  worksheet.getCell('A1').value = 'รายงานขอใช้รถโรงพยาบาลมุกดาหารอินเตอร์เนชั่นแนล';
  worksheet.getCell('A1').font = {
    name: 'TH SarabunPSK',
    size: 20,
    bold: true,
  };
  worksheet.mergeCells('A1:T1');
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

  worksheet.getCell(`B${row}`).value = 'เลขที่';
  worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`B${row}`).font = HFont;
  worksheet.getCell(`B${row}`).border = border;

  worksheet.getCell(`C${row}`).value = 'ชื่อผู้ขอใช้รถ';
  worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`C${row}`).font = HFont;
  worksheet.getCell(`C${row}`).border = border;

  worksheet.getCell(`D${row}`).value = 'แผนก';
  worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`D${row}`).font = HFont;
  worksheet.getCell(`D${row}`).border = border;

  worksheet.getCell(`E${row}`).value = 'ฝ่าย';
  worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`E${row}`).font = HFont;
  worksheet.getCell(`E${row}`).border = border;

  worksheet.getCell(`F${row}`).value = 'ประเภทรถ';
  worksheet.getCell(`F${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`F${row}`).font = HFont;
  worksheet.getCell(`F${row}`).border = border;

  worksheet.getCell(`G${row}`).value = 'ทะเบียนรถ';
  worksheet.getCell(`G${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`G${row}`).font = HFont;
  worksheet.getCell(`G${row}`).border = border;

  worksheet.getCell(`H${row}`).value = 'เหตุผลการขอ';
  worksheet.getCell(`H${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`H${row}`).font = HFont;
  worksheet.getCell(`H${row}`).border = border;

  worksheet.getCell(`I${row}`).value = 'สถานที่';
  worksheet.getCell(`I${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`I${row}`).font = HFont;
  worksheet.getCell(`I${row}`).border = border;

  worksheet.getCell(`J${row}`).value = 'ชื่อผู้ขับ';
  worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`J${row}`).font = HFont;
  worksheet.getCell(`J${row}`).border = border;

  worksheet.getCell(`K${row}`).value = 'วันที่ไป';
  worksheet.getCell(`K${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`K${row}`).font = HFont;
  worksheet.getCell(`K${row}`).border = border;
  
  worksheet.getCell(`L${row}`).value = 'เวลา';
  worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`L${row}`).font = HFont;
  worksheet.getCell(`L${row}`).border = border;

  worksheet.getCell(`M${row}`).value = 'วันที่กลับ';
  worksheet.getCell(`M${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`M${row}`).font = HFont;
  worksheet.getCell(`M${row}`).border = border;
  
  worksheet.getCell(`N${row}`).value = 'เวลา';
  worksheet.getCell(`N${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`N${row}`).font = HFont;
  worksheet.getCell(`N${row}`).border = border;

  worksheet.getCell(`O${row}`).value = 'ชื่อผู้รับใบขอใช้รถ';
  worksheet.getCell(`O${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`O${row}`).font = HFont;
  worksheet.getCell(`O${row}`).border = border;

  worksheet.getCell(`P${row}`).value = 'ชื่อผู้อนุมัติขอใช้รถ';
  worksheet.getCell(`P${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`P${row}`).font = HFont;
  worksheet.getCell(`P${row}`).border = border;

  worksheet.getCell(`Q${row}`).value = 'เลขไมล์ก่อนออก';
  worksheet.getCell(`Q${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`Q${row}`).font = HFont;
  worksheet.getCell(`Q${row}`).border = border;

  worksheet.getCell(`R${row}`).value = 'เลขไมล์หลังออก';
  worksheet.getCell(`R${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`R${row}`).font = HFont;
  worksheet.getCell(`R${row}`).border = border;

  worksheet.getCell(`S${row}`).value = 'สถานะ';
  worksheet.getCell(`S${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`S${row}`).font = HFont;
  worksheet.getCell(`S${row}`).border = border;

  worksheet.getCell(`T${row}`).value = 'หมายเหตุ';
  worksheet.getCell(`T${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell(`T${row}`).font = HFont;
  worksheet.getCell(`T${row}`).border = border;

  row += 1;

  for (let i = 0; i < data.length; i += 1) {
    if (data.length !== 0) {
      worksheet.getCell(`A${row}`).value = `${new Date(data[i].req_date).getDate()}/${
        new Date(data[i].req_date).getMonth() + 1
      }/${new Date(data[i].req_date).getFullYear()}`;
      worksheet.getCell(`A${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`A${row}`).font = NFont;
      worksheet.getCell(`A${row}`).border = border;

      worksheet.getCell(`B${row}`).value = data[i].id;
      worksheet.getCell(`B${row}`).font = NFont;
      worksheet.getCell(`B${row}`).border = border;

      worksheet.getCell(`C${row}`).value = data[i].req_name;
      worksheet.getCell(`C${row}`).font = NFont;
      worksheet.getCell(`C${row}`).border = border;

      worksheet.getCell(`D${row}`).value = data[i].dept_name;
      worksheet.getCell(`D${row}`).font = NFont;
      worksheet.getCell(`D${row}`).border = border;

      worksheet.getCell(`E${row}`).value = data[i].fac_name;
      worksheet.getCell(`E${row}`).font = NFont;
      worksheet.getCell(`E${row}`).border = border;

      worksheet.getCell(`F${row}`).value = data[i].car_type_name;
      worksheet.getCell(`F${row}`).font = NFont;
      worksheet.getCell(`F${row}`).border = border;

      worksheet.getCell(`G${row}`).value = data[i].car_reg_no;
      worksheet.getCell(`G${row}`).font = NFont;
      worksheet.getCell(`G${row}`).border = border;

      worksheet.getCell(`H${row}`).value = data[i].detail;
      worksheet.getCell(`H${row}`).font = NFont;
      worksheet.getCell(`H${row}`).border = border;

      worksheet.getCell(`I${row}`).value = data[i].place;
      worksheet.getCell(`I${row}`).font = NFont;
      worksheet.getCell(`I${row}`).border = border;

      worksheet.getCell(`J${row}`).value = data[i].drv_name;
      worksheet.getCell(`J${row}`).font = NFont;
      worksheet.getCell(`J${row}`).border = border;

      worksheet.getCell(`K${row}`).value = `${moment.utc(data[i].from_date).format('DD/MM/YYYY')}`;
      worksheet.getCell(`K${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`K${row}`).font = NFont;
      worksheet.getCell(`K${row}`).border = border;
      
      worksheet.getCell(`L${row}`).value = `${moment.utc(data[i].from_date).format('HH:mm')}`;
      worksheet.getCell(`L${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`L${row}`).font = NFont;
      worksheet.getCell(`L${row}`).border = border;

      worksheet.getCell(`M${row}`).value = `${moment.utc(data[i].to_date).format('DD/MM/YYYY')}`;
      worksheet.getCell(`M${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`M${row}`).font = NFont;
      worksheet.getCell(`M${row}`).border = border;
      
      worksheet.getCell(`N${row}`).value = `${moment.utc(data[i].to_date).format('HH:mm')}`;
      worksheet.getCell(`N${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`N${row}`).font = NFont;
      worksheet.getCell(`N${row}`).border = border;

      worksheet.getCell(`O${row}`).value = data[i].rcv_name ?? '-';
      worksheet.getCell(`O${row}`).font = NFont;
      worksheet.getCell(`O${row}`).border = border;

      worksheet.getCell(`P${row}`).value = data[i].permit_name ?? '-';
      worksheet.getCell(`P${row}`).font = NFont;
      worksheet.getCell(`P${row}`).border = border;

      worksheet.getCell(`Q${row}`).value = data[i].dep_mi ?? '-';
      worksheet.getCell(`Q${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`Q${row}`).font = NFont;
      worksheet.getCell(`Q${row}`).border = border;

      worksheet.getCell(`R${row}`).value = data[i].arr_mi ?? '-';
      worksheet.getCell(`R${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`R${row}`).font = NFont;
      worksheet.getCell(`R${row}`).border = border;

      worksheet.getCell(`S${row}`).value = data[i].status_name;
      worksheet.getCell(`S${row}`).font = NFont;
      worksheet.getCell(`S${row}`).border = border;

      worksheet.getCell(`T${row}`).value = data[i].note;
      worksheet.getCell(`T${row}`).font = NFont;
      worksheet.getCell(`T${row}`).border = border;

      row += 1;
    }
  }

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

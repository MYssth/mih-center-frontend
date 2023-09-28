const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');

export default async function TRSPsnListExcel(data, topicId, rToken) {
  const topicProp = await fetch(
    `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getexcelreport/${topicId}`,
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
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ExcelJS sheet');

  worksheet.getColumn('A').width = 8;
  worksheet.getColumn('B').width = 13;
  worksheet.getColumn('C').width = 23;
  worksheet.getColumn('D').width = 45;
  worksheet.getColumn('E').width = 32;

  worksheet.getCell('A1').value = topicProp.topic_name;
  worksheet.getCell('A1').font = {
    name: 'TH Sarabun New',
    size: 18,
    bold: true,
  };
  worksheet.mergeCells('A1:E1');
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

  for (let i = 1; i <= topicProp.sub_amt + 1; i += 1) {
    const subTopicFilter = data.filter((data) => data.sub_id === `S${String(i).padStart(2, '0')}`);

    if (subTopicFilter.length !== 0) {
      worksheet.getCell(`A${row}`).value = subTopicFilter[0].sub_name;
      worksheet.getCell(`A${row}`).font = HFont;
      worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.mergeCells(`A${row}:E${row}`);
      row += 1;

      worksheet.getCell(`A${row}`).value = 'ลำดับที่';
      worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`A${row}`).font = HFont;
      worksheet.getCell(`A${row}`).border = border;

      worksheet.getCell(`B${row}`).value = 'รหัสพนักงาน';
      worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`B${row}`).font = HFont;
      worksheet.getCell(`B${row}`).border = border;

      worksheet.getCell(`C${row}`).value = 'ชื่อ';
      worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`C${row}`).font = HFont;
      worksheet.getCell(`C${row}`).border = border;

      worksheet.getCell(`D${row}`).value = 'ตำแหน่ง';
      worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`D${row}`).font = HFont;
      worksheet.getCell(`D${row}`).border = border;

      worksheet.getCell(`E${row}`).value = 'แผนก';
      worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`E${row}`).font = HFont;
      worksheet.getCell(`E${row}`).border = border;
      row += 1;

      for (let n = 0; n < subTopicFilter.length; n += 1) {
        worksheet.getCell(`A${row}`).value = n + 1;
        worksheet.getCell(`A${row}`).font = NFont;
        worksheet.getCell(`A${row}`).border = border;

        worksheet.getCell(`B${row}`).value = subTopicFilter[n].psn_id;
        worksheet.getCell(`B${row}`).alignment = { horizontal: 'right' };
        worksheet.getCell(`B${row}`).font = NFont;
        worksheet.getCell(`B${row}`).border = border;

        worksheet.getCell(`C${row}`).value = subTopicFilter[n].psn_name;
        worksheet.getCell(`C${row}`).font = NFont;
        worksheet.getCell(`C${row}`).border = border;

        worksheet.getCell(`D${row}`).value = subTopicFilter[n].pos_name;
        worksheet.getCell(`D${row}`).font = NFont;
        worksheet.getCell(`D${row}`).border = border;

        worksheet.getCell(`E${row}`).value = subTopicFilter[n].dept_name;
        worksheet.getCell(`E${row}`).font = NFont;
        worksheet.getCell(`E${row}`).border = border;

        row += 1;
      }
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

import { useState, useEffect } from 'react';

function Testo() {
  // ใช้เพื่อส่งไปที่ API
  const [file, setFile] = useState({});
  // ใช้เพื่อภาพ Preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleUploadImage = (e) => {
    // เก็บไว้ setState ลงใน file
    const file = e.target.files[0];
    // เรียก Class FileReader เพื่อแปลง file image ที่รับเข้ามา
    const reader = new FileReader();
    // เป็น eventของFileReaderเมื่อโหลดภาพเสร็จ
    reader.onloadend = () => {
      // ทำการ setState
      setFile(file);
      // เหมือนด้านบน
      setImagePreviewUrl(reader.result);
    };
    // เป็นส่วนของการแสดงรูป ไม่ค่อยแน่ใจครับ ผู้รู้ช่วยคอมเม้นบอกด้วยนะครับ
    reader.readAsDataURL(file);
  };
  return (
    <>
      {/* ทำ condition ไว้ว่า เมื่อมีรูปค่อย show รูป ถ้าไม่มีก็ใช้รูป default ไป */}
      <img
        src={
          imagePreviewUrl ??
          'https://dcvta86296.i.lithium.com/t5/image/serverpage/image-  id/14321i0011CCD2E7F3C8F8/image-size/large?v=1.0&px=999'
        }
        style={{ width: '500px', height: '500px' }}
        alt="no img"
      />
      {/* ทำ input ไว้ กด เพื่อ find รูปครับ */}
      <input
        //  type ต้องเป็น file
        type="file"
        //  เรียก function ด้านบน เมื่อมีรูปเข้ามา
        onChange={handleUploadImage}
      />
      {/* ทำปุ่ม upload ไว้รอเชื่อมต่อกับ API  */}
      <button> Upload </button>
    </>
  );
}

export default Testo;

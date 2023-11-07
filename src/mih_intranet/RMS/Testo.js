import axios from 'axios';
import { useState, useEffect } from 'react';

function Testo() {

  const [image, setImage] = useState('');

  function handleImage(e) {
    console.log(e.target.files);
    setImage(e.target.files[0]);
  }
  function handleApi() {
    const formData = new FormData();
    formData.append('image', image);
    axios.post(`//192.168.101.2/Sh/Mih_Center`, formData).then((res) => {
      console.log(res);
    });
  }
  return <div>
    <input type ="file" name='file' onChange={handleImage}/>
    <button onClick={handleApi}>Submit</button>
  </div>;
}

export default Testo;

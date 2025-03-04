import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { check } from 'k6';
import http from 'k6/http';



const serverUrl = '<server_url>'
const fileName = '<file_name>.docx';
const img = open(`./${fileName}`, 'b');

const fd = new FormData();
fd.append('file', http.file(img, fileName, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))

export const options = {
  vus: 2, // BE CAREFULL; THIS IS A VERY CPU INTENSIVE TEST AND WILL CRASH THE SERVERS ON BIGGER NUMBERS
  duration: '300s',
};

export default function() {
  const res = http.post(`${serverUrl}/file`, fd.body(), {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${fd.boundary}`,
    }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  })
}

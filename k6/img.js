import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { check } from 'k6';
import http from 'k6/http';

const serverUrl = '<server_url>'
const fileName = '<file_name>.png';
const img = open(`./${fileName}`, 'b');

const fd = new FormData();
fd.append('file', http.file(img, fileName, 'image/png'))

export const options = {
  vus: 50,
  duration: '300s',
};

export default function() {
  const res = http.post(`${serverUrl}/image`, fd.body(), {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${fd.boundary}`,
    }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  })
}

import axios from 'axios';

export default function httpRequestPasswordResetEmail(params) {
  const { email, producerId } = params;
  const data = {
    email,
    producerId
  };
  return axios({
    method: 'post',
    url: '/iam/inviteUserEmail',
    data
  })
    .then(response => response.data)
    .catch(e => console.log(e));
}

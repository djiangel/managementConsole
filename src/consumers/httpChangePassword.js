import axios from 'axios';

type Params = {
  email: string,
  password: string,
  username: string
};

export default function httpChangePassword(
  params: Params,
  token: string
): Promise<string> {
  // console.log(params);
  // console.log(token)
  return axios({
    method: 'post',
    url: '/iam/changePassword',
    data: params,
    headers: {
      Authorization: token
    }
  }).then(response => response.data);
}

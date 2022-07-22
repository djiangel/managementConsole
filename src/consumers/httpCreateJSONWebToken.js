import assert from 'assert';
import axios from 'axios';

const createJSONWebTokenURI = process.env.IAM_ENDPOINT;

type Params = {
  email: string,
  password: string
};

export default function httpCreateJSONWebToken(
  params: Params
): Promise<string> {
  return axios({
    method: 'post',
    url: '/iam/createJSONWebToken',
    data: params
  }).then(response => response.data);
}

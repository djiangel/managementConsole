import assert from 'assert';
import axios from 'axios';

const createJSONWebTokenURI = process.env.IAM_ENDPOINT;

type Params = {
  email: string,
  password: string,
  username: string
};

export default function httpCreateUser(params: Params): Promise<string> {
  return axios({
    method: 'post',
    url: '/iam/createUser',
    data: params
  }).then(response => response.data);
}

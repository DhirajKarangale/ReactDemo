import { ServiceClient } from '../generated/UserServiceClientPb';
import { Request, Response } from '../generated/user_pb';

const client = new ServiceClient('http://localhost:8081');

const request = new Request();
let msg = 'React Messgae';
request.setMessage(msg);

function SentGRPCMsg(callback: (message: string, color: string) => void) {
  client.sendMessage(request, {}, (error: any, response: Response) => {
    if (error) {
      callback('Error:' + error, 'red');
    } else {
      callback(response.getMessage(), 'green');
    }
  });
}

export default SentGRPCMsg;
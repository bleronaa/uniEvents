import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: 'http://localhost:3002',
});

export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, next: (result: any) => void) => void
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

}




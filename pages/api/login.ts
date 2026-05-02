import type { NextApiRequest, NextApiResponse } from 'next';

// fake login
export default (req: NextApiRequest, res: NextApiResponse) => {
  const request = req.body;
  const email = request.username;
  const password = request.password;
  console.log('Request Params API', request);

  if(email === 'johndoe@mail.com' && password === 'ecommerce') {
    res.status(200).json({
      status: true,
      data: {
        name: 'John Doe', 
        email: 'johndoe@mail.com',
        accessToken: '78zFZvyspgAIBXPKdA0AhFqcNWXX16/CEmBFOHU3iOg='
      }
    });
  } else {
    res.status(401).json({ status: false });
  }
}

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  console.log('Request Headers:', req.headers);

  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'No authorization header, access denied' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res
      .status(401)
      .json({ message: 'Authorization header format must be Bearer [Token]' });
  }

  const token = parts[1];
  console.log('Token:', token);

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, access denied' });
    } else if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Invalid expired, access denied' });
    }
    res
      .status(500)
      .json({ message: 'Server error during authentication', error });
  }
};

export default authMiddleware;

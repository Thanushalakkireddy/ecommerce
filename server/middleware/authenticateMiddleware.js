import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ status: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ status: false, message: 'Invalid or expired token' });
  }
};

export const verifyAdmin = (req,res,next)=>{
    const authHeader=req.headers["authorization"]
    if(!authHeader) return res.status(401).send({message:"Authorization failed"})
    const tokenData=jwt.decode(authHeader,process.env.JWT_SECRET_TOKEN)
console.log(tokenData);
   if(!tokenData) return res.status(403).send({message:"inavlid token"})
    if(tokenData.role!='admin') return res.status(403).send({message:"access denied"})
   next();
}
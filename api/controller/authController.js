import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const adminRegister = async (req,res)=>{
    const {name,email,pass,role} = req.body
    const hashPassword = await bcrypt.hash(pass,10)
    try{
    const UserData = await User.create({
        name,
        email,
        pass:hashPassword,
        role            
    });
    res.status(201).send({message:'created admin',status:true,data:UserData})
    }catch(err){
       res.status(400).send({message:err,status:false})
    }  
}
export const adminLogin = async (req, res) => {
    const { email, pass, role } = req.body;
    try {
        const validUser = await User.findOne({ email: email, role: 'admin' });

        if (!validUser)
            return res.status(401).json({ message: "Admin doesn't exist" });

        const validPass = await bcrypt.compare(pass, validUser.pass);
        if (!validPass)
            return res.status(401).json({ message: "Wrong Password" });

        const token = jwt.sign(
    { id: validUser.id, email: email, role: 'admin' },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: '6h' }
);

        res.status(200).json({ message: "Login Successful", token: token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const userLogin = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const validUser = await User.findOne({ email: email, role: 'user' });

    if (!validUser)
      return res.status(400).json({ message: "User doesn't exist" });

    const validPass = await bcrypt.compare(pass, validUser.pass);

    if (!validPass)
      return res.status(400).json({ message: 'Wrong Password' });

    const token = jwt.sign(
      { id: validUser.id, email: email, role: 'user' },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '6h' }
    );

    return res.status(200).send({ message: 'Login Successful', token: token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

export const userRegister = async (req, res) => {
  const { name, email, pass } = req.body;
  console.log(req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPass = await bcrypt.hash(pass, 10);

    // Create new user
    const userData = await User.create({
      name,
      email,
      pass: hashedPass,
      role: 'user',
    });

    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: { id: userData._id, name: userData.name, email: userData.email },
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const adminChangePass = async (req,res)=>{
    const adminId = req.params.id;
    const {newPass} = req.body;
    console.log(newPass);
    try{
        const updateData = await User.findByIdAndUpdate(
         adminId,
         { pass: newPass },
         { new: true }
        );
         res.status(201).send({status:true,message:updateData});
    }catch(err){
         res.status(400).send({status:false,message:err});
    }
}
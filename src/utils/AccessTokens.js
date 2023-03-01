import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

function generateAccessToken(username) {
    return jwt.sign({email_id : username}, process.env.TOKEN_SECRET, { expiresIn: '30d' });
}

function authenticateToken(req, res) {
    const token = req.headers['authorization']
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
  
      if (error) return res.sendStatus(403)
  
      return user_email_id

    })
}

export {
    generateAccessToken,
    authenticateToken
}
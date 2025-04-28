import jwt from 'jsonwebtoken';
export function createToken(payload) {
 const token = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn:'1d'});
 return token;
}

import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'elora_luxury_super_secret_jwt_key_2026_beauty', {
    expiresIn: '30d'
  });
};

export default generateToken;

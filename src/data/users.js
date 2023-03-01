import bcrypt from 'bcryptjs'

const users = [
  {
    first_name: 'Admin',
    last_name: 'User',
    address_line_1: '47 Landseer Road',
    post_code: 'LE2 3EF',
    phone_number: '07766554433',
    email: 'admin@localgp.com',
    password: bcrypt.hashSync('LocalgpAdmin@123', 10),
    role: 'admin',
    active: true
  },
]

export default users
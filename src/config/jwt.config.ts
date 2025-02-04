import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY || 'temp_jwt_secret_key'
}))
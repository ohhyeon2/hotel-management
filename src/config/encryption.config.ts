import { registerAs } from "@nestjs/config";

export default registerAs('encryption', () => ({
  algorithm: process.env.ENCRYPTION_ALGORITHM,
  key: process.env.ENCRYPTION_KEY,
  iv: process.env.ENCRYPTION_IV
}))
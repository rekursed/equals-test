import dotenv from 'dotenv';

dotenv.config();

export const config = {
  aws_region: process.env.AWS_REGION,
  sender_email: process.env.SENDER_EMAIL
};

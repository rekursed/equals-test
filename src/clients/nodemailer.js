import { config } from '../config.js';

import nodemailer from 'nodemailer';

import aws from '@aws-sdk/client-ses';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: config.aws_region
});

// Todo: add config properly to test email client
export const emailClient = nodemailer.createTransport({
  SES: { ses, aws }
});

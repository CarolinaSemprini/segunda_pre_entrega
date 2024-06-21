
// generate-secret.mjs
import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));


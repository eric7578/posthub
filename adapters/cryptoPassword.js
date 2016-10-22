import bcrypt from 'bcrypt';

export async function encrypt(plain, saltRounds = 10) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, saltRounds, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
}

export function compare(plain, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hash, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

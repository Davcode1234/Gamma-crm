import ogMulter from 'multer';
import { randomBytes } from 'crypto';

export const multer = ({ dest }) =>
  ogMulter({
    storage: ogMulter.diskStorage({
      destination(_, __, cb) {
        cb(null, dest);
      },
      filename(_, file, cb) {
        randomBytes(16, (err, raw) => {
          if (err) return cb(err, null);
          cb(
            null,
            `${raw.toString('hex')}.${file.mimetype.replace('image/', '')}`,
          );
        });
      },
    }),
  });

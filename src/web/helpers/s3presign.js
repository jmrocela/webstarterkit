import AWS from 'aws-sdk';
import crypto from 'crypto';
import path from 'path';
import ApiError from '../../../lib/errors/http';

export default async ({ filename = '', length = null }) => {
  if (!filename) {
    throw new ApiError('filename required', 400, '11400');
  }

  let ext = path.extname(filename).toLowerCase();
  if (![ '.jpg', '.jpeg', '.gif', '.png' ].includes(ext)) {
    throw new ApiError('extension not recognized', 400, '11400');
  }

  if (!length || length > Number(process.env.AVATAR_UPLOAD_LIMIT)) {
    throw new ApiError('file is too big', 400, '11400');
  }

  filename = crypto.createHmac('sha1', process.env.NODE_SECRET).update(new Date().getTime()+'').digest('hex').substr(0, 12) + ext;

  const S3 = new AWS.S3();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${filename}`,
    ContentType: `image/${path.extname(filename).substr(1)}`,
    ACL: 'public-read'
  };

  return new Promise(function(resolve, reject) {
    S3.getSignedUrl('putObject', params, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve({
        type: `image/${path.extname(filename).substr(1)}`,
        signedUrl: data,
        publicUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${filename}`,
        filename
      });
    });
  });

}
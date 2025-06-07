import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Chỉ chấp nhận file ảnh.'));
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Chỉ chấp nhận file PDF.'));
};

// Multer instance cho ảnh, giới hạn 5MB
const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Multer instance cho file PDF, giới hạn 30MB
const uploadPdfFile = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
});

const uploadToCloudinaryImage = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'QLDV/images', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

const uploadToCloudinaryPdf = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'QLDV/files', resource_type: 'raw' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// Middleware upload avatar (ảnh đơn)
export const uploadAvatar = [
  uploadImage.single('avatar'),
  async (req, res, next) => {
    try {
      if (!req.file) return next();

      const result = await uploadToCloudinaryImage(req.file);
      req.uploadedFile = { url: result.secure_url, public_id: result.public_id };
      next();
    } catch (err) {
      next(err);
    }
  },
];

// Middleware upload nhiều ảnh
export const uploadImages = (limit = 1) => [
  uploadImage.array('images', limit),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) return next();

      const results = await Promise.all(req.files.map(f => uploadToCloudinaryImage(f)));
      req.uploadedFiles = results.map(r => ({ url: r.secure_url, public_id: r.public_id }));
      next();
    } catch (err) {
      next(err);
    }
  },
];

// Middleware upload file PDF
export const uploadPdf = [
  uploadPdfFile.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return next();

      const result = await uploadToCloudinaryPdf(req.file);
      req.uploadedFile = { url: result.secure_url, public_id: result.public_id };
      next();
    } catch (err) {
      next(err);
    }
  },
];

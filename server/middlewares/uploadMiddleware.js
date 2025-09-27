import multer from 'multer';
// import cloudinary from '../config/cloudinary.js';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;

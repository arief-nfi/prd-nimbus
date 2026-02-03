import { Router } from 'express';
import multer from 'multer';
import { validateNodeUpload } from '../middleware/validate-upload';

const router = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Higher limit for multer, Zod handles specific 2MB rule

router.post('/upload-docs', upload.single('file'), validateNodeUpload, (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
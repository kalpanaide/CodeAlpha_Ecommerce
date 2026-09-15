const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert the file buffer to a base64 string Cloudinary can accept
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'shopsphere_products'
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
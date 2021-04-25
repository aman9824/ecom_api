/* eslint-disable camelcase */
import cloudinary from 'cloudinary';

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Cloudinary = {

  async upload(req, res) {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto' // jpeg, png
    });
    res.json({
      public_id: result.public_id,
      url: result.secure_url
    });
  },

  async remove(req, res) {
    const image_id = req.body.public_id;
    await cloudinary.uploader.destroy(image_id);
    res.json('image successfully deleted');
  }
};

export default Cloudinary;

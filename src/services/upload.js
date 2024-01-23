// 1. Upload from url image

const cloudinary = require("../configs/cloudinary.config");

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://i.pinimg.com/736x/f5/c7/c7/f5c7c7aaa6fa24d07793d41ca59958fa.jpg";
    const folderName = "product/8409";
    const newFileName = "demo";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result);
    return {
      img_url: result.secure_url,
      shopID: 8409,
      thumb_url: cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};

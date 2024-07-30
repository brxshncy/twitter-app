import cloudinary from "cloudinary";

export const uploadImageToCloudinary = async (
  imageFile: Express.Multer.File
) => {
  const base64Image = Buffer.from(imageFile.buffer).toString("base64");
  const dataUri = `data:${imageFile.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

  return uploadResponse.url;
};

export const destroyImageCloudinary = async (imageUrlId: string) => {
  await cloudinary.v2.uploader.destroy(imageUrlId);
};

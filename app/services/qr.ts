import QRCode from "qrcode";

export const generateQR = async (data: string) => {
  try {
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (err) {
    console.error(err);
  }
};

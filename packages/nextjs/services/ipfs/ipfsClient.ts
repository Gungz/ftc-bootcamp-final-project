import { PinataSDK } from "pinata";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
});

export const uploadFile = async (file: File, fileType: string, name: string): Promise<string> => {
  try {
    const upload = await pinata.upload.public.file(file).name(name).keyvalues({ type: fileType });
    return upload.cid;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};

export const getIPFSUrl = (hash: string): string => {
  return `https://ipfs.io/ipfs/${hash}`;
};

export const getFile = async (cid: string) => {
  try {
    const file = await pinata.files.public.list().cid(cid);
    console.log(file);
    return file;
  } catch (error) {
    console.error("Error fetching file metadata:", error);
    return null;
  }
};

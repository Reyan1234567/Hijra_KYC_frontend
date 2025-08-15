import { egami, imageReturn } from "../components/MakeForm/MakeFormTable";
import { makeFormInteface } from "../components/Search";
import { api } from "./axios";

export const addToDrafts = async (id: number) => {
  return await api.patch(`/makeForm/toDrafts/${id}`);
};

export const sendToHo = async (id: number) => {
  return await api.patch(`/makeForm/send-ToHo/${id}`);
};

export const getMakes = async (date: Date, makerId:number) => {
  return await api.get("/makeForm", {
    params: { makerId: makerId, date: date },
  });
};

export const dissassociate = async (imageId: number) => {
  return await api.patch(`/image/disassociate/${imageId}`);
};

export const createImage = async (makeId: number, images: egami[]) => {
  return api.post(
    `/image/create-Images/${makeId}`,
    images.map((image) => ({
      file: image.file,
      description: image.description,
    }))
  );
};

export const editDescription = async (image: imageReturn) => {
  return await api.patch(
    "/image/description",
    { description: image.description },
    { params: { id: image.id } }
  );
};

export const searchAccount = async (account: number) => {
  return await api.get(
    `https://dd3ef816daf3.ngrok-free.app/api/customerDetail/${account}`
  );
};


export const createMakeForm=async(makeForm:makeFormInteface, makerId:number)=>{
  return await api.post("/makeForm", {
    makerId: makerId,
    cif:makeForm.cif,
    customerAccount: makeForm.accountNumber,
    customerPhone: makeForm.phoneNumber,
    customerName: makeForm.fullName
  })
}
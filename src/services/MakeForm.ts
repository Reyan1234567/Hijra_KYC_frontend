/*
 * HIJRA KYC FRONTEND - MAKE FORM SERVICE
 *
 * FILE TYPE: Service/API Layer
 * PURPOSE: Handles all KYC form creation, management, and image operations
 *
 * FUNCTIONALITY:
 * - CRUD operations for KYC forms (create, read, update status)
 * - Image management (create, edit, disassociate)
 * - Form status transitions (drafts, pending, approved, rejected)
 * - Customer account search integration
 * - Paginated data retrieval for different form states
 *
 * API ENDPOINTS USED:
 * - PATCH /makeForm/toDrafts/{id} - Move form to drafts
 * - PATCH /makeForm/send-ToHo/{id} - Send form to head office
 * - GET /makeForm - Get all forms with pagination
 * - GET /makeForm/draft - Get draft forms
 * - GET /makeForm/pending - Get pending forms
 * - GET /makeForm/approved - Get approved forms
 * - GET /makeForm/rejected - Get rejected forms
 * - POST /makeForm - Create new form
 * - POST /image/create-Images/{makeId} - Create images for form
 * - PATCH /image/disassociate/{imageId} - Remove image association
 * - PATCH /image/description - Update image description
 * - GET /api/customerDetail/{account} - Search customer by account
 *
 * USED BY: All MakeForm components, Search component
 */

import {
  egami,
  imageReturn,
  pageableReturn,
} from "../components/MakeForm/AllMakeFormTable";
import { checkers } from "../components/Manager/EditCheckerAssignment";
import { makeFormInteface } from "../components/Search";
import { api } from "./axios";

export const sendToHo = async (id: number) => {
  return await api.patch(`/makeForm/send-ToHo/${id}`);
};

export const getMakes = async (
  date: Date,
  makerId: number | undefined,
  pageSize: number,
  pageNumber: number,
  search?: string
) => {
  if (!makerId) {
    throw new Error("User ID is required");
  }
  const req = await api.get<pageableReturn>("/makeForm", {
    params: {
      makerId,
      date,
      pageSize: pageSize,
      pageNumber: pageNumber,
      search,
    },
  });
  console.log(req.data);
  return req;
};

export const getDraftedMakes = async (
  date: Date,
  makerId: number | undefined,
  pageSize: number,
  pageNumber: number,
  search: string
) => {
  const req = await api.get<pageableReturn>("/makeForm/draft", {
    params: {
      makerId,
      date,
      pageSize: pageSize,
      pageNumber: pageNumber,
      search: search,
    },
  });
  console.log(req.data);
  return req;
};

export const getPendingMakes = async (
  date: Date,
  makerId: number,
  pageSize: number,
  pageNumber: number,
  search: number
) => {
  const req = await api.get<pageableReturn>("/makeForm/pending", {
    params: {
      makerId,
      date,
      pageSize: pageSize,
      pageNumber: pageNumber,
      search: search,
    },
  });
  console.log(req.data);
  return req;
};

export const getApprovedMakes = async (
  date: Date,
  makerId: number,
  pageSize: number,
  pageNumber: number,
  search?: string
) => {
  const req = await api.get<pageableReturn>("/makeForm/approved", {
    params: {
      makerId,
      date,
      pageSize: pageSize,
      pageNumber: pageNumber,
      search: search,
    },
  });
  console.log(req.data);
  return req;
};

export const getRejectedMakes = async (
  date: Date,
  makerId: number,
  pageSize: number,
  pageNumber: number,
  search?: string
) => {
  const req = await api.get<pageableReturn>("/makeForm/rejected", {
    params: {
      makerId,
      date,
      pageSize: pageSize,
      pageNumber: pageNumber,
      search: search,
    },
  });
  console.log(req.data);
  return req;
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

export const createMakeForm = async (
  makeForm: makeFormInteface,
  makerId: number
) => {
  return await api.post("/makeForm", {
    makerId: makerId,
    cif: makeForm.cif,
    accountType: makeForm.accountType,
    customerAccount: makeForm.accountNumber,
    customerPhone: makeForm.phoneNumber,
    customerName: makeForm.fullName,
  });
};

export const getAllCheckers = async () => {
  return await api.get<checkers[]>("/makeForm/allCheckers");
};

export const deleteAllCheckerAssignments = async (id: number) => {
  return await api.patch<checkers[]>(`/makeForm/deleteAllAssigned/${id}`);
};

export const defaultAllTableDataType = {
  id: 0,
  makerId: 0,
  makeId: 0,
  makerName: "",
  madeAt: new Date(),
  checkedAt: new Date(),
  assignedAt: new Date(),
  hoId: 0,
  hoName: "",
  cif: "",
  customerAccount: "",
  customerName: "",
  customerPhone: "",
  images: [],
  status: 0,
  backReason: "",
};

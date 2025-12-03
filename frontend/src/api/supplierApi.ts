import axios from 'axios';

export interface Supplier {
  id: number;
  name: string;
  commodity: string;
  contactEmail: string;
  createdAt: string;
}

export interface Document {
  id: number;
  fileName: string;
  supplierId: number;
  blobUri: string;
  uploadedAt: string;
}

const API_BASE = 'http://localhost:5000/api'; // adjust port if needed

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await axios.get(`${API_BASE}/supplier`);
  return res.data;
}

export async function getDocuments(): Promise<Document[]> {
  const res = await axios.get(`${API_BASE}/document`);
  return res.data;
}

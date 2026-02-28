export interface Specialist {
  id: string;
  name: string;
  idNumber: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSpecialistPayload {
  name: string;
  idNumber: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateSpecialistPayload {
  name?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

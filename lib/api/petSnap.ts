// Lệnh gọi API PetSnap (tính năng chủ lực).
//
// Hợp đồng backend (controller/petSnapApiV1Controller.js):
//   GET  /pet-snap            -> { pet, hasMore }  (1 thú cưng/lần, ngẫu nhiên, chưa tương tác)
//   POST /pet-snap/:id/like   -> { pet, hasMore }  (lưu "liked"  rồi trả thú cưng KẾ TIẾP)
//   POST /pet-snap/:id/dislike-> { pet, hasMore }  (lưu "passed" rồi trả thú cưng KẾ TIẾP)
import { apiRequest } from './client';

// Một dòng pet_images do backend đính kèm qua attachImagesToPets.
export type PetImage = {
  id: number;
  pet_id: number;
  image_path: string;
  display_order: number;
};

// Thú cưng đã chuẩn hoá (normalizePet ở backend).
export type Pet = {
  id: number;
  name: string;
  pet_type?: string | null;
  breed?: string | null;
  age?: string | null;
  gender?: string | null;
  color?: string | null;
  weight?: string | null;
  status?: string | null;
  pet_code?: string | null;
  description?: string | null;
  image: string; // avatar (có thể là đường dẫn tương đối)
  images: PetImage[];
};

export type PetSnapBundle = {
  pet: Pet | null;
  hasMore: boolean;
};

export function getNextPet(signal?: AbortSignal): Promise<PetSnapBundle> {
  return apiRequest<PetSnapBundle>('/pet-snap', { signal });
}

export function likePet(petId: number): Promise<PetSnapBundle> {
  return apiRequest<PetSnapBundle>(`/pet-snap/${petId}/like`, { method: 'POST' });
}

export function dislikePet(petId: number): Promise<PetSnapBundle> {
  return apiRequest<PetSnapBundle>(`/pet-snap/${petId}/dislike`, { method: 'POST' });
}

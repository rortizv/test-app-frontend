import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL_TOKEN } from '../../../core/tokens/api-url.token';
import type {
  Specialist,
  CreateSpecialistPayload,
  UpdateSpecialistPayload,
} from '../models/specialist.model';

@Injectable({ providedIn: 'root' })
export class SpecialistsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL_TOKEN);

  private get url(): string {
    return `${this.baseUrl}/specialists`;
  }

  getAll() {
    return this.http.get<Specialist[]>(this.url);
  }

  getOne(id: string) {
    return this.http.get<Specialist>(`${this.url}/${id}`);
  }

  create(payload: CreateSpecialistPayload) {
    return this.http.post<Specialist>(this.url, payload);
  }

  update(id: string, payload: UpdateSpecialistPayload) {
    return this.http.patch<Specialist>(`${this.url}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  toggleActive(id: string) {
    return this.http.patch<Specialist>(`${this.url}/${id}/toggle-active`, {});
  }
}

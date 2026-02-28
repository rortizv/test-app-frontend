import { InjectionToken } from '@angular/core';
import { API_BASE_URL } from '../config/app.config';

export const API_BASE_URL_TOKEN = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => API_BASE_URL,
});

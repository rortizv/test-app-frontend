import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly messages = signal<ToastMessage[]>([]);

  readonly toasts = computed(() => this.messages());

  show(message: string, type: ToastType): void {
    const id = this.nextId++;
    this.messages.update((list: ToastMessage[]) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.messages.update((list: ToastMessage[]) => list.filter((t: ToastMessage) => t.id !== id));
  }
}

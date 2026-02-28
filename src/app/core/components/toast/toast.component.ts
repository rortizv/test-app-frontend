import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      @for (t of toastService.toasts(); track t.id) {
        <div
          role="alert"
          class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium min-w-[200px]"
          [class.bg-green-600]="t.type === 'success'"
          [class.bg-red-600]="t.type === 'error'"
        >
          <span class="flex-1">{{ t.message }}</span>
          <button
            type="button"
            class="opacity-80 hover:opacity-100 shrink-0 cursor-pointer"
            (click)="toastService.dismiss(t.id)"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}

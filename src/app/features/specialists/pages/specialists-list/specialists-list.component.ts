import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { SpecialistsApiService } from '../../services/specialists-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SpecialistFormModalComponent } from '../../components/specialist-form-modal/specialist-form-modal.component';
import type { Specialist } from '../../models/specialist.model';

@Component({
  selector: 'app-specialists-list',
  standalone: true,
  imports: [SpecialistFormModalComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto relative">
      @if (loading()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80" aria-busy="true">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading"></div>
            <span class="text-sm font-medium text-gray-600">Loading...</span>
          </div>
        </div>
      }

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Specialists</h1>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 cursor-pointer"
          (click)="openCreateModal()"
        >
          New specialist
        </button>
      </div>

      <div class="rounded-lg border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID number</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (s of specialists(); track s.id) {
              <tr [class.bg-gray-50]="!s.isActive" [class.opacity-75]="!s.isActive">
                <td class="px-4 py-3 text-sm text-gray-900">{{ s.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ s.idNumber }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ s.phone ?? '—' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex justify-end items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      [attr.aria-checked]="s.isActive"
                      [title]="s.isActive ? 'Deactivate' : 'Activate'"
                      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      [class.bg-blue-600]="s.isActive"
                      [class.bg-gray-200]="!s.isActive"
                      (click)="toggleActive(s)"
                    >
                      <span
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform"
                        [class.translate-x-5]="s.isActive"
                        [class.translate-x-1]="!s.isActive"
                      ></span>
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      class="px-2 py-1 text-sm rounded border border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
                      (click)="openEditModal(s)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      class="px-2 py-1 text-sm rounded border border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                      (click)="deleteSpecialist(s)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-8 text-center text-gray-500">No specialists yet. Add one with "New specialist".</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (modalOpen()) {
        <app-specialist-form-modal
          [specialist]="specialistToEdit()"
          (save)="onFormSave($event)"
          (cancel)="closeModal()"
        />
      }
    </div>
  `,
})
export class SpecialistsListComponent implements OnInit {
  private readonly api = inject(SpecialistsApiService);
  private readonly toast = inject(ToastService);

  readonly specialists = signal<Specialist[]>([]);
  readonly loading = signal(true);
  readonly modalOpen = signal(false);
  readonly specialistToEdit = signal<Specialist | null>(null);

  ngOnInit(): void {
    this.loadSpecialists();
  }

  private loadSpecialists(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (list: Specialist[]) => {
        this.specialists.set(list);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.toast.error((err as { error?: { message?: string } })?.error?.message ?? 'Failed to load specialists');
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.specialistToEdit.set(null);
    this.modalOpen.set(true);
  }

  openEditModal(s: Specialist): void {
    this.specialistToEdit.set(s);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.specialistToEdit.set(null);
  }

  onFormSave(payload: {
    name: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
  }): void {
    const editing = this.specialistToEdit();
    this.loading.set(true);
    if (editing) {
      this.api.update(editing.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.toast.success('Specialist updated successfully.');
          this.loadSpecialists();
        },
        error: (err: unknown) => {
          this.toast.error((err as { error?: { message?: string } })?.error?.message ?? 'Failed to update specialist');
          this.loading.set(false);
        },
      });
    } else {
      this.api.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.toast.success('Specialist created successfully.');
          this.loadSpecialists();
        },
        error: (err: unknown) => {
          this.toast.error((err as { error?: { message?: string } })?.error?.message ?? 'Failed to create specialist');
          this.loading.set(false);
        },
      });
    }
  }

  toggleActive(s: Specialist): void {
    this.loading.set(true);
    this.api.toggleActive(s.id).subscribe({
      next: (updated: Specialist) => {
        this.specialists.update((list: Specialist[]) =>
          list.map((x: Specialist) => (x.id === updated.id ? updated : x))
        );
        this.toast.success(
          updated.isActive ? 'Specialist activated.' : 'Specialist deactivated.'
        );
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.toast.error((err as { error?: { message?: string } })?.error?.message ?? 'Failed to update status');
        this.loading.set(false);
      },
    });
  }

  deleteSpecialist(s: Specialist): void {
    if (!confirm(`Delete "${s.name}"?`)) return;
    this.loading.set(true);
    this.api.delete(s.id).subscribe({
      next: () => {
        this.specialists.update((list: Specialist[]) => list.filter((x: Specialist) => x.id !== s.id));
        this.toast.success('Specialist deleted.');
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.toast.error((err as { error?: { message?: string } })?.error?.message ?? 'Failed to delete specialist');
        this.loading.set(false);
      },
    });
  }
}

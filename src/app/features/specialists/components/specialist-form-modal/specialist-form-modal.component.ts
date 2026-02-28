import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import type { Specialist } from '../../models/specialist.model';

@Component({
  selector: 'app-specialist-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      (click)="onBackdropClick()"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditMode() ? 'Edit specialist' : 'New specialist' }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-red-600 text-sm mt-1">Name is required</p>
              }
            </div>

            <div>
              <label for="idNumber" class="block text-sm font-medium text-gray-700 mb-1">ID number *</label>
              <input
                id="idNumber"
                type="text"
                formControlName="idNumber"
                class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              @if (form.get('idNumber')?.invalid && form.get('idNumber')?.touched) {
                <p class="text-red-600 text-sm mt-1">ID number is required</p>
              }
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                type="text"
                formControlName="phone"
                class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              @if (form.get('email')?.invalid && form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                <p class="text-red-600 text-sm mt-1">Invalid email</p>
              }
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                id="address"
                formControlName="address"
                rows="2"
                class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                formControlName="isActive"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="isActive" class="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              class="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              (click)="cancel.emit()"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!canSave()"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ isEditMode() ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SpecialistFormModalComponent {
  specialist = input<Specialist | null>(null);
  save = output<{
    name: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
  }>();
  cancel = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly isEditMode = computed(() => this.specialist() !== null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    idNumber: ['', Validators.required],
    phone: [''],
    email: ['', Validators.email],
    address: [''],
    isActive: [true],
  });

  private readonly initialValue = signal<string | null>(null);

  constructor() {
    effect(() => {
      const s = this.specialist();
      if (s) {
        this.form.patchValue({
          name: s.name,
          idNumber: s.idNumber,
          phone: s.phone ?? '',
          email: s.email ?? '',
          address: s.address ?? '',
          isActive: s.isActive,
        });
        this.initialValue.set(JSON.stringify(this.form.getRawValue()));
      } else {
        this.form.reset({ name: '', idNumber: '', phone: '', email: '', address: '', isActive: true });
        this.initialValue.set(null);
      }
    });
  }

  canSave(): boolean {
    if (!this.form.valid) return false;
    if (!this.isEditMode()) return true;
    const current = JSON.stringify(this.form.getRawValue());
    return this.initialValue() !== current;
  }

  onSubmit(): void {
    if (!this.form.valid) return;
    const v = this.form.getRawValue();
    this.save.emit({
      name: v.name,
      idNumber: v.idNumber,
      phone: v.phone,
      email: v.email,
      address: v.address,
      isActive: v.isActive,
    });
  }

  onBackdropClick(): void {
    this.cancel.emit();
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CreateUserRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    age: new FormControl(18, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  message = '';
  submitting = false;

  get email() {
    return this.form.controls.email;
  }

  get name() {
    return this.form.controls.name;
  }

  get age() {
    return this.form.controls.age;
  }

  get password() {
    return this.form.controls.password;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.message = '';

    const request: CreateUserRequest = this.form.getRawValue();

    this.auth.register(request).subscribe({
      next: () => {
        this.message = 'Usuário criado com sucesso. Faça login para acessar o dashboard.';
        this.form.reset({ age: 18 });
        this.submitting = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (error: string) => {
        this.message = error;
        this.submitting = false;
      },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, CreateUserRequest, UpdateUserRequest, User, UserRole } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user: User | null = null;
  users: User[] = [];
  editingUser: User | null = null;
  message = '';
  loading = false;
  saving = false;

  readonly createUserForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    age: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  readonly editUserForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    age: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    }),
  });

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      this.user = user;

      if (user?.role === 'admin') {
        this.loadUsers();
      }
    });
  }

  get createEmail() {
    return this.createUserForm.controls.email;
  }

  get createName() {
    return this.createUserForm.controls.name;
  }

  get createAge() {
    return this.createUserForm.controls.age;
  }

  get createPassword() {
    return this.createUserForm.controls.password;
  }

  get editEmail() {
    return this.editUserForm.controls.email;
  }

  get editName() {
    return this.editUserForm.controls.name;
  }

  get editAge() {
    return this.editUserForm.controls.age;
  }

  get canManageUsers() {
    return this.user?.role === 'admin';
  }

  loadUsers(): void {
    this.loading = true;
    this.message = '';

    this.auth.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error: string) => {
        this.message = error;
        this.loading = false;
      },
    });
  }

  submitCreate(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.message = '';

    const request: CreateUserRequest = this.createUserForm.getRawValue();

    this.auth.createUser(request).subscribe({
      next: (createdUser) => {
        this.users = [createdUser, ...this.users];
        this.createUserForm.reset({ age: 0 });
        this.saving = false;
        this.message = 'Usuário criado com sucesso.';
      },
      error: (error: string) => {
        this.message = error;
        this.saving = false;
      },
    });
  }

  startEdit(user: User): void {
    this.editingUser = user;
    this.editUserForm.patchValue({
      email: user.email,
      name: user.name,
      age: user.age,
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.editUserForm.reset({ age: 0 });
  }

  submitEdit(): void {
    if (!this.editingUser || this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.message = '';

    const request: UpdateUserRequest = this.editUserForm.getRawValue();

    this.auth.updateUser(this.editingUser.id, request).subscribe({
      next: (updatedUser) => {
        this.users = this.users.map((item) => (item.id === updatedUser.id ? updatedUser : item));
        this.editingUser = null;
        this.saving = false;
        this.message = 'Cadastro atualizado com sucesso.';
      },
      error: (error: string) => {
        this.message = error;
        this.saving = false;
      },
    });
  }

  toggleRole(user: User): void {
    const nextRole: UserRole = user.role === 'admin' ? 'user' : 'admin';

    if (!confirm(`Confirmar alteração de perfil de ${user.email} para ${nextRole}?`)) {
      return;
    }

    this.saving = true;
    this.message = '';

    this.auth.updateUserRole(user.id, nextRole).subscribe({
      next: (updatedUser) => {
        this.users = this.users.map((item) => (item.id === updatedUser.id ? updatedUser : item));
        this.saving = false;
        this.message = 'Perfil atualizado com sucesso.';
      },
      error: (error: string) => {
        this.message = error;
        this.saving = false;
      },
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Excluir permanentemente ${user.email} do banco de dados?`)) {
      return;
    }

    this.saving = true;
    this.message = '';

    this.auth.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((item) => item.id !== user.id);
        if (this.editingUser?.id === user.id) {
          this.cancelEdit();
        }
        this.saving = false;
        this.message = 'Usuário excluído com sucesso.';
      },
      error: (error: string) => {
        this.message = error;
        this.saving = false;
      },
    });
  }

  trackByUser(_: number, user: User): string {
    return user.id;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

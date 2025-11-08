import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  message = '';
  error = '';

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signUp() {
    this.error = '';
    this.message = '';
    // Validation
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const { error } = await this.supabaseService.signUpWithEmail({
      name: this.name,
      email: this.email,
      password: this.password,
    });
    if (error) {
      alert('Error signing up: ' + error.message);
    } else {
      alert('Check your email to confirm your account!');
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

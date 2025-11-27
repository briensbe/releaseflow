import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  loading = false;

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  async signInWithEmail() {
    this.loading = true;
    try {
      const { error } = await this.supabaseService.signInWithEmail({
        email: this.email(),
        password: this.password(),
      });
      if (error) {
        alert('Error signing in: ' + error.message);
      } else {
        // this.router.navigate(['/profile']); // ancien comportement par défaut isssu de supabase-auth
        this.router.navigate(['/compact']);
      }
    } finally {
      this.loading = false;
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}

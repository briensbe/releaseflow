import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  loading = false;
  success = false;  // Nouvelle propriété pour gérer l'état de succès

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Vérifier qu'il y a bien une session active (token de reset)
    const { data } = await this.supabaseService.getSession();
    if (!data.session) {
      this.error = 'Session invalide. Veuillez demander un nouveau lien de réinitialisation.';
    }
  }

  async onSubmit() {
    this.error = '';
    this.message = '';

    // Validation
    if (this.newPassword.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;

    try {
      const { error } = await this.supabaseService.updatePassword(this.newPassword);

      if (error) {
        this.error = 'Erreur : ' + error.message;
      } else {
        this.message = 'Mot de passe mis à jour avec succès !';
        this.success = true;  // Marquer comme succès
      }
    } catch (err: any) {
      this.error = 'Une erreur est survenue : ' + err.message;
    } finally {
      this.loading = false;
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
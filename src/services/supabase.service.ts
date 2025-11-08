import { Injectable } from '@angular/core';
import {
  AuthTokenResponse,
  createClient,
  SupabaseClient,
  UserResponse,
} from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { LoginPayload, SignupPayload } from '../app/types/user.type';

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

//récupération de supabase-auth
/**
   * Connexion d'un utilisateur existant
   */
  async signInWithEmail(payload: LoginPayload) {
    return await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async signUpWithEmail(payload: SignupPayload) {
    return await this.supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          displayName: payload.name,
        },
      },
    });
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getUser() {
    return await this.supabase.auth.getUser();
  }

  /**
   * Déconnexion de l'utilisateur courant
   */
  async signOut() {
    return await this.supabase.auth.signOut();
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param email Adresse email de l'utilisateur
   * @returns Promise<void> (rejette avec une erreur en cas d'échec)
   */
  async resetPasswordForEmail(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
    } catch (err: any) {
      // on renvoie l'erreur pour que le composant l'affiche proprement
      throw new Error(
        err.message || 'Erreur lors de l’envoi du mail de réinitialisation.'
      );
    }
  }

  /**
   * Réinitialisation du mot de passe après lien reçu par email
   * (lorsque Supabase redirige sur /reset-password avec access_token)
   */
  async exchangeCodeForSession(hash: string): Promise<AuthTokenResponse> {
    if (!hash.includes('access_token')) throw new Error('Token manquant');
    const response = await this.supabase.auth.exchangeCodeForSession(hash);
    if (response.error) throw new Error(response.error.message);
    return response;
  }

  /**
   * Mise à jour du mot de passe de l'utilisateur connecté
   */
  async updatePassword(newPassword: string): Promise<UserResponse> {
    const response = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (response.error) throw new Error(response.error.message);
    return response;
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }


}

import { Component, inject, OnInit } from "@angular/core";
import { SupabaseService } from "../../services/supabase.service";
import { ThemeService } from "../services/theme.service";
import { LucideAngularModule } from "lucide-angular";
import { Router } from "@angular/router";
import { User } from "../types/user.type";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  showInfo = false;

  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  public readonly themeService = inject(ThemeService);

  ngOnInit() {}

  async toggleUserInfo() {
    if (this.user) {
      this.showInfo = !this.showInfo;
    } else {
      await this.fetchUser();
      this.showInfo = true;
    }
  }

  async fetchUser() {
    this.loading = true;
    try {
      const { data } = await this.supabaseService.getUser();
      this.user = data.user;

      if (!this.user) {
        this.router.navigate(["/login"]);
      }
    } finally {
      this.loading = false;
    }
  }
  async signOut() {
    await this.supabaseService.signOut();
    this.router.navigate(["/login"]);
  }

  async updatePassword() {
    // await this.supabaseService.signOut();
    this.router.navigate(["/update-password"]);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

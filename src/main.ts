import { Component, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, RouterModule } from "@angular/router";
import { routes } from "./app/app.routes";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  User,
  Search,
  X,
  Package,
  Plus,
  Trash2,
  PenLine,
  Rocket,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LucideHistory,
  Calendar,
} from "lucide-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-content">
          <h1 class="app-title">Calendrier Livraisons & MEP</h1>
          <div class="nav-links">
            <a routerLink="/calendar" routerLinkActive="active">Calendrier</a>
            <a routerLink="/compact" routerLinkActive="active">Vue Compacte</a>
            <a routerLink="/list" routerLinkActive="active">Liste</a>
            <a routerLink="/profile" routerLinkActive="active">
              <lucide-icon name="user" class="icon"></lucide-icon>
              Profil
            </a>
          </div>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f1f5f9;
      }

      .app-container {
        min-height: 100vh;
      }

      .navbar {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .nav-content {
        max-width: 1600px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .app-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
      }

      .nav-links {
        display: flex;
        gap: 0.5rem;
      }

      .nav-links a {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        text-decoration: none;
        color: #64748b;
        font-weight: 500;
        transition: all 0.2s;
      }

      .nav-links a:hover {
        background: #f1f5f9;
        color: #1e293b;
      }

      .nav-links a.active {
        background: #2563eb;
        color: white;
      }

      main {
        min-height: calc(100vh - 80px);
      }

      .icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        vertical-align: middle;
        fill: currentColor;
      }
    `,
  ],
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        User,
        Search,
        X,
        Package,
        Plus,
        Trash2,
        PenLine,
        Rocket,
        Menu,
        PanelLeftClose,
        PanelLeftOpen,
        LucideHistory,
        Calendar,
      })
    ),
  ],
});

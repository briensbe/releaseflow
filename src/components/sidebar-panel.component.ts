import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventListComponent } from "./event-list.component";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-sidebar-panel",
  standalone: true,
  imports: [CommonModule, EventListComponent, LucideAngularModule],
  template: `
    <div class="sidebar-wrapper" [class.open]="isOpen">
      <div class="sidebar-overlay" *ngIf="isOpen && isMobile" (click)="toggleSidebar()"></div>
      <div class="sidebar-content">
        <app-event-list [readonly]="true"></app-event-list>
      </div>
      <button data-tour="sidebar-toggle-tour" class="sidebar-toggle" (click)="toggleSidebar()">
        <lucide-icon [name]="isOpen ? 'panel-left-close' : 'panel-left-open'" size="20"></lucide-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .sidebar-wrapper {
        position: relative;
        height: 100%;
        display: flex;
      }

      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
      }

      .sidebar-content {
        width: 350px;
        height: 100%;
        background: white;
        border-right: 1px solid #e2e8f0;
        overflow-y: auto;
        z-index: 100;
        transition: transform 0.3s ease;
        transform: translateX(0);
      }

      .sidebar-wrapper:not(.open) .sidebar-content {
        position: absolute;
        transform: translateX(-100%);
      }

      .sidebar-toggle {
        position: fixed;
        top: 1.25rem;
        left: 1rem;
        width: 44px;
        height: 44px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 101;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s;
      }

      .sidebar-toggle:hover {
        background: #1d4ed8;
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
      }

      @media (max-width: 1024px) {
        .sidebar-wrapper {
          position: fixed;
          top: 80px;
          left: 0;
          width: 100%;
          height: calc(100vh - 80px);
          z-index: 50;
          pointer-events: none; /* ← LA CLÉ : ignore les clics par défaut */
        }

        /* Permet les clics uniquement sur les éléments interactifs */
        .sidebar-content,
        .sidebar-overlay,
        .sidebar-toggle {
          pointer-events: auto;
        }

        .sidebar-content {
          position: absolute;
        }
      }

      @media (max-width: 768px) {
        .sidebar-content {
          width: 280px;
        }
      }
    `,
  ],
})
export class SidebarPanelComponent {
  @Input() isOpen = false;
  @Output() toggleEvent = new EventEmitter<void>();

  isMobile = window.innerWidth < 1024;

  constructor() {
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 1024;
    });
  }

  toggleSidebar(): void {
    this.toggleEvent.emit();
  }
}

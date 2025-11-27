import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { Event } from "../models/event.model";

@Component({
  selector: "app-day-events-modal",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="modal" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ formattedDate }}</h3>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <div class="modal-body">
          <div *ngIf="events && events.length; else noEvents">
            <div *ngFor="let ev of events" class="day-event-row" (click)="emitOpenEvent(ev)">
              <div class="left">
                <div
                  class="type-badge"
                  [class.badge-livraison]="ev.event_type === 'livraison'"
                  [class.badge-mep]="ev.event_type === 'mep'"
                >
                  <lucide-icon [name]="ev.event_type === 'livraison' ? 'package' : 'rocket'" size="18"></lucide-icon>
                </div>
                <div class="info">
                  <div class="title">{{ ev.title }}</div>
                  <!-- <div class="meta">{{ ev.version }}</div> -->
                  <div class="desc">{{ ev.description }}</div>
                </div>
              </div>
              <div class="actions">
                <button class="icon-btn" (click)="$event.stopPropagation(); emitOpenEvent(ev)" title="Modifier">
                  <lucide-icon name="pen-line" size="16"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
          <ng-template #noEvents>
            <div class="empty-state">Aucun événement pour ce jour.</div>
          </ng-template>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="onClose()">Fermer</button>
          <button class="btn-primary" (click)="onAdd()">
            <lucide-icon name="plus" size="14"></lucide-icon> Ajouter
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 520px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        border-bottom: 1px solid #e9ecef;
      }
      .modal-header h3 {
        margin: 0;
        font-size: 1.125rem;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
      }
      .modal-body {
        padding: 1rem;
        max-height: 60vh;
        overflow: auto;
      }
      .day-event-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 0.75rem;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
        align-items: flex-start;
      }
      .left {
        display: flex;
        gap: 12px;
      }
      .type-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
      }
      .badge-livraison {
        background: #dcfce7;
        color: #15803d;
      }
      .badge-mep {
        background: #f3e8ff;
        color: #7e22ce;
      }
      .info .title {
        font-weight: 600;
      }
      .info .meta {
        font-size: 0.85rem;
        color: #6b7280;
      }
      .info .desc {
        margin-top: 6px;
        color: #495057;
        font-size: 0.9rem;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .icon-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
      }
      .empty-state {
        padding: 1rem;
        color: #6b7280;
      }
      .modal-footer {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        border-top: 1px solid #e9ecef;
      }
      .btn-primary {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
      }
      .btn-secondary {
        background: #e9ecef;
        color: #495057;
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
      }

      /* Dark Mode Overrides */
      :host-context(body.dark-mode) .modal-content {
        background: #1e293b;
        color: #f8fafc;
      }
      :host-context(body.dark-mode) .modal-header {
        border-bottom-color: #334155;
      }
      :host-context(body.dark-mode) .modal-header h3 {
        color: #f8fafc;
      }
      :host-context(body.dark-mode) .close-btn {
        color: #cbd5e1;
      }
      :host-context(body.dark-mode) .close-btn:hover {
        color: #f8fafc;
      }
      :host-context(body.dark-mode) .day-event-row {
        border-bottom-color: #334155;
      }
      :host-context(body.dark-mode) .day-event-row:hover {
        background: #334155;
      }
      :host-context(body.dark-mode) .info .title {
        color: #f8fafc;
      }
      :host-context(body.dark-mode) .info .meta {
        color: #94a3b8;
      }
      :host-context(body.dark-mode) .info .desc {
        color: #cbd5e1;
      }
      :host-context(body.dark-mode) .modal-footer {
        border-top-color: #334155;
      }
      :host-context(body.dark-mode) .btn-secondary {
        background: #334155;
        color: #cbd5e1;
      }
      :host-context(body.dark-mode) .btn-secondary:hover {
        background: #475569;
      }
      :host-context(body.dark-mode) .icon-btn {
        color: #cbd5e1;
      }
      :host-context(body.dark-mode) .icon-btn:hover {
        background: #334155;
      }

      :host-context(body.dark-mode) input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    `,
  ],
})
export class DayEventsModalComponent {
  @Input() events: Event[] = [];
  @Input() dateStr: string | null = null;
  @Input() readonly = false;

  @Output() close = new EventEmitter<void>();
  @Output() openEvent = new EventEmitter<Event>();
  @Output() add = new EventEmitter<string | null>();

  get formattedDate(): string {
    if (!this.dateStr) return '';
    const date = new Date(this.dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  onClose() {
    this.close.emit();
  }

  emitOpenEvent(ev: Event) {
    this.openEvent.emit(ev);
  }

  onAdd() {
    setTimeout(() => this.add.emit(this.dateStr), 0);
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-event-list",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="event-list-container">
      <div class="header">
        <h2><lucide-icon name="calendar" size="22"></lucide-icon> Événements</h2>
        @if (!readonly) {
        <button class="btn-primary" (click)="openAddEventModal()">
          <lucide-icon name="plus" size="16"></lucide-icon>
          Ajouter
        </button>
        }
      </div>

      <div class="filters-section">
        <div class="search-box">
          <lucide-icon name="search" size="18" class="search-icon"></lucide-icon>
          <input
            type="text"
            [(ngModel)]="searchText"
            (ngModelChange)="filterEvents()"
            placeholder="Rechercher..."
            lucide-icon
          />
        </div>

        <!-- <div class="filter-toggle">
          <label>
            <input type="checkbox" [(ngModel)]="showPastEvents" (change)="filterEvents()" />
            <lucide-icon name="lucide-history"></lucide-icon> Évènements Passés
          </label>
        </div> -->

        <label class="toggle-row">
          <span class="toggle-label"
            ><lucide-icon name="lucide-history" size="18"></lucide-icon> Événements passés</span
          >

          <div class="toggle-material">
            <input type="checkbox" [(ngModel)]="showPastEvents" (change)="filterEvents()" />
            <span class="slider"></span>
          </div>
        </label>
      </div>

      <div class="events-info">
        <!-- <span class="info-text">
          {{ filteredEvents.length }}
        </span> -->
        <span class="badge coming">{{ filteredEvents.length }} événements</span>
      </div>

      <!-- <div class="events-table">
        <table *ngIf="filteredEvents.length > 0">
          <thead>
            <tr>
              <th style="width: 50px">Type</th>
              <th style="width: 80px">Titre</th>
              <th style="width: 60px">Version</th>
              <th style="width: 70px">Date</th>
              <th style="flex: 1">Description</th>
              <th style="width: 60px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let event of filteredEvents" [class.past-event]="isPastEvent(event.event_date)">
              <td>
                <span
                  class="type-badge"
                  [class.badge-livraison]="event.event_type === 'livraison'"
                  [class.badge-mep]="event.event_type === 'mep'"
                >
                  <lucide-icon [name]="event.event_type === 'livraison' ? 'package' : 'rocket'" size="20">
                  </lucide-icon>
                </span>
              </td>
              <td class="title-cell">{{ event.title.substring(0, 12) }}</td>
              <td class="version-cell">{{ event.version }}</td>
              <td class="date-cell">{{ formatDate(event.event_date) }}</td>
              <td class="description-cell">{{ event.description.substring(0, 30) }}</td>
              <td class="actions-cell">
                <button class="icon-btn edit-btn" (click)="openEditEventModal(event)" title="Modifier">
                  <lucide-icon name="pen-line" size="20"></lucide-icon>
                </button>
                <button class="icon-btn delete-btn" (click)="deleteEvent(event.id!)" title="Supprimer">
                  <lucide-icon name="trash-2" size="20"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredEvents.length === 0">
          <p>Aucun événement</p>
        </div>
      </div> -->

      <!-- vue en cards  -->
      <div class="event-card" *ngFor="let event of filteredEvents" [class.past-event]="isPastEvent(event.event_date)">
        <div class="left">
          <div
            class="type-badge"
            [class.badge-livraison]="event.event_type === 'livraison'"
            [class.badge-mep]="event.event_type === 'mep'"
          >
            <lucide-icon [name]="event.event_type === 'livraison' ? 'package' : 'rocket'" size="22"> </lucide-icon>
          </div>

          <div class="info">
            <div class="row-1">
              <span class="title">{{ event.title }}</span>
              <span class="badge past" *ngIf="isPastEvent(event.event_date)">Passé</span>
            </div>

            <div class="row-2 date">
              {{ formatDate(event.event_date) }}
            </div>

            <div class="row-3 desc">
              {{ event.description }}
            </div>
          </div>
        </div>
        @if (!readonly) {
        <div class="actions-cell">
          <button class="icon-btn edit-btn" (click)="openEditEventModal(event)" title="Modifier">
            <lucide-icon name="pen-line" size="20"></lucide-icon>
          </button>
          <button class="icon-btn delete-btn" (click)="deleteEvent(event.id!)" title="Supprimer">
            <lucide-icon name="trash-2" size="20"></lucide-icon>
          </button>
        </div>
        }
      </div>

      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditMode ? "Modifier" : "Nouvel événement" }}</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="modalEvent.event_type" (ngModelChange)="updateModalTitle()">
                <option value="livraison">Livraison (LV)</option>
                <option value="mep">Mise en Production (MEP)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Version</label>
              <input type="text" [(ngModel)]="modalEvent.version" (ngModelChange)="updateModalTitle()" />
            </div>

            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="modalEvent.event_date" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="modalEvent.description" rows="3"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-delete" *ngIf="isEditMode" (click)="confirmDelete()">Supprimer</button>
            <button class="btn-secondary" (click)="closeModal()">Annuler</button>
            <button class="btn-primary" (click)="saveEvent()">{{ isEditMode ? "Sauvegarder" : "Créer" }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /*badge */
      .badge.coming {
        background: #e8f0ff;
        color: #5083e6;
      }

      /* juste pour le toggle */
      /* Ligne principale : texte + toggle */
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      /* Texte */
      .toggle-row .toggle-label {
        font-size: 14px;
        color: #333;
        user-select: none;
      }

      /* Toggle Material */
      .toggle-material {
        position: relative;
        width: 46px;
        height: 24px;
        display: inline-block;
      }

      .toggle-material input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-material .slider {
        position: absolute;
        inset: 0;
        background: #000208ff; /* avant : b9c8ff*/
        border-radius: 24px;
        transition: 0.25s;
      }

      .toggle-material .slider:before {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        left: 3px;
        bottom: 3px;
        background: white;
        border-radius: 50%;
        transition: 0.25s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }

      /* Checked */
      .toggle-material input:checked + .slider {
        background: #3d6df2;
      }

      .toggle-material input:checked + .slider:before {
        transform: translateX(22px);
      }

      /* début des styles */
      .event-list-container {
        padding: 1.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: white;
        border-right: 1px solid #e2e8f0;
        overflow: hidden;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 0.5rem;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }

      .btn-primary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #2563eb;
        color: white;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .btn-primary:hover {
        background: #1d4ed8;
      }

      .filters-section {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .search-box {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 0.5rem;
        color: #6b7280;
        pointer-events: none;
      }

      .search-box input {
        width: 100%;
        padding: 0.4rem 0.4rem 0.4rem 2rem;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 0.8rem;
      }

      .search-box input:focus {
        outline: none;
        border-color: #2563eb;
      }

      .filter-toggle {
        display: flex;
        align-items: center;
      }

      .filter-toggle label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: #495057;
        cursor: pointer;
      }

      .filter-toggle input[type="checkbox"] {
        cursor: pointer;
      }

      .events-info {
        padding: 0.25rem 0;
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
      }

      .info-text {
        font-weight: 500;
      }

      .events-table {
        flex: 1;
        overflow-y: auto;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        margin-bottom: 0.5rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.75rem;
      }

      thead {
        background: #f8f9fa;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      th {
        text-align: left;
        padding: 0.5rem;
        font-weight: 600;
        color: #495057;
        border-bottom: 1px solid #dee2e6;
      }

      td {
        padding: 0.5rem;
        border-bottom: 1px solid #e9ecef;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr.past-event {
        opacity: 0.6;
      }

      .type-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-size: 0.65rem;
        font-weight: 600;
      }

      .badge-livraison {
        background: #dcfce7;
        color: #15803d;
      }

      .badge-mep {
        background: #f3e8ff;
        color: #7e22ce;
      }

      .title-cell,
      .version-cell {
        font-weight: 500;
      }

      .description-cell {
        color: #6b7280;
      }

      .actions-cell {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
      }

      .icon-btn {
        background: transparent;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #495057;
      }

      .icon-btn:hover {
        background: #f1f5f9;
      }

      .edit-btn:hover {
        color: #f59e0b;
      }

      .delete-btn {
        color: #ef4444;
      }

      .delete-btn:hover {
        color: #ffffffff;
        background: #ef4444;
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 150px;
        color: #6b7280;
        font-size: 0.8rem;
      }

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
        max-width: 450px;
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
        color: #1a1a1a;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.75rem;
        color: #6b7280;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 28px;
        height: 28px;
      }

      .close-btn:hover {
        color: #1a1a1a;
      }

      .modal-body {
        padding: 1.25rem;
      }

      .form-group {
        margin-bottom: 0.875rem;
      }

      .form-group:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: #495057;
        margin-bottom: 0.375rem;
      }

      input[type="text"],
      input[type="date"],
      select,
      textarea {
        width: 100%;
        padding: 0.4rem;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: inherit;
        box-sizing: border-box;
      }

      input[type="text"]:focus,
      input[type="date"]:focus,
      select:focus,
      textarea:focus {
        outline: none;
        border-color: #2563eb;
      }

      textarea {
        resize: vertical;
      }

      .modal-footer {
        display: flex;
        justify-content: space-between;
        padding: 1.25rem;
        border-top: 1px solid #e9ecef;
        gap: 0.5rem;
      }

      button {
        padding: 0.4rem 0.8rem;
        border: none;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-secondary {
        background: #e9ecef;
        color: #495057;
      }

      .btn-secondary:hover {
        background: #dee2e6;
      }

      .btn-delete {
        background: #ef4444;
        color: white;
        margin-right: auto;
      }

      .btn-delete:hover {
        background: #dc2626;
      }
      /* ajout des classes cards*/
      .event-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 18px;
        border: 1px solid #eee;
        border-radius: 10px;
        margin-bottom: 8px;
        background: white;
        transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
        font-size: 18px;
      }

      .event-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        background-color: #fafafa; /* optionnel */
        cursor: pointer;
      }

      .event-card.past-event {
        opacity: 0.7;
      }

      .left {
        display: flex;
        gap: 14px;
        align-items: flex-start;
      }

      .icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #e9f7ef;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .info .row-1 {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .title {
        font-weight: 600;
      }

      .badge {
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 12px;
      }

      .badge.past {
        background: #efefef;
        color: #666;
      }

      .date {
        font-size: 15px;
        color: #666;
        margin-top: 2px;
      }

      /* la description*/
      .desc {
        margin-top: 6px;
        font-size: 15px;
        color: #444;
      }
      /*
      .actions {
        display: flex;
        gap: 10px;
      }

      .icon-btn {
        border: none;
        background: none;
        cursor: pointer;
      }

      .icon-btn.delete {
        color: #e05a5a;
      }
        */

      /* Dark Mode Overrides */
      :host-context(body.dark-mode) .event-list-container {
        background: #1e293b;
        border-right-color: #334155;
      }

      :host-context(body.dark-mode) h2 {
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .search-box input {
        background: #334155;
        border-color: #475569;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .toggle-row .toggle-label {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .event-card {
        background: #1e293b;
        border-color: #334155;
      }

      :host-context(body.dark-mode) .event-card:hover {
        background-color: #334155;
      }

      :host-context(body.dark-mode) .title {
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .date {
        color: #94a3b8;
      }

      :host-context(body.dark-mode) .desc {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .icon-btn {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .icon-btn:hover {
        background: #334155;
      }
      
      :host-context(body.dark-mode) .badge.past {
        background: #334155;
        color: #94a3b8;
      }

    `,
  ],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchText = "";
  showPastEvents = false;
  showModal = false;
  isEditMode = false;

  @Input() readonly = false;

  modalEvent: any = {};
  private modalEventId: string | null = null;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      this.filterEvents();
    });
  }

  filterEvents(): void {
    let filtered = this.events;

    if (!this.showPastEvents) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        return eventDate >= today;
      });
    }

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.version.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
      );
    }

    this.filteredEvents = filtered.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }

  isPastEvent(dateStr: string): boolean {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }

  openAddEventModal(): void {
    this.isEditMode = false;
    this.modalEventId = null;
    this.modalEvent = {
      event_type: "livraison",
      version: "",
      event_date: new Date().toISOString().split("T")[0],
      description: "",
      title: "",
    };
    this.showModal = true;
  }

  openEditEventModal(event: Event): void {
    this.isEditMode = true;
    this.modalEventId = event.id!;
    this.modalEvent = { ...event };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalEvent = {};
    this.modalEventId = null;
  }

  updateModalTitle(): void {
    const prefix = this.modalEvent.event_type === "livraison" ? "LV" : "MEP";
    this.modalEvent.title = `${prefix} ${this.modalEvent.version}`;
  }

  async saveEvent(): Promise<void> {
    if (!this.modalEvent.version || !this.modalEvent.event_date) {
      alert("Version et date sont obligatoires");
      return;
    }

    this.updateModalTitle();

    if (this.isEditMode && this.modalEventId) {
      await this.eventService.updateEvent(this.modalEventId, this.modalEvent);
    } else {
      await this.eventService.createEvent(this.modalEvent);
    }

    this.closeModal();
  }

  confirmDelete(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      this.deleteEvent(this.modalEventId!);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventService.deleteEvent(id);
    this.closeModal();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

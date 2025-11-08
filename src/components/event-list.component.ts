import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="event-list-container">
      <div class="header">
        <h2>Gestion des Livraisons et MEP</h2>
        <button class="btn-primary" (click)="toggleAddForm()">
          {{ showAddForm ? 'Annuler' : 'Ajouter un événement' }}
        </button>
      </div>

      <div class="add-form" *ngIf="showAddForm">
        <h3>Nouvel Événement</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Type</label>
            <select [(ngModel)]="newEvent.event_type">
              <option value="livraison">Livraison (LV)</option>
              <option value="mep">Mise en Production (MEP)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Version</label>
            <input type="text" [(ngModel)]="newEvent.version" placeholder="2025.4" />
          </div>

          <div class="form-group">
            <label>Date</label>
            <input type="date" [(ngModel)]="newEvent.event_date" />
          </div>

          <div class="form-group full-width">
            <label>Description</label>
            <textarea [(ngModel)]="newEvent.description" placeholder="Description de l'événement" rows="3"></textarea>
          </div>
        </div>

        <button class="btn-primary" (click)="addEvent()">Créer</button>
      </div>

      <div class="events-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Titre</th>
              <th>Version</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let event of events" [class.editing]="editingId === event.id">
              <td>
                <span class="badge" [class.badge-livraison]="event.event_type === 'livraison'"
                      [class.badge-mep]="event.event_type === 'mep'">
                  {{ event.event_type === 'livraison' ? 'LV' : 'MEP' }}
                </span>
              </td>
              <td>
                <ng-container *ngIf="editingId !== event.id">{{ event.title }}</ng-container>
                <input *ngIf="editingId === event.id" type="text" [(ngModel)]="editEvent.title" />
              </td>
              <td>
                <ng-container *ngIf="editingId !== event.id">{{ event.version }}</ng-container>
                <input *ngIf="editingId === event.id" type="text" [(ngModel)]="editEvent.version" />
              </td>
              <td>
                <ng-container *ngIf="editingId !== event.id">{{ formatDate(event.event_date) }}</ng-container>
                <input *ngIf="editingId === event.id" type="date" [(ngModel)]="editEvent.event_date" />
              </td>
              <td class="description-cell">
                <ng-container *ngIf="editingId !== event.id">{{ event.description }}</ng-container>
                <textarea *ngIf="editingId === event.id" [(ngModel)]="editEvent.description" rows="2"></textarea>
              </td>
              <td>
                <div class="actions">
                  <button *ngIf="editingId !== event.id" class="btn-edit" (click)="startEdit(event)">
                    Modifier
                  </button>
                  <button *ngIf="editingId === event.id" class="btn-save" (click)="saveEdit()">
                    Sauvegarder
                  </button>
                  <button *ngIf="editingId === event.id" class="btn-cancel" (click)="cancelEdit()">
                    Annuler
                  </button>
                  <button *ngIf="editingId !== event.id" class="btn-delete" (click)="deleteEvent(event.id!)">
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="events.length === 0">
              <td colspan="6" class="empty-state">Aucun événement. Créez-en un pour commencer.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .event-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .add-form {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .add-form h3 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      color: #1a1a1a;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    input, select, textarea {
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 0.875rem;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #2563eb;
    }

    textarea {
      resize: vertical;
    }

    .events-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f8f9fa;
    }

    th {
      text-align: left;
      padding: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
      font-size: 0.875rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr.editing {
      background: #f8f9fa;
    }

    .description-cell {
      max-width: 300px;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-livraison {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-mep {
      background: #dcfce7;
      color: #166534;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-edit {
      background: #f59e0b;
      color: white;
    }

    .btn-edit:hover {
      background: #d97706;
    }

    .btn-save {
      background: #10b981;
      color: white;
    }

    .btn-save:hover {
      background: #059669;
    }

    .btn-cancel {
      background: #6b7280;
      color: white;
    }

    .btn-cancel:hover {
      background: #4b5563;
    }

    .btn-delete {
      background: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background: #dc2626;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 2rem !important;
    }
  `]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  showAddForm = false;
  editingId: string | null = null;

  newEvent: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    event_type: 'livraison',
    event_date: '',
    description: '',
    version: ''
  };

  editEvent: any = {};

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.events$.subscribe(events => {
      this.events = events;
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.resetNewEvent();
    }
  }

  resetNewEvent(): void {
    this.newEvent = {
      title: '',
      event_type: 'livraison',
      event_date: '',
      description: '',
      version: ''
    };
  }

  async addEvent(): Promise<void> {
    if (!this.newEvent.version || !this.newEvent.event_date) {
      alert('Version et date sont obligatoires');
      return;
    }

    const prefix = this.newEvent.event_type === 'livraison' ? 'LV' : 'MEP';
    this.newEvent.title = `${prefix} ${this.newEvent.version}`;

    await this.eventService.createEvent(this.newEvent);
    this.showAddForm = false;
    this.resetNewEvent();
  }

  startEdit(event: Event): void {
    this.editingId = event.id!;
    this.editEvent = { ...event };
  }

  async saveEdit(): Promise<void> {
    if (this.editingId) {
      const prefix = this.editEvent.event_type === 'livraison' ? 'LV' : 'MEP';
      this.editEvent.title = `${prefix} ${this.editEvent.version}`;

      await this.eventService.updateEvent(this.editingId, this.editEvent);
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editEvent = {};
  }

  async deleteEvent(id: string): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      await this.eventService.deleteEvent(id);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

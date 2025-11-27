import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { LucideAngularModule } from "lucide-angular";
import { SidebarPanelComponent } from "./sidebar-panel.component";
import { DayEventsModalComponent } from "./day-events-modal.component";

@Component({
  selector: "app-compact-view",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, SidebarPanelComponent, DayEventsModalComponent],
  template: `
    <div class="compact-wrapper">
      <app-sidebar-panel [isOpen]="sidebarOpen" (toggleEvent)="sidebarOpen = !sidebarOpen"></app-sidebar-panel>
      <div class="compact-container">
        <div class="compact-header">
          <div class="header-controls">
            <button class="nav-btn" (click)="previousPeriod()">‹</button>
            <h2>{{ getPeriodTitle() }}</h2>
            <button class="nav-btn" (click)="nextPeriod()">›</button>
          </div>
          
          <div class="view-options">
            <div class="option-group">
              <label>Début:</label>
              <input type="month" [ngModel]="startDateStr" (ngModelChange)="onStartDateChange($event)">
            </div>
            <div class="option-group">
              <label>Mois:</label>
              <div class="count-controls">
                <button class="count-btn" (click)="changeMonthsCount(-1)" [disabled]="monthsCount <= 1">-</button>
                <span class="count-display">{{ monthsCount }}</span>
                <button class="count-btn" (click)="changeMonthsCount(1)" [disabled]="monthsCount >= 12">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="months-grid">
          <div *ngFor="let monthData of monthsData" class="month-column">
            <h3 class="month-title">{{ monthData.title }}</h3>

            <div class="compact-table">
              <div class="table-header">
                <div class="col-date">Date</div>
                <div class="col-day">Jour</div>
                <div class="col-events">Événements</div>
              </div>

              <div
                *ngFor="let day of monthData.days"
                class="table-row"
                (click)="onRowClick(day)"
                [class.has-events]="day.events.length > 0"
                [class.today]="day.isToday"
                [class.weekend]="day.isWeekend"
                [class.holiday]="day.isHoliday"
              >
                <div class="col-date">{{ day.dayNumber }}</div>
                <div class="col-day">{{ day.dayName }}</div>
                <div class="col-events">
                  <div class="events-list">
                    <div
                      *ngFor="let event of day.events"
                      class="compact-event"
                      [class.event-livraison]="event.event_type === 'livraison'"
                      [class.event-mep]="event.event_type === 'mep'"
                      (click)="$event.stopPropagation(); openEventModal(event)"
                    >
                      <lucide-icon [name]="event.event_type === 'livraison' ? 'package' : 'rocket'" size="11">
                      </lucide-icon>
                      {{ event.title.substring(0, 14) }}
                    </div>
                    <button class="add-compact-btn" (click)="$event.stopPropagation(); openAddEventModal(day.dateStr)">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-day-events-modal
        *ngIf="showDayEventsModal"
        [events]="selectedDayEvents"
        [dateStr]="selectedDayDateStr"
        (close)="showDayEventsModal = false"
        (openEvent)="openEventModal($event)"
        (add)="onDayModalAdd($event)"
      ></app-day-events-modal>

      <div class="modal" *ngIf="showEmptyDayModal" (click)="closeEmptyDayModal()">
        <div class="modal-content empty-day-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ emptyDayDate }}</h3>
            <button class="close-btn" (click)="closeEmptyDayModal()">×</button>
          </div>

          <div class="modal-body">
            <p class="empty-message">Aucune livraison prévue ce jour</p>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeEmptyDayModal()">Fermer</button>
            <button class="btn-primary" (click)="createEventFromEmptyDay()">+ Ajouter</button>
          </div>
        </div>
      </div>

      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditMode ? "Modifier l'événement" : "Nouvel événement" }}</h3>
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
              <textarea [(ngModel)]="modalEvent.description" rows="4"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-delete" *ngIf="isEditMode" (click)="deleteEvent()">Supprimer</button>
            <button class="btn-secondary" (click)="closeModal()">Annuler</button>
            <button class="btn-primary" (click)="saveEvent()">{{ isEditMode ? "Sauvegarder" : "Créer" }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .compact-wrapper {
        display: flex;
        height: calc(100vh - 80px);
      }

      .compact-container {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
      }

      .compact-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .header-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .view-options {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      .option-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .option-group label {
        margin: 0;
        font-size: 0.875rem;
        color: #64748b;
      }

      .option-group input {
        padding: 0.25rem 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 0.875rem;
        color: #1e293b;
        width: auto;
      }

      .count-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f1f5f9;
        padding: 0.125rem;
        border-radius: 4px;
        border: 1px solid #e2e8f0;
      }

      .count-btn {
        width: 24px;
        height: 24px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 3px;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        color: #475569;
      }

      .count-btn:hover:not(:disabled) {
        background: #f8fafc;
        color: #2563eb;
        border-color: #2563eb;
      }

      .count-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f1f5f9;
      }

      .count-display {
        min-width: 20px;
        text-align: center;
        font-weight: 600;
        font-size: 0.875rem;
        color: #1e293b;
      }

      .compact-header h2 {
        font-size: 1.75rem;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }

      .nav-btn {
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        width: 40px;
        height: 40px;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-btn:hover {
        background: #f8f9fa;
        border-color: #2563eb;
      }

      .months-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .month-column {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .month-title {
        background: #2563eb;
        margin: 0;
        padding: 1rem;
        font-size: 1.125rem;
        font-weight: 600;
        color: white;
        text-align: center;
        border-bottom: 2px solid #dee2e6;
      }


      .compact-table {
        font-size: 0.8rem;
      }

      .table-header {
        display: grid;
        grid-template-columns: 50px 50px 1fr;
        background: #f8f9fa;
        font-weight: 600;
        color: #495057;
        border-bottom: 1px solid #dee2e6;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .table-header > div {
        padding: 0.75rem 0.5rem;
        border-right: 1px solid #e9ecef;
      }

      .table-header > div:last-child {
        border-right: none;
      }

      .table-row {
        display: grid;
        grid-template-columns: 50px 50px 1fr;
        border-bottom: 1px solid #e9ecef;
        transition: background-color 0.2s;
        min-height: 36px;
      }

      .table-row:hover {
        background: #f8f9fa;
      }

      .table-row.today {
        background: #fef9c3;
        /*background: #fefce8;*/
      }

      .table-row.weekend,
      .table-row.holiday {
        background: #f0f0f0;
      }

      .table-row.weekend:hover,
      .table-row.holiday:hover {
        background: #e9ecef;
      }

      .col-date,
      .col-day {
        padding: 0.5rem;
        border-right: 1px solid #e9ecef;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
      }

      .col-events {
        padding: 0.5rem;
        display: flex;
        align-items: center;
      }

      .events-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        width: 100%;
      }

      .compact-event {
        background: #dbeafe;
        color: #1e40af;
        padding: 0.125rem 0.375rem;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .compact-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .compact-event.event-mep {
        background: #dcfce7;
        color: #166534;
      }

      .add-compact-btn {
        background: transparent;
        border: 1px dashed #dee2e6;
        border-radius: 3px;
        padding: 0.125rem 0.375rem;
        font-size: 0.7rem;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s;
      }

      .add-compact-btn:hover {
        border-color: #2563eb;
        color: #2563eb;
        background: #eff6ff;
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
        max-width: 500px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1a1a1a;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        color: #6b7280;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 32px;
        height: 32px;
      }

      .close-btn:hover {
        color: #1a1a1a;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #495057;
        margin-bottom: 0.5rem;
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 0.875rem;
        font-family: inherit;
        box-sizing: border-box;
      }

      input:focus,
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
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
        gap: 0.5rem;
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

      /* Empty Day Modal */
      .empty-day-modal {
        max-width: 400px;
      }

      .empty-day-modal .modal-body {
        padding: 2rem 1.5rem;
      }

      .empty-message {
        color: #64748b;
        font-size: 0.95rem;
        margin: 0;
        text-align: center;
      }

      /* Dark Mode Overrides */
      :host-context(body.dark-mode) .compact-header h2 {
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .nav-btn {
        background: #1e293b;
        border-color: #334155;
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .nav-btn:hover {
        background: #334155;
        border-color: #60a5fa;
        color: #60a5fa;
      }

      :host-context(body.dark-mode) .view-options {
        background: #1e293b;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }

      :host-context(body.dark-mode) .option-group label {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .option-group input {
        background: #334155;
        border-color: #475569;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .option-group input[type="month"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }

      :host-context(body.dark-mode) .count-controls {
        background: #334155;
        border-color: #475569;
      }

      :host-context(body.dark-mode) .count-btn {
        background: #1e293b;
        border-color: #475569;
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .count-btn:hover:not(:disabled) {
        background: #475569;
        color: #60a5fa;
        border-color: #60a5fa;
      }

      :host-context(body.dark-mode) .count-btn:disabled {
        background: #334155;
        color: #64748b;
      }

      :host-context(body.dark-mode) .count-display {
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .month-column {
        background: #1e293b;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }

      :host-context(body.dark-mode) .month-title {
        background: #1e40af;
        border-bottom-color: #334155;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .table-header {
        background: #334155;
        color: #cbd5e1;
        border-bottom-color: #475569;
      }

      :host-context(body.dark-mode) .table-header > div {
        border-right-color: #475569;
      }

      :host-context(body.dark-mode) .table-row {
        border-bottom-color: #334155;
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .table-row:hover {
        background: #334155;
      }

      :host-context(body.dark-mode) .table-row.today {
        background: #1e3a8a;
        /*background: #fef9c3;*/
        /*background: #fefce8;*/
      }

      :host-context(body.dark-mode) .table-row.weekend,
      :host-context(body.dark-mode) .table-row.holiday {
        background: #27272a;
      }

      :host-context(body.dark-mode) .table-row.weekend:hover,
      :host-context(body.dark-mode) .table-row.holiday:hover {
        background: #3f3f46;
      }

      :host-context(body.dark-mode) .col-date,
      :host-context(body.dark-mode) .col-day {
        border-right-color: #334155;
      }

      :host-context(body.dark-mode) .compact-event {
        background: #1e3a8a;
        color: #93c5fd;
      }

      :host-context(body.dark-mode) .compact-event.event-mep {
        background: #14532d;
        color: #86efac;
      }

      :host-context(body.dark-mode) .add-compact-btn {
        border-color: #475569;
        color: #64748b;
      }

      :host-context(body.dark-mode) .add-compact-btn:hover {
        border-color: #60a5fa;
        color: #60a5fa;
        background: #1e3a8a;
      }

      /* Modal Dark Mode */
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

      :host-context(body.dark-mode) label {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) input,
      :host-context(body.dark-mode) select,
      :host-context(body.dark-mode) textarea {
        background: #334155;
        border-color: #475569;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }

      :host-context(body.dark-mode) input:focus,
      :host-context(body.dark-mode) select:focus,
      :host-context(body.dark-mode) textarea:focus {
        border-color: #60a5fa;
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

      :host-context(body.dark-mode) .empty-message {
        color: #cbd5e1;
      }


      @media (max-width: 1200px) {
        .months-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CompactViewComponent implements OnInit {
  startDate = new Date();
  monthsData: any[] = [];
  events: Event[] = [];
  sidebarOpen = false; // désactivé par défaut

  showModal = false;
  isEditMode = false;
  modalEvent: any = {};

  dayNames = ["D", "L", "M", "M", "J", "V", "S"];

  // Day list modal state
  showDayEventsModal = false;
  selectedDayEvents: Event[] = [];
  selectedDayDateStr: string | null = null;

  // Empty day modal state
  showEmptyDayModal = false;
  emptyDayDate: string = '';
  emptyDayDateStr: string = '';

  monthsCount = 4; // Default to 4 months

  constructor(private eventService: EventService) {
    this.startDate.setDate(1);
  }

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      this.generateCompactView();
    });
  }

  changeMonthsCount(delta: number): void {
    const newCount = this.monthsCount + delta;
    if (newCount >= 1 && newCount <= 12) {
      this.monthsCount = newCount;
      this.generateCompactView();
    }
  }

  onStartDateChange(dateStr: string): void {
    if (dateStr) {
      const [year, month] = dateStr.split('-').map(Number);
      this.startDate = new Date(year, month - 1, 1);
      this.generateCompactView();
    }
  }

  get startDateStr(): string {
    const year = this.startDate.getFullYear();
    const month = String(this.startDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  generateCompactView(): void {
    this.monthsData = [];

    for (let i = 0; i < this.monthsCount; i++) {
      const monthDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + i, 1);
      const monthTitle = monthDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const days = [];

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const dateStr = this.formatDateToString(date);
        const dayEvents = this.eventService.getEventsByDate(dateStr);

        days.push({
          dayNumber: String(day).padStart(2, "0"),
          dayName: this.getDayName(date),
          dateStr: dateStr,
          isToday: this.isToday(date),
          isWeekend: this.isWeekend(date),
          isHoliday: this.isFrenchHoliday(date),
          events: dayEvents,
        });
      }

      this.monthsData.push({
        title: monthTitle,
        days: days,
      });
    }
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  getDayName(date: Date): string {
    const dayIndex = date.getDay();
    return this.dayNames[dayIndex];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  isFrenchHoliday(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Fixed holidays
    const fixedHolidays = [
      { m: 1, d: 1 },   // New Year
      { m: 5, d: 1 },   // Labour Day
      { m: 5, d: 8 },   // Victory Day
      { m: 7, d: 14 },  // Bastille Day
      { m: 8, d: 15 },  // Assumption
      { m: 11, d: 1 },  // All Saints
      { m: 11, d: 11 }, // Armistice
      { m: 12, d: 25 }, // Christmas
    ];

    if (fixedHolidays.some(h => h.m === month && h.d === day)) {
      return true;
    }

    // Easter-based holidays (using Meeus/Jones/Butcher algorithm)
    const easter = this.getEasterDate(year);
    const easterTime = easter.getTime();
    const dateTime = date.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // Easter Monday (+1 day)
    if (dateTime === easterTime + dayMs) return true;

    // Ascension (+39 days)
    if (dateTime === easterTime + 39 * dayMs) return true;

    // Whit Monday (+50 days)
    if (dateTime === easterTime + 50 * dayMs) return true;

    return false;
  }

  getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  getPeriodTitle(): string {
    const endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + this.monthsCount, 0);
    return `${this.startDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })} - ${endDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  }

  previousPeriod(): void {
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() - this.monthsCount, 1);
    this.generateCompactView();
  }

  nextPeriod(): void {
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + this.monthsCount, 1);
    this.generateCompactView();
  }

  openAddEventModal(date: string): void {
    this.isEditMode = false;
    this.modalEvent = {
      event_type: "livraison",
      version: "",
      event_date: date,
      description: "",
      title: "",
    };
    this.showModal = true;
  }

  openEventModal(event: Event): void {
    // if day modal open, close it before opening event modal
    this.showDayEventsModal = false;
    this.isEditMode = true;
    this.modalEvent = { ...event };
    this.showModal = true;
  }

  onRowClick(day: any): void {
    if (day && day.events && day.events.length > 0) {
      this.selectedDayEvents = day.events;
      this.selectedDayDateStr = day.dateStr;
      this.showDayEventsModal = true;
    } else if (day && day.dateStr) {
      // Show empty day modal instead of directly opening add event modal
      this.emptyDayDateStr = day.dateStr;
      this.emptyDayDate = this.formatDateForDisplay(day.dateStr);
      this.showEmptyDayModal = true;
    }
  }

  formatDateForDisplay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  closeEmptyDayModal(): void {
    this.showEmptyDayModal = false;
    this.emptyDayDate = '';
    this.emptyDayDateStr = '';
  }

  createEventFromEmptyDay(): void {
    this.showEmptyDayModal = false;
    this.openAddEventModal(this.emptyDayDateStr);
  }

  onDayModalAdd(date: string | null) {
    this.showDayEventsModal = false;
    setTimeout(() => this.openAddEventModal(date ?? ""), 0);
  }

  closeModal(): void {
    this.showModal = false;
    this.modalEvent = {};
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

    if (this.isEditMode) {
      await this.eventService.updateEvent(this.modalEvent.id, this.modalEvent);
    } else {
      await this.eventService.createEvent(this.modalEvent);
    }

    this.closeModal();
  }

  async deleteEvent(): Promise<void> {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      await this.eventService.deleteEvent(this.modalEvent.id);
      this.closeModal();
    }
  }
}

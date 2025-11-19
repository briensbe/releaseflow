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
          <button class="nav-btn" (click)="previousPeriod()">‹</button>
          <h2>{{ getPeriodTitle() }}</h2>
          <button class="nav-btn" (click)="nextPeriod()">›</button>
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
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }

      .month-column {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .month-title {
        background: #f8f9fa;
        margin: 0;
        padding: 1rem;
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a1a1a;
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
        background: #eff6ff;
      }

      .table-row.has-events {
        background: #fefce8;
      }

      .table-row.has-events:hover {
        background: #fef9c3;
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
  sidebarOpen = true;

  showModal = false;
  isEditMode = false;
  modalEvent: any = {};

  dayNames = ["D", "L", "M", "M", "J", "V", "S"];

  // Day list modal state
  showDayEventsModal = false;
  selectedDayEvents: Event[] = [];
  selectedDayDateStr: string | null = null;

  constructor(private eventService: EventService) {
    this.startDate.setDate(1);
  }

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      this.generateCompactView();
    });
  }

  generateCompactView(): void {
    this.monthsData = [];

    const nbMonthsToDisplay = 4;
    for (let i = 0; i < nbMonthsToDisplay; i++) {
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

  getPeriodTitle(): string {
    const endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 2, 0);
    return `${this.startDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })} - ${endDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  }

  previousPeriod(): void {
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() - 3, 1);
    this.generateCompactView();
  }

  nextPeriod(): void {
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 3, 1);
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
      this.openAddEventModal(day.dateStr);
    }
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

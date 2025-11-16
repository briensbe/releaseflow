import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { LucideAngularModule } from "lucide-angular";
import { SidebarPanelComponent } from "./sidebar-panel.component";

@Component({
  selector: "app-calendar-view",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, SidebarPanelComponent],
  template: `
    <div class="calendar-wrapper">
      <app-sidebar-panel [isOpen]="sidebarOpen" (toggleEvent)="sidebarOpen = !sidebarOpen"></app-sidebar-panel>
      <div class="calendar-container">
        <div class="calendar-header">
          <button class="nav-btn" (click)="previousMonth()">‹</button>
          <h2>{{ getMonthYear() }}</h2>
          <button class="nav-btn" (click)="nextMonth()">›</button>
        </div>

        <div class="calendar-grid">
          <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>

          <div
            *ngFor="let day of calendarDays"
            class="calendar-day"
            [class.other-month]="!day.isCurrentMonth"
            [class.today]="day.isToday"
          >
            <div class="day-number">{{ day.dayNumber }}</div>

            <div class="day-events">
              <div
                *ngFor="let event of day.events"
                class="event-item"
                [class.event-livraison]="event.event_type === 'livraison'"
                [class.event-mep]="event.event_type === 'mep'"
                (click)="openEventModal(event, day.date)"
              >
                <lucide-icon [name]="event.event_type === 'livraison' ? 'package' : 'rocket'" size="12"> </lucide-icon>
                {{ event.title.substring(0, 10) }}
              </div>

              <button class="add-event-btn" (click)="openAddEventModal(day.date)">+</button>
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
    </div>
  `,
  styles: [
    `
      .calendar-wrapper {
        display: flex;
        height: calc(100vh - 80px);
      }

      .calendar-container {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .calendar-header h2 {
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

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: #dee2e6;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
      }

      .day-header {
        background: #f8f9fa;
        padding: 1rem;
        text-align: center;
        font-weight: 600;
        font-size: 0.875rem;
        color: #495057;
      }

      .calendar-day {
        background: white;
        min-height: 120px;
        padding: 0.5rem;
        position: relative;
        transition: background-color 0.2s;
      }

      .calendar-day:hover {
        background: #f8f9fa;
      }

      .calendar-day.other-month {
        background: #f8f9fa;
        opacity: 0.5;
      }

      .calendar-day.today {
        background: #eff6ff;
      }

      .day-number {
        font-weight: 600;
        font-size: 0.875rem;
        color: #1a1a1a;
        margin-bottom: 0.5rem;
      }

      .day-events {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .event-item {
        background: #dbeafe;
        color: #1e40af;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .event-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .event-item.event-mep {
        background: #dcfce7;
        color: #166534;
      }

      .add-event-btn {
        background: transparent;
        border: 1px dashed #dee2e6;
        border-radius: 4px;
        padding: 0.25rem;
        font-size: 1rem;
        color: #6b7280;
        cursor: pointer;
        margin-top: 0.25rem;
        transition: all 0.2s;
      }

      .add-event-btn:hover {
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
    `,
  ],
})
export class CalendarViewComponent implements OnInit {
  currentDate = new Date();
  calendarDays: any[] = [];
  weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  events: Event[] = [];
  sidebarOpen = true;

  showModal = false;
  isEditMode = false;
  modalEvent: any = {};

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      this.generateCalendar();
    });
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let dayOfWeek = firstDay.getDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.calendarDays = [];

    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        dayNumber: prevMonthLastDay - i,
        date: this.formatDateToString(date),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = this.formatDateToString(date);
      const dayEvents = this.eventService.getEventsByDate(dateStr);

      this.calendarDays.push({
        dayNumber: day,
        date: dateStr,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        events: dayEvents,
      });
    }

    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        dayNumber: day,
        date: this.formatDateToString(date),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getMonthYear(): string {
    return this.currentDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendar();
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

  openEventModal(event: Event, date: string): void {
    this.isEditMode = true;
    this.modalEvent = { ...event };
    this.showModal = true;
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

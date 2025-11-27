import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { LucideAngularModule } from "lucide-angular";

interface TimelineGroup {
  date: string;
  events: Event[];
}

@Component({
  selector: "app-timeline-view",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="timeline-container">
      <div class="header">
        <h2><lucide-icon name="git-commit" size="22"></lucide-icon> Timeline</h2>
        <button class="toggle-btn" (click)="toggleMode()" [title]="isHorizontal ? 'Passer en vue verticale' : 'Passer en vue horizontale'">
          <lucide-icon [name]="isHorizontal ? 'align-justify' : 'columns'" size="20"></lucide-icon>
          <span>{{ isHorizontal ? 'Vue Verticale' : 'Vue Horizontale' }}</span>
        </button>
      </div>

      <div class="timeline-wrapper" [class.horizontal]="isHorizontal">
        <div class="timeline">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            *ngFor="let group of groupedEvents; let i = index"
            [class.left]="!isHorizontal && i % 2 === 0"
            [class.right]="!isHorizontal && i % 2 !== 0"
          >
          <div class="content">
            <div class="date-badge">{{ formatDate(group.date) }}</div>
            <div class="events-group">
              <div class="card" *ngFor="let event of group.events" [class.is-livraison]="event.event_type === 'livraison'" [class.is-mep]="event.event_type === 'mep'">
                <div class="card-header">
                  <span class="type-icon">
                    <lucide-icon [name]="event.event_type === 'livraison' ? 'package' : 'rocket'" size="18"></lucide-icon>
                  </span>
                  <span class="title">{{ event.title }}</span>
                  <span class="version">{{ event.version }}</span>
                </div>
                <div class="card-body">
                  <p>{{ event.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="dot"></div>
        </div>
        
          <div class="empty-state" *ngIf="events.length === 0">
            <p>Aucun événement à afficher</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .timeline-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Keep hidden for container, but wrapper needs to handle it */
        background: #f8fafc;
      }
      
      /* Allow vertical scroll on container when in horizontal mode if needed? 
         Actually, if timeline-wrapper has overflow-x: auto, it handles horizontal.
         If content grows vertically, timeline-wrapper height grows.
         If timeline-wrapper grows > container height, container needs overflow-y: auto.
      */
      .timeline-container:has(.timeline-wrapper.horizontal) {
        overflow-y: auto;
      }

      .header {
        padding: 2rem;
        margin-bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        color: #64748b;
        transition: all 0.2s;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }

      .toggle-btn:hover {
        background: #f1f5f9;
        color: #334155;
      }

      .timeline-wrapper {
        flex-grow: 1;
        overflow-y: auto;
        padding: 2rem;
        position: relative;
      }

      /* Custom Scrollbar for Horizontal View */
      .timeline-wrapper.horizontal::-webkit-scrollbar {
        height: 12px; /* Thicker scrollbar */
      }

      .timeline-wrapper.horizontal::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 6px;
      }

      .timeline-wrapper.horizontal::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 6px;
        border: 3px solid #f1f5f9;
      }

      .timeline-wrapper.horizontal::-webkit-scrollbar-thumb:hover {
        background-color: #94a3b8;
      }

      .timeline-wrapper.horizontal {
        overflow-x: auto;
        overflow-y: hidden; /* Allow main container to scroll if needed, but usually we want horizontal scroll */
        /* Actually user wants unlimited vertical space. 
           If we set overflow-y: visible, the parent container needs to scroll.
           The parent .timeline-container has overflow: hidden. We need to change that.
        */
        display: flex;
        align-items: center; /* Center the line vertically relative to viewport? No, we want line in middle of content */
        padding: 2rem;
        height: auto;
        min-height: 100%; /* This ensures the horizontal scrollable area takes at least 100% of its parent's height */
      }

      .timeline-wrapper.horizontal .timeline {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        height: auto; /* Let it grow */
        min-height: 600px; /* Minimum height */
        min-width: 100%;
        max-width: none;
        padding: 4rem 4rem; /* Add vertical padding */
        margin: 0;
      }

      .timeline-wrapper.horizontal .timeline-line {
        width: 100%;
        height: 4px;
        top: 40px; /* Position at top */
        left: 0;
        transform: none;
        background: linear-gradient(to right, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
      }

      .timeline-wrapper.horizontal .timeline-item {
        width: 320px;
        flex-shrink: 0;
        margin: 0 1.5rem;
        height: auto;
        min-height: 200px;
        position: relative;
        display: flex;
        left: auto;
        right: auto;
        padding: 0;
        text-align: left;
        overflow: visible;
        
        /* Always below line */
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 10px; /* Space for line and connector */ /* Reduced to bring cards up to the new dot position */
        align-self: stretch;
      }

      /* We need to ensure the "line" stays in the visual center of the items? 
         If we use align-self: stretch, the items are as tall as the tallest one.
         The line is at 50% of the container.
         So top items will end at 50% - padding.
         Bottom items will start at 50% + padding.
         This works!
      */

      /* Scrollable content area for horizontal items - REMOVE scroll, allow full height */
      .timeline-wrapper.horizontal .content {
        width: 100%;
        max-height: none;
        overflow-y: visible;
        padding-right: 0;
      }
      
      /* Custom scrollbar for item content */
      .timeline-wrapper.horizontal .content::-webkit-scrollbar {
        width: 4px;
      }
      .timeline-wrapper.horizontal .content::-webkit-scrollbar-track {
        background: transparent;
      }
      .timeline-wrapper.horizontal .content::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 4px;
      }

      .timeline-wrapper.horizontal .timeline-item {
        left: auto;
        right: auto;
        text-align: left;
        padding-left: 0;
        padding-right: 0;
      }

      /* Hide vertical connectors in horizontal mode */
      .timeline-wrapper.horizontal .timeline-item::after {
        display: none;
      }

      .timeline-wrapper.horizontal .dot {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        flex-shrink: 0;
        z-index: 20;
        top: -32px; /* Center on line (40px top + 2px center - 10px half dot) */
        bottom: auto;
        right: auto;
      }

      /* Fix hover effect in horizontal mode to keep centering */
      .timeline-wrapper.horizontal .timeline-item:hover .dot {
        transform: translateX(-50%) scale(1.2);
      }

      /* Connector Lines for Horizontal Mode */
      .timeline-wrapper.horizontal .timeline-item::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        background: #e2e8f0;
        z-index: 1;
        top: -12px; /* Start from bottom of dot (-32px + 20px height) */
        height: 22px; /* Connect to content (10px padding - (-12px start)) */
        bottom: auto;
      }


      .timeline-wrapper.horizontal .timeline-item .card-header {
        flex-direction: row;
      }
      
      /* Vertical Mode (Default) adjustments */
      
      h2 {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.8rem;
        color: #1e293b;
        margin: 0;
        background: white;
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .timeline {
        position: relative;
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 0;
      }

      .timeline-line {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 100%;
        background: linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
        border-radius: 2px;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 3rem;
        width: 50%;
      }

      .timeline-item.left {
        left: 0;
        padding-right: 3rem;
        text-align: right;
      }

      .timeline-item.right {
        left: 50%;
        padding-left: 3rem;
        text-align: left;
      }

      /* Connector Lines for Vertical Mode */
      .timeline-item::after {
        content: '';
        position: absolute;
        top: 30px; /* Align with dot center approx */
        height: 2px;
        width: 3rem; /* Width of padding */
        background: #e2e8f0;
        z-index: 1;
      }

      .timeline-item.left::after {
        right: 0;
      }

      .timeline-item.right::after {
        left: 0;
      }

      .dot {
        position: absolute;
        top: 20px;
        width: 20px;
        height: 20px;
        background: white;
        border: 4px solid #3b82f6;
        border-radius: 50%;
        z-index: 10;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
      }

      .timeline-item.left .dot {
        right: -10px;
      }

      .timeline-item.right .dot {
        left: -10px;
      }

      .timeline-item:hover .dot {
        transform: scale(1.2);
        background: #3b82f6;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3);
      }

      .content {
        position: relative;
        transition: transform 0.3s ease;
      }

      .timeline-item:hover .content {
        transform: translateY(-5px);
      }

      .date-badge {
        display: inline-block;
        background: #475569;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .card {
        background: white;
        border-radius: 12px;
        padding: 1.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-left: 5px solid transparent;
        position: relative;
        overflow: hidden;
      }

      .card + .card {
        margin-top: 1rem;
      }

      .card.is-livraison {
        border-left-color: #10b981;
      }

      .card.is-mep {
        border-left-color: #8b5cf6;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 0.75rem;
      }

      .timeline-item.left .card-header {
        flex-direction: row-reverse;
      }

      .type-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }

      .is-livraison .type-icon {
        background: #d1fae5;
        color: #059669;
      }

      .is-mep .type-icon {
        background: #ede9fe;
        color: #7c3aed;
      }

      .title {
        font-weight: 700;
        font-size: 1.1rem;
        color: #1e293b;
      }

      .version {
        background: #f1f5f9;
        padding: 0.1rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: monospace;
        color: #64748b;
      }

      .card-body p {
        margin: 0;
        color: #64748b;
        line-height: 1.5;
        font-size: 0.95rem;
      }

      .empty-state {
        text-align: center;
        color: #94a3b8;
        padding: 2rem;
      }

      @media (max-width: 768px) {
        .timeline-line {
          left: 30px;
        }

        .timeline-item {
          width: 100%;
          padding-left: 70px;
          padding-right: 0;
          text-align: left;
        }

        .timeline-item.left, .timeline-item.right {
          left: 0;
          text-align: left;
          padding-right: 0;
          padding-left: 70px;
        }

        .timeline-item.left .dot, .timeline-item.right .dot {
          left: 20px;
          right: auto;
        }
        
        .timeline-item.left .card-header {
            flex-direction: row;
        }
        
        /* Hide connectors in mobile if they look messy, or adjust them */
        .timeline-item::after {
            width: 40px; /* Adjust width for mobile padding */
            left: 30px; /* Start from line */
            right: auto;
        }
      }

      /* Dark Mode Overrides */
      :host-context(body.dark-mode) .timeline-container {
        background: #0f172a;
      }

      :host-context(body.dark-mode) h2 {
        background: #1e293b;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .toggle-btn {
        background: #1e293b;
        border-color: #334155;
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .toggle-btn:hover {
        background: #334155;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .timeline-line {
        background: linear-gradient(to bottom, #334155 0%, #475569 50%, #334155 100%);
      }

      :host-context(body.dark-mode) .timeline-wrapper.horizontal .timeline-line {
        background: linear-gradient(to right, #334155 0%, #475569 50%, #334155 100%);
      }

      :host-context(body.dark-mode) .date-badge {
        background: #334155;
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .card {
        background: #1e293b;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
      }

      :host-context(body.dark-mode) .title {
        color: #f8fafc;
      }

      :host-context(body.dark-mode) .version {
        background: #334155;
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .card-body p {
        color: #cbd5e1;
      }

      :host-context(body.dark-mode) .card-header {
        border-bottom-color: #334155;
      }

      :host-context(body.dark-mode) .timeline-item::after {
        background: #334155;
      }

      :host-context(body.dark-mode) .timeline-wrapper.horizontal .timeline-item::before {
        background: #334155;
      }

      :host-context(body.dark-mode) .dot {
        background: #1e293b;
        border-color: #60a5fa;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
      }

      :host-context(body.dark-mode) .timeline-item:hover .dot {
        background: #60a5fa;
        box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.3);
      }

      :host-context(body.dark-mode) .timeline-wrapper.horizontal::-webkit-scrollbar-track {
        background: #1e293b;
      }

      :host-context(body.dark-mode) .timeline-wrapper.horizontal::-webkit-scrollbar-thumb {
        background-color: #475569;
        border-color: #1e293b;
      }

      :host-context(body.dark-mode) .timeline-wrapper.horizontal::-webkit-scrollbar-thumb:hover {
        background-color: #64748b;
      }

    `,
  ],
})
export class TimelineViewComponent implements OnInit {
  events: Event[] = [];
  groupedEvents: TimelineGroup[] = [];
  isHorizontal = false;

  constructor(private eventService: EventService) { }

  toggleMode() {
    this.isHorizontal = !this.isHorizontal;
  }

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      // Sort events by date descending (newest first) or ascending? 
      // Usually timelines are chronological. Let's do ascending (oldest top) or descending (newest top).
      // Let's do ascending for "what's coming/recent".
      this.events = [...events].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
      this.groupEvents();
    });
  }

  private groupEvents(): void {
    this.groupedEvents = [];

    for (const event of this.events) {
      const eventDate = new Date(event.event_date).toDateString();
      const lastGroup = this.groupedEvents[this.groupedEvents.length - 1];

      if (lastGroup && new Date(lastGroup.date).toDateString() === eventDate) {
        lastGroup.events.push(event);
      } else {
        this.groupedEvents.push({ date: event.event_date, events: [event] });
      }
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

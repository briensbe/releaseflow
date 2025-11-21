import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-timeline-view",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="timeline-container">
      <div class="header">
        <h2><lucide-icon name="git-commit" size="22"></lucide-icon> Timeline</h2>
      </div>

      <div class="timeline">
        <div class="timeline-line"></div>

        <div
          class="timeline-item"
          *ngFor="let event of events; let i = index"
          [class.left]="i % 2 === 0"
          [class.right]="i % 2 !== 0"
        >
          <div class="content">
            <div class="date-badge">{{ formatDate(event.event_date) }}</div>
            <div class="card" [class.is-livraison]="event.event_type === 'livraison'" [class.is-mep]="event.event_type === 'mep'">
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
          <div class="dot"></div>
        </div>
        
        <div class="empty-state" *ngIf="events.length === 0">
          <p>Aucun événement à afficher</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .timeline-container {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
        background: #f8fafc;
      }

      .header {
        margin-bottom: 2rem;
        text-align: center;
      }
      
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
      }
    `,
  ],
})
export class TimelineViewComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      // Sort events by date descending (newest first) or ascending? 
      // Usually timelines are chronological. Let's do ascending (oldest top) or descending (newest top).
      // Let's do ascending for "what's coming/recent".
      this.events = [...events].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    });
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

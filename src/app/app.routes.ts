import { Routes } from '@angular/router';
import { EventListComponent } from '../components/event-list.component';
import { CalendarViewComponent } from '../components/calendar-view.component';
import { CompactViewComponent } from '../components/compact-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'list', component: EventListComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'compact', component: CompactViewComponent }
];

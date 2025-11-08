import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    const { data, error } = await this.supabase.getClient()
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error loading events:', error);
      return;
    }

    this.eventsSubject.next(data || []);
  }

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    const { data, error } = await this.supabase.getClient()
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return null;
    }

    await this.loadEvents();
    return data;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<boolean> {
    const { error } = await this.supabase.getClient()
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      return false;
    }

    await this.loadEvents();
    return true;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const { error } = await this.supabase.getClient()
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }

    await this.loadEvents();
    return true;
  }

  getEventsByDateRange(startDate: Date, endDate: Date): Event[] {
    const events = this.eventsSubject.value;
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  getEventsByDate(date: string): Event[] {
    return this.eventsSubject.value.filter(event => event.event_date === date);
  }
}

export interface Event {
  id?: string;
  title: string;
  event_type: 'livraison' | 'mep';
  event_date: string;
  description: string;
  version: string;
  created_at?: string;
  updated_at?: string;
}

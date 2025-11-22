// ========================================
// 2. COMPOSANT: kanban-board.component.ts
// ========================================
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TutorialService } from '../../../services/tutorial.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'done';
  assignee: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements AfterViewInit {
  tutorialCompleted = false;
  searchQuery = '';

  tickets: Ticket[] = [
    {
      id: 1,
      title: 'Responsive sur Releaseflow',
      description: 'Adapter l\'interface mobile',
      status: 'backlog',
      assignee: 'Benoît Briens'
    },
    {
      id: 2,
      title: 'Fix bug d\'authentification',
      description: 'Corriger le problème de session',
      status: 'in-progress',
      assignee: 'Marie Dupont'
    },
    {
      id: 3,
      title: 'Ajouter tests unitaires',
      description: 'Couverture à 80%',
      status: 'done',
      assignee: 'Jean Martin'
    }
  ];

  constructor(private tutorialService: TutorialService) { }

  ngAfterViewInit() {
    this.tutorialCompleted = localStorage.getItem('kanban-tutorial-completed') === 'true';

    if (!this.tutorialCompleted) {
      setTimeout(() => {
        this.startTutorial();
      }, 1000);
    }
  }

  startTutorial() {
    this.tutorialService.startTutorial();
  }

  resetTutorial() {
    localStorage.removeItem('kanban-tutorial-completed');
    this.tutorialCompleted = false;
    this.startTutorial();
  }

  getTicketsByStatus(status: string) {
    return this.tickets.filter(t => t.status === status);
  }

  createTicket() {
    const newTicket: Ticket = {
      id: Date.now(),
      title: 'Nouveau ticket',
      description: 'Description',
      status: 'backlog',
      assignee: 'Non assigné'
    };
    this.tickets.push(newTicket);
    console.log('Ticket créé:', newTicket);
  }

  onSearch() {
    console.log('Recherche:', this.searchQuery);
  }

  editTicket(ticket: Ticket) {
    console.log('Édition du ticket:', ticket);
  }
}
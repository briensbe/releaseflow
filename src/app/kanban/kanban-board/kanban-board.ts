import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TutorialService } from '../../../services/tutorial.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css'],
  template: `
    <div class="kanban-container">
      <!-- Bouton pour lancer le tutorial manuellement -->
      <button 
        class="help-button" 
        (click)="startTutorial()"
        *ngIf="!tutorialCompleted">
        <i class="icon-help"></i> Aide
      </button>

      <!-- Zone de recherche -->
      <div class="search-bar">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Rechercher un ticket..." />
      </div>

      <!-- Bouton créer ticket -->
      <button class="create-ticket-btn">
        + Nouveau ticket
      </button>

      <!-- Tableau Kanban -->
      <div class="kanban-board">
        <!-- Vos colonnes Kanban ici -->
        <div class="kanban-column">
          <h3>BACKLOG</h3>
          <!-- Cartes -->
        </div>
        <div class="kanban-column">
          <h3>EN COURS</h3>
          <!-- Cartes -->
        </div>
        <div class="kanban-column">
          <h3>TERMINÉ</h3>
          <!-- Cartes -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-container {
      padding: 20px;
    }

    .help-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      transition: transform 0.2s;
    }

    .help-button:hover {
      transform: scale(1.1);
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-input {
      width: 300px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .create-ticket-btn {
      padding: 10px 20px;
      background-color: #0052cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .kanban-board {
      display: flex;
      gap: 20px;
    }

    .kanban-column {
      flex: 1;
      background-color: #f4f5f7;
      padding: 16px;
      border-radius: 8px;
    }
  `]
})
export class KanbanBoardComponent implements AfterViewInit {
  tutorialCompleted = false;

  constructor(private tutorialService: TutorialService) { }

  ngAfterViewInit() {
    // Vérifier si le tutorial a déjà été vu
    this.tutorialCompleted = localStorage.getItem('tutorial-completed') === 'true';

    // Lancer automatiquement au premier chargement
    if (!this.tutorialCompleted) {
      // Attendre un peu pour que le DOM soit bien chargé
      setTimeout(() => {
        this.startTutorial();
      }, 500);
    }
  }

  startTutorial() {
    this.tutorialService.startTutorial();
  }
}
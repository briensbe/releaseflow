// ========================================
// 1. SERVICE: tutorial.service.ts
// ========================================
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';

@Injectable({
    providedIn: 'root'
})
export class TutorialService {
    private tour: InstanceType<typeof Shepherd.Tour> | null = null;

    startTutorial() {
        this.tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                classes: 'shepherd-theme-custom',
                scrollTo: { behavior: 'smooth', block: 'center' },
                cancelIcon: {
                    enabled: true
                }
            }
        });

        // Étape 1 : Bouton créer
        this.tour.addStep({
            id: 'step-1',
            title: '➕ Créer un ticket',
            text: 'Cliquez ici pour créer un nouveau ticket dans votre tableau.<div class="shepherd-progress">Étape 1 sur 4</div>',
            attachTo: {
                element: '.create-ticket-btn',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Suivant',
                    action: this.tour.next,
                    classes: 'shepherd-button-primary'
                }
            ]
        });

        // Étape 2 : Recherche
        this.tour.addStep({
            id: 'step-2',
            title: '🔍 Recherche rapide',
            text: 'Utilisez la recherche pour filtrer vos tickets rapidement.<div class="shepherd-progress">Étape 2 sur 4</div>',
            attachTo: {
                element: '.search-input',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Précédent',
                    action: this.tour.back,
                    classes: 'shepherd-button-secondary'
                },
                {
                    text: 'Suivant',
                    action: this.tour.next,
                    classes: 'shepherd-button-primary'
                }
            ]
        });

        // Étape 3 : Tableau Kanban
        this.tour.addStep({
            id: 'step-3',
            title: '📋 Tableau Kanban',
            text: 'Glissez-déposez vos tickets entre les colonnes pour changer leur statut.<div class="shepherd-progress">Étape 3 sur 4</div>',
            attachTo: {
                element: '.kanban-board',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Précédent',
                    action: this.tour.back,
                    classes: 'shepherd-button-secondary'
                },
                {
                    text: 'Suivant',
                    action: this.tour.next,
                    classes: 'shepherd-button-primary'
                }
            ]
        });

        // Étape 4 : Carte ticket
        this.tour.addStep({
            id: 'step-4',
            title: '🎫 Édition rapide',
            text: 'Cliquez sur un ticket pour éditer ses détails directement.<div class="shepherd-progress">Étape 4 sur 4</div>',
            attachTo: {
                element: '.ticket-card',
                on: 'right'
            },
            buttons: [
                {
                    text: 'Précédent',
                    action: this.tour.back,
                    classes: 'shepherd-button-secondary'
                },
                {
                    text: 'Terminer',
                    action: this.tour.complete,
                    classes: 'shepherd-button-primary'
                }
            ]
        });

        this.tour.on('complete', () => {
            console.log('✅ Tutorial terminé');
            localStorage.setItem('kanban-tutorial-completed', 'true');
        });

        this.tour.on('cancel', () => {
            console.log('❌ Tutorial annulé');
        });

        this.tour.start();
    }

    stopTutorial() {
        if (this.tour) {
            this.tour.cancel();
        }
    }
}

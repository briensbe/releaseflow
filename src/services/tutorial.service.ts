import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

@Injectable({
    providedIn: 'root'
})
export class TutorialService {
    private tour: InstanceType<typeof Shepherd.Tour> | null = null;

    startTutorial() {
        this.tour = new Shepherd.Tour({
            useModalOverlay: true, // Grise le fond
            defaultStepOptions: {
                classes: 'shepherd-theme-custom',
                scrollTo: true,
                cancelIcon: {
                    enabled: true
                }
            }
        });

        // Étape 1 : Focus sur un bouton
        this.tour.addStep({
            id: 'step-1',
            text: 'Cliquez ici pour créer un nouveau ticket',
            attachTo: {
                element: '.create-ticket-btn', // Sélecteur CSS de votre élément
                on: 'bottom' // Position du tooltip (top, bottom, left, right)
            },
            buttons: [
                {
                    text: 'Suivant',
                    action: this.tour.next,
                    classes: 'shepherd-button-primary'
                }
            ],
            highlightClass: 'highlight' // Classe CSS pour le focus
        });

        // Étape 2 : Focus sur le tableau Kanban
        this.tour.addStep({
            id: 'step-2',
            text: 'Vous pouvez maintenant éditer les détails directement dans le tableau. Sélectionnez les champs à modifier.',
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

        // Étape 3 : Focus sur la recherche
        this.tour.addStep({
            id: 'step-3',
            text: 'Utilisez la recherche pour filtrer vos tickets rapidement',
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
                    text: 'Terminer',
                    action: this.tour.complete,
                    classes: 'shepherd-button-primary'
                }
            ]
        });

        // Événements
        this.tour.on('complete', () => {
            console.log('Tutorial terminé');
            // Sauvegarder que l'utilisateur a vu le tutorial
            localStorage.setItem('tutorial-completed', 'true');
        });

        this.tour.on('cancel', () => {
            console.log('Tutorial annulé');
        });

        this.tour.start();
    }

    stopTutorial() {
        if (this.tour) {
            this.tour.cancel();
        }
    }
}
import { Injectable } from "@angular/core";
// import Shepherd from "shepherd.js";
import { ShepherdService } from "angular-shepherd";

import { offset } from "@floating-ui/dom";

@Injectable({
  providedIn: "root",
})
export class ProfileTutorialService {
  //   private tour: InstanceType<typeof Shepherd.Tour> | null = null;

  constructor(private tour: ShepherdService) { }

  startTutorial() {
    this.tour.start();
  }

  init() {
    // this.tour = new Shepherd.Tour({
    //     useModalOverlay: true,
    //     defaultStepOptions: {
    //         classes: "btn-theme", // thème qui sera appliqués aux boutons next de shepherd
    //         scrollTo: { behavior: "smooth", block: "center" }, // comportement d'affichage des aides
    //         cancelIcon: {
    //             enabled: true,
    //         },
    //     },
    // });

    this.tour.modal = true; // estc-e l'équivalent de useModalOverlay ?

    this.tour.defaultStepOptions = {
      classes: "btn-theme", // thème qui sera appliqués aux boutons next de shepherd
      scrollTo: { behavior: "smooth", block: "center" }, // comportement d'affichage des aides
      cancelIcon: {
        enabled: true,
      },
      arrow: true,
    };

    this.tour.addSteps([
      {
        id: "profile-step-1",
        title: "Actions",
        text: 'Ici tu peux modifier ton profil <div class="shepherd-progress">Étape 1 sur 2</div>',
        attachTo: {
          element: '[data-tour="profile"]', // élément sur lequel on veut pointer.
          on: "left", // ou autre position
        },
        floatingUIOptions: {
          middleware: [offset({ mainAxis: 10, crossAxis: 0 })]
        },
        buttons: [{ text: "Suivant", action: () => this.tour.next() }],
      },
      {
        id: "profile-step-2",
        title: "Dark Mode",
        text: 'Cliquez ici pour activer le thème Sombre ou rebasculer au thème Clair <div class="shepherd-progress">Étape 2 sur 2</div>',
        attachTo: {
          element: '[data-tour="darkmode-1"]', // élément sur lequel on veut pointer.
          on: "bottom", // ou autre position
        },
        floatingUIOptions: {
          middleware: [offset({ mainAxis: -10, crossAxis: 0 })]
        },
        buttons: [
          { text: "Précédent", action: () => this.tour.back() }, { text: "Terminer", action: () => this.tour.complete() }],
      },

    ]);

    // // première étape
    // this.tour.addStep({
    //     id: "step-1",
    //     title: "Dark Mode",
    //     text: 'Cliquez ici pour activer le thème Sombre ou rebasculer au thème Clair <div class="shepherd-progress">Étape 1 sur 4</div>',
    //     attachTo: {
    //         element: '[data-tour="profile-link"]', // élément sur lequel on veut pointer.
    //         on: "bottom", // ou autre position
    //     },
    //     buttons: [
    //         {
    //             text: "Suivant",
    //             //   action: this.tour.next, // pour l'instant on n'a qu'une étape
    //             action: this.tour.complete,
    //             classes: "shepherd-button-primary",
    //         },
    //     ],
    // });

    // // Étape 1 : Bouton créer

    //            this.tour.addStep({
    //                id: 'step-1',
    //                title: '➕ Créer un ticket',
    //                text: 'Cliquez ici pour créer un nouveau ticket dans votre tableau.<div class="shepherd-progress">Étape 1 sur 4</div>',
    //                attachTo: {
    //                    element: '.create-ticket-btn',
    //                    on: 'bottom'
    //                },
    //                buttons: [
    //                    {
    //                        text: 'Suivant',
    //                        action: this.tour.next,
    //                        classes: 'shepherd-button-primary'
    //                    }
    //                ]
    //            });

    //            // Étape 2 : Recherche
    //            this.tour.addStep({
    //                id: 'step-2',
    //                title: '🔍 Recherche rapide',
    //                text: 'Utilisez la recherche pour filtrer vos tickets rapidement.<div class="shepherd-progress">Étape 2 sur 4</div>',
    //                attachTo: {
    //                    element: '.search-input',
    //                    on: 'bottom'
    //                },
    //                buttons: [
    //                    {
    //                        text: 'Précédent',
    //                        action: this.tour.back,
    //                        classes: 'shepherd-button-secondary'
    //                    },
    //                    {
    //                        text: 'Suivant',
    //                        action: this.tour.next,
    //                        classes: 'shepherd-button-primary'
    //                    }
    //                ]
    //            });

    //            // Étape 3 : Tableau Kanban
    //            this.tour.addStep({
    //                id: 'step-3',
    //                title: '📋 Tableau Kanban',
    //                text: 'Glissez-déposez vos tickets entre les colonnes pour changer leur statut.<div class="shepherd-progress">Étape 3 sur 4</div>',
    //                attachTo: {
    //                    element: '.kanban-board',
    //                    on: 'top'
    //                },
    //                buttons: [
    //                    {
    //                        text: 'Précédent',
    //                        action: this.tour.back,
    //                        classes: 'shepherd-button-secondary'
    //                    },
    //                    {
    //                        text: 'Suivant',
    //                        action: this.tour.next,
    //                        classes: 'shepherd-button-primary'
    //                    }
    //                ]
    //            });

    //            // Étape 4 : Carte ticket
    //            this.tour.addStep({
    //                id: 'step-4',
    //                title: '🎫 Édition rapide',
    //                text: 'Cliquez sur un ticket pour éditer ses détails directement.<div class="shepherd-progress">Étape 4 sur 4</div>',
    //                attachTo: {
    //                    element: '.ticket-card',
    //                    on: 'right'
    //                },
    //                buttons: [
    //                    {
    //                        text: 'Précédent',
    //                        action: this.tour.back,
    //                        classes: 'shepherd-button-secondary'
    //                    },
    //                    {
    //                        text: 'Terminer',
    //                        action: this.tour.complete,
    //                        classes: 'shepherd-button-primary'
    //                    }
    //                ]
    //            });
    //    */
    // this.tour.on("complete", () => {
    //     console.log("✅ Tutorial terminé");
    //     localStorage.setItem("profile-tutorial-completed", "true");
    // });

    // this.tour.on("cancel", () => {
    //     console.log("❌ Tutorial annulé");
    // });
  }

  stopTutorial() {
    if (this.tour) {
      this.tour.cancel();
    }
  }
}

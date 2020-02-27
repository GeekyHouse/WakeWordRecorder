import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [

    // From modal content to help
    transition('ModalMain => ModalHelp', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '100%',
        })
      ], {optional: true}),
      query(':enter', [
        style({left: '100%'})
      ]),
      group([
        query(':leave', [
          animate('500ms ease-out', style({left: '-100%'}))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({left: '0%'}))
        ])
      ]),
    ]),

    // From help to modal content
    transition('ModalHelp => ModalMain', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '100%',
        })
      ], {optional: true}),
      query(':enter', [
        style({left: '-100%'})
      ]),
      group([
        query(':leave', [
          animate('500ms ease-out', style({left: '100%'}))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({left: '0%'}))
        ])
      ]),
    ]),

    // Open modal
    transition('* => Modal', [
      query(':enter .dialog', [
        style({transform: 'scale(0)'})
      ], {optional: true}),
      query(':enter .dialog', [
        animate('300ms ease-out', style({transform: 'scale(1)'}))
      ], {optional: true})
    ]),

    // Close modal
    transition('Modal => *', [
      query(':leave .dialog', [
        style({transform: 'scale(1)'})
      ], {optional: true}),
      query(':leave .dialog', [
        animate('300ms ease-out', style({transform: 'scale(0)'}))
      ], {optional: true})
    ])
  ]);

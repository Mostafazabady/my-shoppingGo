import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
   animations: [
        trigger('listAnimation', [
          transition('* => *', [
            query(':enter', [
              style({ opacity: 0, transform: 'translateX(-20px)' }),
              stagger(50, [
                animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
              ])
            ], { optional: true }),
            query(':leave', [
              animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)', height: 0 }))
            ], { optional: true })
          ])
        ]),
        trigger('fadeIn', [
          transition(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 }))
          ])
        ])
      ]
})
export class ContactUsComponent {

}

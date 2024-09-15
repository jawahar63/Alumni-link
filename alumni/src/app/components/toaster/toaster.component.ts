import { Component, inject } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ToasterService } from '../../servies/toaster.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  animations: [
    trigger('slideInOut', [
      // Enter Animation: Slide in from the right
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      // Leave Animation: Slide out to the right
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToasterComponent {
  toasterService=inject(ToasterService)

  closeToast(index: number) {
    this.toasterService.removeToast(index);
  }
}

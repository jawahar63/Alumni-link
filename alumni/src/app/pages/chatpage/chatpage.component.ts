import { Component, HostListener, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatComponent } from "../../components/chat/chat.component";
import { Router } from '@angular/router';
import { MessageService } from '../../servies/message.service';

@Component({
  selector: 'app-chatpage',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './chatpage.component.html',
  styleUrl: './chatpage.component.css'
})
export class ChatpageComponent implements OnInit {
  width!: number;
  Convo:any
  router = inject(Router);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.messageService.ConvoDetail$.subscribe({
      next: (value) => {
        this.Convo = value;
        if (this.Convo._id === '') {
          this.router.navigate(['message']);
        }
      }
    });
    this.checkWidthAndNavigate();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWidthAndNavigate();
  }
  private checkWidthAndNavigate(): void {
    this.width = window.innerWidth;
    if (this.width >= 768) {
      this.router.navigate(['message']);
    }
  }
}

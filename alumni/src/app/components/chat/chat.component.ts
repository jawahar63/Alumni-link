import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Convo, Message } from '../../models/convo.model';
import { MessageService } from '../../servies/message.service';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  authService = inject(AuthService);
  messageService = inject(MessageService);
  toasterService = inject(ToasterService);
  cdr = inject(ChangeDetectorRef);
  Convo!: Convo;
  messages: Message[] = [];
  id = '';
  message!: String;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data) => {
      this.id = data.get('user_id');
    });

    this.messageService.ConvoDetail$.subscribe({
      next: (value) => {
        this.Convo = value;
        if (this.Convo._id !== '') {
          this.messageService.getMessages(this.Convo._id, this.id).subscribe({
            next: (value) => {
              this.messages = value.data;
              this.scrollToBottom();
            },
            error: (err) => {
              this.toasterService.addToast('error', 'Error1', err.message, 5000);
            }
          });
        }
      }
    });
  }

  getDisplayDate(date: string | Date): string {
    this.scrollToBottom();
    const messageDate = new Date(date);
    const today = new Date();

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const isYesterday =
      messageDate.getDate() === today.getDate() - 1 &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString(); // Customize date format as needed
    }
  }

  getDisplaytime(date: string | Date) {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onKeydown(event: any) {
    if (event.key === 'Enter') {
      this.SendMessage();
    }
  }

  SendMessage() {
    if (this.message) {
      const send = {
        conversationId: this.Convo._id,
        sender: this.id,
        content: this.message
      };
      this.messageService.sendMessage(send).subscribe({
        next: (value) => {
          console.log(value.data);
          this.messages.push(value.data);
          this.scrollToBottom();
        },
        error: (err) => {
          this.toasterService.addToast('error', 'Error1', err.message, 5000);
        }
      });
      this.message = '';
    }
  }

  isDateChanged(index: number): boolean {
    if (index === 0) return true;
    const currentDate = new Date(this.messages[index].sentAt).toDateString();
    const previousDate = new Date(this.messages[index - 1].sentAt).toDateString();
    return currentDate !== previousDate;
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  afterEdit(message:Message){ 
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Convo, Message } from '../../models/convo.model';
import { MessageService } from '../../servies/message.service';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { FormsModule } from '@angular/forms';
import { ConvoService } from '../../servies/convo.service';

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
  convoService=inject(ConvoService);
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
      if (this.Convo._id) {
        this.messageService.joinChat(this.Convo._id);
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
    this.messageService.receiveMessage().subscribe((message: Message) => {
      if(message.sender._id!==this.id){
        this.messageService.changeIsRead(message);
      }
      this.messages.push(message);
    });
    this.messageService.messageIsSeen().subscribe((message:Message)=>{
      const messageIndex = this.messages.findIndex((data) => data._id === message._id);
      if (messageIndex !== -1) {
        this.messages[messageIndex] = message;
      }
    })
    this.messageService.messagesIsSeen().subscribe((updatedMessages: Message[]) => {
       updatedMessages.forEach(updatedMessage => {
        const index = this.messages.findIndex(message => message._id === updatedMessage._id);

        if (index !== -1) {
            this.messages[index] = updatedMessage;
        }
    });
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
      return messageDate.toLocaleDateString();
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
          this.messageService.sendMessageSocket(this.Convo._id,value);
          this.scrollToBottom();
        },
        error: (err) => {
          this.toasterService.addToast('error', 'Error1', err.error.message, 5000);
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

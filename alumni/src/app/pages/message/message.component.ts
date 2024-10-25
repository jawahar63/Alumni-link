import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { SocketService } from '../../servies/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from "../../components/chat/chat.component";
import { ConvoComponent } from "../../components/convo/convo.component";
import { ConvoService } from '../../servies/convo.service';
import { AuthService } from '../../servies/auth.service';
import { ToasterService } from '../../servies/toaster.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [HeaderComponent, SideBarComponent, CommonModule, FormsModule, ChatComponent, ConvoComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit{
  id='';
  convos=[];
  socketService=inject(SocketService);
  authService=inject(AuthService);
  convoService=inject(ConvoService);
  toasterService=inject(ToasterService);

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
    })
    this.convoService.getConvo(this.id).subscribe({
      next:(value)=> {
        this.convos=value.data
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })
  }

}

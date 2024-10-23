import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { SocketService } from '../../servies/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [HeaderComponent,SideBarComponent,CommonModule,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit{
  message!: string;
  messages: any[] = [];
  socketService=inject(SocketService);


  ngOnInit(): void {
    // this.socketService.onMessage().subscribe((message) => {
    //   this.messages.push(message);
    // });
  }
  // sendMessage(){
  //   this.socketService.sendMessage(this.message);
  //   this.message='';
  // }
}

import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [HeaderComponent,SideBarComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

}

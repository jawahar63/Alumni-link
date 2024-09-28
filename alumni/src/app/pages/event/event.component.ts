import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [HeaderComponent,TableComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

}

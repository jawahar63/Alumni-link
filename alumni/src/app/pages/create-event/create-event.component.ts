import { Component } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

}

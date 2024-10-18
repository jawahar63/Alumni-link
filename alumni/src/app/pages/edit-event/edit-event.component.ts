import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [TableComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

}

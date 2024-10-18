import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerStudents } from '../../models/event.model';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.css'
})
export class SimpleTableComponent {

  @Input() title: string = '';
  @Input() data: registerStudents[] = [];
  
  filterText: string = '';
  filteredData() {
    return this.data.filter(item =>
      (item.username?.toLowerCase() || '').includes(this.filterText.toLowerCase()) ||
      (item.email?.toLowerCase() || '').includes(this.filterText.toLowerCase()) ||
      (item.rollno?.toLowerCase() || '').includes(this.filterText.toLowerCase())
    );
  }

}

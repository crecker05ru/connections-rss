import { Component, Input } from '@angular/core';
import { GroupsItem } from '../../../shared/models/groups.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss'
})
export class GroupItemComponent {
@Input() group: undefined | GroupsItem
}

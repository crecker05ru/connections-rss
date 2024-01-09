import { Component } from '@angular/core';
import { GroupSectionComponent } from '../../components/group-section/group-section.component';
import { PeopleSectionComponent } from '../../components/people-section/people-section.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [GroupSectionComponent,PeopleSectionComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}

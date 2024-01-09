import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-toast-messages',
  imports: [],
  templateUrl: './toast-messages.component.html',
  styleUrl: './toast-messages.component.scss'
})
export class ToastMessagesComponent {
  @Input() text?: string
}
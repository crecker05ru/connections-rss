import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  public isDarkTheme = false;

  ngOnInit(): void {
    const loadedtheme = localStorage.getItem('theme')
    this.isDarkTheme = loadedtheme === 'dark' ? true : false
    document.body.setAttribute(
      'data-theme',
      this.isDarkTheme ?  'dark' : 'light'
    );
  }

  onThemeSwitchChange() {
    this.isDarkTheme = !this.isDarkTheme;

    document.body.setAttribute(
      'data-theme',
      this.isDarkTheme ?  'dark' : 'light'
    );
    localStorage.setItem('theme',this.isDarkTheme ?  'dark' : 'light')
  }
}

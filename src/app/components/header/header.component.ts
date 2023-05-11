import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    ngOnInit(): void {
        // Check if the user has set a preference for light or dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set the initial theme based on the user's preference or default to light mode
        document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    }


    switchTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', targetTheme);
    }
}

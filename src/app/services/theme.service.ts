import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    // The user's preference (explicit or system)
    private themePreference = signal<Theme>('system');

    // The actual system value (true if dark)
    private systemDarkMode = signal<boolean>(false);

    // The effective dark mode state
    darkMode = computed(() => {
        const preference = this.themePreference();
        if (preference === 'system') {
            return this.systemDarkMode();
        }
        return preference === 'dark';
    });

    // Public getter for components to observe darkMode changes
    getDarkMode() {
        return this.darkMode;
    }

    constructor() {
        // 1. Initialize system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        console.log("mediaQuery =" + mediaQuery);
        this.systemDarkMode.set(mediaQuery.matches);


        // Listener for system changes
        mediaQuery.addEventListener('change', (e) => {
            this.systemDarkMode.set(e.matches);
        });

        // 2. Load saved preference
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            this.themePreference.set(savedTheme);
        }

        // 3. Apply theme side effects
        effect(() => {
            const isDark = this.darkMode();
            if (isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            // Save the preference
            localStorage.setItem('theme', this.themePreference());
        });
    }

    setTheme(theme: Theme) {
        this.themePreference.set(theme);
    }

    toggleTheme() {
        const current = this.themePreference();
        if (current === 'system') {
            // If system is dark, toggle to light. If system is light, toggle to dark.
            this.themePreference.set(this.systemDarkMode() ? 'light' : 'dark');
        } else {
            this.themePreference.set(current === 'dark' ? 'light' : 'dark');
        }
    }
}

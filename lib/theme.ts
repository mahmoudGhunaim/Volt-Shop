export const THEME_KEY = "volt-theme";

/** Runs before paint (beforeInteractive in the root layout) so the first frame already has the right theme. */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_KEY}');var t=s||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environments/environment';

if (window.location.hash === '#_=_') {
  // Check if the browser supports history.replaceState.
  if (history.replaceState) {
    // Keep the exact URL up to the hash.
    const cleanHref = window.location.href.split('#')[0];
    // Replace the URL in the address bar without messing with the back button.
    history.replaceState(null, null, cleanHref);
  } else {
    // Well, you're on an old browser, we can get rid of the _=_ but not the #.
    window.location.hash = '';
  }
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

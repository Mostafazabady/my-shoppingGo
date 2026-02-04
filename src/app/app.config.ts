import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimations(), 
    provideHttpClient(),
     importProvidersFrom(
     ToastrModule.forRoot({
  positionClass: 'toast-bottom-right',
  timeOut: 3000,
  progressBar: true,
  closeButton: true,
  newestOnTop: true,
})

    )
  ]
};

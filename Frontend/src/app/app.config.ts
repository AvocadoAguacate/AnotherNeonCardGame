import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig), AngularSvgIconModule.forRoot()),
    provideHttpClient()
  ]
};

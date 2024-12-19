import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { importProvidersFrom } from '@angular/core';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, withInterceptorsFromDi} from '@angular/common/http';

import { routes } from './app.routes';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { provideHttpClient } from '@angular/common/http';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, 'assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      SocketIoModule.forRoot(socketConfig), 
      AngularSvgIconModule.forRoot(),
      TranslateModule.forRoot({
        loader:{
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    provideHttpClient()
  ]
};

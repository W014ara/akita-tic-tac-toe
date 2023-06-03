import {ENVIRONMENT_INITIALIZER, inject, NgModule, NgZone} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {GameService} from "./services/game.service";
import {GameQuery} from "./store/game.query";
import {FieldModule} from "./field/field.module";
import {akitaDevtools, DevtoolsOptions} from '@datorama/akita';

export function provideAkitaDevtools(options: Partial<DevtoolsOptions> = {}) {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        akitaDevtools(inject(NgZone), options);
      };
    },
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FieldModule
  ],
  providers: [GameService, GameQuery, provideAkitaDevtools()],
  bootstrap: [AppComponent]
})
export class AppModule {
}

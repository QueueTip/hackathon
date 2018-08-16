import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {HttpModule} from "@angular/http";
import {DetailsPage} from "../pages/details/details";
import {DateConvertPipe} from "../components/date-convert.pipe";
import {MapPage} from "../pages/map/map";
import {IntroPage} from "../pages/intro/intro";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
      IntroPage,
      DetailsPage,
      MapPage,
      DateConvertPipe
  ],
  imports: [
      HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      IntroPage,
      DetailsPage,
      MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

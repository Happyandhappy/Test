import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SigninSuccessPage} from '../pages/signin-success/signin-success';
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {ForgotPage} from '../pages/forgot/forgot';
import {SuccessPage} from '../pages/success/success';
import {LikelistPage} from '../pages/likelist/likelist';
import { HTTP } from '@ionic-native/http';
import {PeopleproviderProvider} from '../providers/peopleprovider/peopleprovider';
import {Sqlite} from '../providers/sqlite/sqlite';
import {HttpModule} from '@angular/http';
import { EmailComposer } from '@ionic-native/email-composer';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {SQLite} from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninSuccessPage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    SuccessPage,
    LikelistPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninSuccessPage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    SuccessPage,
    LikelistPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PeopleproviderProvider,
    EmailComposer,
    ScreenOrientation,
    Sqlite,
    Toast,
  ]
})
export class AppModule {}

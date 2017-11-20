import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninSuccessPage } from './signin-success';

@NgModule({
  declarations: [
    SigninSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninSuccessPage),
  ],
})
export class SigninSuccessPageModule {}

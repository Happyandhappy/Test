import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikelistPage } from './likelist';

@NgModule({
  declarations: [
    LikelistPage,
  ],
  imports: [
    IonicPageModule.forChild(LikelistPage),
  ],
})
export class ForgotPageModule {}

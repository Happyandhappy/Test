import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SigninSuccessPage } from '../signin-success/signin-success';
import $ from 'jquery';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Storage } from '@ionic/storage';
import {SuccessPage} from '../success/success';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public screenOrientation: ScreenOrientation, public storage:Storage) {
  }
  
  slides = [
    {
      image: "assets/img/home1.png",
      
    },
    {
       image: "assets/img/home2.png",
    },
  ];

  ionViewDidLoad() {
    //console.log(this.screenOrientation.type);
    this.storage.get('token').then((value) => {
      if (value!=null && value!='') this.navCtrl.setRoot(SuccessPage);
    },(err)=>{
     console.log(err);
    });

  }

  goto_login()
  {
    this.navCtrl.setRoot(LoginPage);
  }

  goto_reg()
  {
    this.navCtrl.setRoot(RegisterPage);
  }

}

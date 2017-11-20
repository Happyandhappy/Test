import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuccessPage } from '../success/success';

/**
 * Generated class for the SigninSuccessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin-success',
  templateUrl: 'signin-success.html',
})
export class SigninSuccessPage {

  public username:any;

  public userData = {"userid":"", "user_fname":"", "user_lname":"", "detail":""};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log(this.navParams);
    console.log('ionViewDidLoad SigninSuccessPage');
    this.username = this.navParams.data.navParams.firstname;
    this.userData.userid = this.navParams.data.navParams.userid;
    this.userData.user_fname = this.navParams.data.navParams.firstname;
    this.userData.user_lname = this.navParams.data.navParams.lastname;
    this.userData.detail = "signup";
  }

  goto_begin()
  {
      this.navCtrl.setRoot(SuccessPage, {navParams:this.userData});
  }
}
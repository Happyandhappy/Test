import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { PeopleproviderProvider } from '../../providers/peopleprovider/peopleprovider';

/**
 * Generated class for the ForgotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  public warn_email: boolean;

  public warn_confirm: boolean;
  public warn_password: boolean;
  public check_pass: boolean;

  public confirm_part: boolean;
  public create_pass: boolean;
  public forgot_part: boolean;
  public send_data: any[];
  public confirm:boolean;

  userData = { "new_password": "", "confirm_code": "", "email": "", "status": "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, 
    public peopleprovid: PeopleproviderProvider
    , public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
    this.warn_confirm = false;
    this.warn_password = false;
    this.warn_email = false;
    this.check_pass = false;
    this.confirm = false;

    this.confirm_part = false;
    this.create_pass = false;
    this.forgot_part = true;
    this.send_data = new Array();
  }

  set_email() {
    this.warn_email = true;
    this.warn_confirm = false;
    this.warn_password = false;
  }

  goto_continue() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.send_data = new Array();
    let status = "login_email";
    this.userData.status = status;
    this.send_data.push(this.userData);
    this.peopleprovid.postData(this.send_data).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        console.log(result);

        this.forgot_part = false;
        this.confirm_part = true;
        this.create_pass = false;
      } else {
        let toast = this.toastCtrl.create({
          message: Object(result).detail,
          duration: 2000
        })
        toast.present();
      };

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
      loading.dismiss();
    });
  }

  goto_confirm() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.send_data = new Array();
    let status = "login_confirm";
    this.userData.status = status;
    this.send_data.push(this.userData);
    this.peopleprovid.postData(this.send_data).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        console.log(result);
        this.forgot_part = false;
        this.confirm_part = false;
        this.create_pass = true;
      } else {
        let toast = this.toastCtrl.create({
          message: Object(result).detail,
          duration: 2000
        })
        toast.present();
      };

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
      loading.dismiss();
    });
  }

  goback() {
    this.navCtrl.pop();
  }


  passChange() {
    if (this.userData.new_password.length > 6) {
      this.check_pass = true;
    }
    else {
      this.check_pass = false;
    }
  }

  set_pass() {
    this.warn_password = true;
    this.warn_email = false;
    this.warn_confirm = false;
  }

  goto_login() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.send_data = new Array();
    let status = "create_pass";
    this.userData.status = status;
    this.send_data.push(this.userData);
    this.peopleprovid.postData(this.send_data).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        console.log(result);
        this.navCtrl.push(LoginPage);
      } else {
        let toast = this.toastCtrl.create({
          message: Object(result).detail,
          duration: 2000
        })
        toast.present();
      };

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
      loading.dismiss();
    });
  }

  set_confirm()
  {
    this.confirm = true;
  }

}

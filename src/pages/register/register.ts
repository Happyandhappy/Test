import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import $ from 'jquery';
import { SigninSuccessPage } from '../signin-success/signin-success';
import { PeopleproviderProvider } from '../../providers/peopleprovider/peopleprovider';
import { LoginPage } from '../login/login';
import {HomePage} from '../home/home';
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {



  userData = { "firstname": "", "lastname": "", "email": "", "password": "", "status": "", "userid": "", "userphone": "", "confirm_code": "","token":""};
  public pass_val: any;
  public check_first: boolean;
  public check_last: boolean;
  public check_email: boolean;
  public check_pass: boolean;
  public check_phone: boolean;
  public text_mode: any;
  public pass_content: any;


  public warn_first: boolean;
  public warn_last: boolean;
  public warn_email: boolean;
  public warn_phone: boolean;
  public warn_password: boolean;

  public sign_state: boolean;
  public confirm: boolean;

  public send_data: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public peopleprovid: PeopleproviderProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.pass_val = "SHOW";
    this.check_first = false;
    this.check_last = false;
    this.check_email = false;
    this.check_phone = false;
    $('#hide_pass').show();
    this.text_mode = "password";
    this.check_pass = false;
    this.send_data = new Array();

    this.warn_email = false;
    this.warn_first = false;
    this.warn_last = false;
    this.warn_password = false;
    this.warn_phone = false;

    this.sign_state = true;
    this.confirm = false;
  }


  set_password() {
    if (this.pass_val == "SHOW") {
      $('#hide_pass').show();
      this.text_mode = "text";
      this.pass_val = "HIDE";
    }
    else {
      $('#hide_pass').show();
      this.text_mode = "password";
      this.pass_val = "SHOW";
    }
  }

  passChange() {
    if (this.userData.password.length > 6) {
      this.check_pass = true;
    }
    else {
      this.check_pass = false;
    }
  }


  fnameChange() {
    var regex = new RegExp("^[a-zA-Z]+$");
    if (!regex.test(this.userData.firstname)) {
      this.check_first = false;
    }
    else {
      this.check_first = true;
    }
  }

  lnameChange() {
    var regex = new RegExp("^[a-zA-Z]+$");
    if (!regex.test(this.userData.lastname)) {
      this.check_last = false;
    }
    else {
      this.check_last = true;
    }
  }

  emailChange() {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if (!pattern.test(this.userData.email)) {
      this.check_email = false;
    }
    else {
      this.check_email = true;
    }
  }

  phoneChange() {
    var regex = new RegExp("^[0-9]+$");
    if (!regex.test(this.userData.userphone)) {
      this.check_phone = false;
    }
    else {
      this.check_phone = true;
    }
  }
  
  goto_success() {
    if (!this.check_email && !this.check_first && !this.check_last && !this.check_pass) {
      let toast = this.toastCtrl.create({
        message: "please input correct data",
        duration: 2000
      })
      toast.present();
    }
    else {
      this.userData.token=this.userData.email;

      console.log(this.userData);
      let loading = this.loadingCtrl.create({
        content: "Please Wait..."
      });
      loading.present();
      let status = "register";
      this.userData.status = status;
      this.send_data.push(this.userData);
      this.peopleprovid.postData(this.send_data).then((result) => {
        loading.dismiss();
        if (Object(result).status == "success") {
          
          this.sign_state = false;

        } else {
          let toast = this.toastCtrl.create({
            message: "Invalid Username or Password",
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
  }

  back_page() {
    this.navCtrl.pop();
  }

  set_first() {
    this.warn_email = false;
    this.warn_first = true;
    this.warn_last = false;
    this.warn_password = false;
    this.warn_phone = false;
  }

  set_last() {
    this.warn_email = false;
    this.warn_first = false;
    this.warn_last = true;
    this.warn_password = false;
    this.warn_phone = false;
  }

  set_pass() {
    this.warn_email = false;
    this.warn_first = false;
    this.warn_last = false;
    this.warn_password = true;
    this.warn_phone = false;
  }

  set_phone() {
    this.warn_email = false;
    this.warn_first = false;
    this.warn_last = false;
    this.warn_password = false;
    this.warn_phone = true;
  }

  set_email() {
    this.warn_email = true;
    this.warn_first = false;
    this.warn_last = false;
    this.warn_password = false;
    this.warn_phone = false;
  }

  goback_sign() {
    this.sign_state = !this.sign_state;
  }

  set_confirm() {
    this.confirm = true;
  }

  goto_login() {
    let status = "sign_confirm";
    this.userData.status = status;
    this.send_data.push(this.userData);
    this.peopleprovid.postData(this.send_data).then((result) => {
      if (Object(result).status == "success") {
        console.log(result);
        this.navCtrl.push(LoginPage, { navParams: this.userData });
      } else {
        let toast = this.toastCtrl.create({
          message: "Invalid Confirm Code",
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
    });
  }

  goto_resendcode() {
    console.log(this.userData);
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    let status = "resend_code";
    this.userData.status = status;
    this.send_data.push(this.userData);
    this.peopleprovid.postData(this.send_data).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        
      } else {
        let toast = this.toastCtrl.create({
          message: "Invalid Username or Password",
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

   goto_login1() {
        this.navCtrl.setRoot(LoginPage);
  }
}

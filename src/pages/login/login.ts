import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';
import { PeopleproviderProvider } from '../../providers/peopleprovider/peopleprovider';
import { SuccessPage } from '../success/success';
import { ForgotPage } from '../forgot/forgot';
import { RegisterPage } from '../register/register';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  userData = {"userid":"", "firstname":"", "lastname":"", "email":"", "password":"","status":"", "detail":""};
  public pass_val : any;
  public check_email : boolean;
  public check_pass : boolean;
  public text_mode: any;
  public send_data:any[];

  public warn_email: boolean;
  public warn_password: boolean;
  
  public token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController, 
    public peopleprovid: PeopleproviderProvider, public toastCtrl: ToastController ,public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.pass_val="SHOW";
    this.check_email = false;
    this.text_mode = "password";
    this.check_pass = false;
    this.userData.detail = "signin";
    this.send_data = new Array();
  }

  //check email format
  emailChange()
  {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if(!pattern.test(this.userData.email))
    {
      this.check_email = false;
    }​
    else
      {
        this.check_email = true;
      }
  }
  // check password format
  passChange()
  {
    if(this.userData.password.length > 8)
    {
      this.check_pass = true;
    }
    else{
      this.check_pass = false;
    }
  }

  // login
  login() {
      console.log(this.userData);
      let loading = this.loadingCtrl.create({
        content:"Please Wait..."
      });
      loading.present();
      let status = "login";
      this.userData.status  = status;
      this.send_data.push(this.userData);
      this.peopleprovid.postData(this.send_data).then((result)=>{
        console.log(result);
        loading.dismiss();
        if (Object(result).status=="success"){
          // console.log(result);
          this.userData.userid = Object(result).userid;
          // this.userData.lastname = Object(result).lastname;
          this.userData.firstname = Object(result).firstname;
          this.userData.status = "initial";
          console.log(Object(result).email);
          this.navCtrl.setRoot(SuccessPage,{navParams:this.userData});
          this.storage.set('token',this.userData.email);
        } else {
          let toast = this.toastCtrl.create({
            message:Object(result).detail,
            duration:2000
          })
          toast.present();
        };    
        
      }, (err) =>{
        let toast = this.toastCtrl.create({
          message:"No Network",
          duration:2000
        })
        toast.present();
        loading.dismiss();
      });   
  }

  back_page()
  {
    this.navCtrl.pop();
  }

  set_email() {
    this.warn_email = true;
    this.warn_password = false;
  }

  set_pass() {
    this.warn_email = false;
    this.warn_password = true;
  }

  set_password()
  {
    if(this.pass_val == "SHOW")
    {
        this.text_mode = "text";
        this.pass_val = "HIDE";
    }else{
         this.text_mode = "password";
        this.pass_val = "SHOW";
    }
  }

  click_forgot()
  {
    this.navCtrl.push(ForgotPage);
  }

  goto_signup()
  {
    this.navCtrl.push(RegisterPage);
  }

}

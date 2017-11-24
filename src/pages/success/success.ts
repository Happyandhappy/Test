import 'rxjs/add/operator/map';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PeopleproviderProvider } from '../../providers/peopleprovider/peopleprovider';
import { HomePage } from '../home/home';
import { LikelistPage } from '../likelist/likelist';
import { Sqlite } from '../../providers/sqlite/sqlite';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
/**
 * Generated class for the ForgotPage page.
 * Add SQLite
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  imgUrl: any[];
  public send_data: any[];
  public todos: any = [];
  data: any
  isConnected: boolean;
  public email: any;
  userData = { "email": "", "status": "", "goodid": null };


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    protected platform: Platform,
    private sqliteService: Sqlite,
    public toastCtrl: ToastController,
    public peopleprovid: PeopleproviderProvider,
    private network: Network) {

    this.send_data = new Array();
    this.isConnected = true;
    // this.network.onDisconnect().subscribe(() => {
    //   let toast = this.toastCtrl.create({ message: "Network Disonnected", duration: 2000 });
    //   toast.present();
    //   this.isConnected = false;
    // });

    // this.network.onConnect().subscribe(() => {
    //   this.isConnected = true;
    //   let toast = this.toastCtrl.create({ message: "Network Connected", duration: 2000 });
    //   toast.present();
    // });

    this.platform.ready().then(() => {
      this.sqliteService.getRows().then(s => {
        this.todos = this.sqliteService.arr;
      });
    });
  }

  //Logout
  logout() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.storage.set('token', ''); //delete token
    this.navCtrl.setRoot(HomePage); //redirect homepage
    loading.dismiss();
  }

  ionViewDidLoad() {
    // let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   console.log('network was disconnected :-(');
    //   let toast = this.toastCtrl.create({ message: "Network Disonnected", duration: 2000 });
    //   toast.present();
    // });
    // disconnectSubscription.unsubscribe();

    // let connectSubscription = this.network.onConnect().subscribe(() => {
    //   let toast = this.toastCtrl.create({ message: "Network Disonnected", duration: 2000 });
    //   toast.present();
    // });
    // connectSubscription.unsubscribe();

    this.storage.get('token').then((value) => {
       this.userData.email = value; 
       //Receive data from server
       this.getGoodData();
       this.checkConnection();
    },
    (err) => { console.log(err); });
  }

  checkConnection(){
     this.userData.status = "checkconnect";
    //  this.send_data.push(this.userData);
     this.peopleprovid.postData(new Array(this.userData)).then((result)=>{
        console.log("Successfully connected to server");
        if (!this.isConnected) {
          this.sendpreparedData(this.todos.length);
          console.log("Connected Server");

          let toast = this.toastCtrl.create({ message: "Connected Server", duration: 2000 });
          toast.present();

          this.isConnected = true;
        }      
         setTimeout(() => { this.checkConnection(); }, 10000);
     },(err)=>{
        console.log("Disconnected Server");
        if (this.isConnected){
            this.isConnected = false;

            let toast = this.toastCtrl.create({ message: "Disconnected Server", duration: 2000 });
            toast.present();
        }
        setTimeout(() => { this.checkConnection(); }, 10000);
     }); 
  }

  getGoodData() {
    this.email = this.userData.email;
    this.userData.status = "getgoods";
    this.send_data.push(this.userData);

    this.peopleprovid.getImageData(this.send_data).then((result) => {
      this.imgUrl = Object(result).goodsdata;
      console.log("Successfully get goods Data from server");
      // if (!this.isConnected) {
      //   this.sendpreparedData(this.todos.length);
      //   console.log("Connected Server");
      //   this.isConnected = true;
      // }
      // setTimeout(() => { this.getGoodData(); }, 10000);
    }, (err) => {
      let toast = this.toastCtrl.create({ message: "No Network", duration: 2000 });
      toast.present();
      // if (this.isConnected) console.log("Disconnected Server");
      // this.isConnected = false;
      // setTimeout(() => { this.getGoodData(); }, 10000);
    });
  }

  likelist() {
    this.navCtrl.push(LikelistPage);
  }

  //When clicked Like button, store image and description to sqlite and send to server if connected
  add(i, element) {
    //Store liked image and description
    this
      .sqliteService
      .addItem(i, this.imgUrl[i].img_url, this.imgUrl[i].description)
      .then(s => {
        this.todos = this.sqliteService.arr;
      });
    //send liked data to server
    this.sendDatatoServer(i)
  }

  //send data to server
  sendDatatoServer(goodid) {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();

    if (this.send_data.length > 0) this.send_data.pop();

    this.userData.email = this.email;
    this.userData.status = "addlikedata";
    this.userData.goodid = goodid;
    this.send_data.push(this.userData);

    this.peopleprovid.sendImageData(this.send_data).then((result) => {
      if (Object(result).status == "success") {
        loading.dismiss();
        if (Object(result).detail == "delete") {
          let toast = this.toastCtrl.create({ message: "Successfuly Deleted", duration: 2000 });
          toast.present();
        } else {
          let toast = this.toastCtrl.create({ message: "Successfuly Added", duration: 2000 });
          toast.present();
        }
      }
      else {
        loading.dismiss();
        let toast = this.toastCtrl.create({ message: "Server Error", duration: 2000 });
        toast.present();
      }
    }, (err) => {
      let toast = this.toastCtrl.create({ message: "No Network", duration: 2000 });
      toast.present();
      loading.dismiss();
    });
  }

  //When the network is online, send all data from sqlite
  sendpreparedData(count) {
    if (count > 0) {
      setTimeout(() => {
        this.sendDatatoServer(this.todos[count - 1].imgid);
        count--;
        this.sendpreparedData(count);
      }, 1500);
    }
  }

  //Deleting function
  delete(image) {
    this
      .sqliteService
      .del(image)
      .then(s => {
        this.todos = this.sqliteService.arr;
      });
  }

  // this.navCtrl.remove;
}

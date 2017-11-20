import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {HomePage} from '../home/home';
import { Toast } from '@ionic-native/toast';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Sqlite} from '../../providers/sqlite/sqlite';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the ForgotPage page.
 * Add SQLite
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-likelist',
  templateUrl: 'likelist.html',
})
export class LikelistPage {
 public expenses = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    private toast: Toast,
    private sqliteService:Sqlite,
      protected platform:Platform) { //For SQLite
  
        this.platform.ready().then(()=>{
        //  this.sqliteService.openDb();
         this.sqliteService.getRows().then(s=>{
           this.expenses=this.sqliteService.arr;
          //  console.log(this.expenses);
         });
       });
         
  }
ionViewDidLoad(){
}

back(){
   this.navCtrl.pop();
}

}

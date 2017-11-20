import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PeopleproviderProvider } from '../../providers/peopleprovider/peopleprovider';
import {HomePage} from '../home/home';
import { Toast } from '@ionic-native/toast';
import {LikelistPage} from '../likelist/likelist';
import {Sqlite} from '../../providers/sqlite/sqlite';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
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
  imgUrl:any=[];
  public todos:any = [];
  data:any
  isConnected : boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    private toast: Toast,
    private storage:Storage,
    protected platform : Platform,
    private sqliteService: Sqlite,
    public peopleprovid: PeopleproviderProvider,
    private network: Network) { 
      //For SQLite

      this.imgUrl=[
        "assets/img/1.jpeg",
        "assets/img/2.jpg",
        "assets/img/3.jpg",
        "assets/img/5.jpg",
        "assets/img/6.jpg",
        "assets/img/gif.gif",
      ];
      
      this.network.onDisconnect().subscribe(() => {
                  console.log('network was disconnected :-(');
                  this.isConnected=false;
      });

      this.network.onConnect().subscribe(() => {
        this.isConnected=true;
        this.sendpreparedData();
        console.log('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });

      this.platform.ready().then(() => {
        this.sqliteService.getRows().then(s=>{
              this.todos=this.sqliteService.arr;
        });
      });
  }

  //Logout
  logout(){
     let loading = this.loadingCtrl.create({
        content:"Please Wait..."
      });
      loading.present();
      this.storage.set('token',''); //delete token
      this.navCtrl.setRoot(HomePage); //redirect homepage
      loading.dismiss();
  }

likelist(){
  this.navCtrl.push(LikelistPage);
}

//When clicked Like button, store image and description to sqlite and send to server if connected
add(i, element) {
  //Store liked image and description
         this
            .sqliteService
            .addItem(this.imgUrl[i], i + " is OK.")
            .then(s => {
              this.todos = this.sqliteService.arr;
            });
  //send liked data to server
  // var myData = JSON.stringify({username: this.data.username});
        let item= JSON.stringify({image : this.imgUrl[i], description:i + " is OK."});
         this.peopleprovid.sendImageData(item)
                          .then(s=>{
                              console.log("successfully sent to server");
                          })
            if (element.textContent=="Like") element.textContent = "Unlike";
            else element.textContent = "Like";
  }
//When the network is online, send all data from sqlite
sendpreparedData(){
    if (this.todos.length > 0) {
        for (var i = 0; i < this.todos.length; i++) {
             let item= JSON.stringify({image : this.todos(i).image, description:this.todos(i).description});
             this.peopleprovid.sendImageData(item)
                             .then(s=>{
                              console.log("successfully sent to server");
                             });
         }
    }
}

  adddata(){
     this.sqliteService.addItem(this.data,"")
     .then(s=>{
       this.todos=this.sqliteService.arr;
     });
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

  //updating function
  update(id, todo) {
    var prompt = window.prompt('Update', todo);
    this
      .sqliteService
      .update(id, prompt)
      .then(s => {
        this.todos = this.sqliteService.arr;
      });
  }

}

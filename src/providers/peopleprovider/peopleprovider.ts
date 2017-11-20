import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleproviderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
let apiurl:string = "https://www.majorcompare.com/apiserver/";
// let apiurl:string = "http://localhost/major/apiserver/";

let apiurl_auth = "https://api.e50.sevencorners.com/token";
let apiurl_getimage = "https://api.e50.sevencorners.com/images";
let apiurl_senddata = "https://api.e50.sevencorners.com/savedata";
@Injectable()
export class PeopleproviderProvider {


  constructor(public http: Http) {
    console.log('Hello PeopleproviderProvider Provider');
  }

  
  postData(credentials) {
    // console.log(credentials);
    return new Promise((resolve, reject) => {       

      this.http.post(apiurl, credentials).subscribe(res => {
        // console.log(res);
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
      
    });
  }
  
  getImageData(){
    return new Promise((resolve, reject)=>{
      this.http.get(apiurl_getimage).subscribe(res=>{
        resolve(res.json());
      }, err =>{
        reject(err);
      })
    });
  }

  sendImageData(data){
    return new Promise((resolve,reject)=>{
      this.http.post(apiurl_senddata,data).subscribe(
        res=>{
          resolve(true);
        },
        err=>{
          resolve(false);
        }
      )
    });
  }
  // postData_Authontication(credentials) {
  //   // console.log(credentials);
  //   return new Promise((resolve, reject) => {  
  //     let headers:Headers = new Headers();
  //     headers.append("Accept", 'application/json');
  //     headers.append('Content-Type', 'application/json' );
  //     headers.append('Access-Control-Allow-Origin','*');
  //     headers.append('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT');
  //     headers.append('Access-Control-Allow-Headers', 'X-AMZ-META-TOKEN-ID, X-AMZ-META-TOKEN-SECRET');     

  //     this.http.post(apiurl_auth, credentials, { headers: headers }).subscribe(res => {
  //       // console.log(res);
  //       resolve(res.json());
  //     }, (err) => {
  //       reject(err);
  //     });
      
  //   });
  // }

}

# Test
### This project was built using ionic3 framework with angular5
### With the Ionic CLI:

```bash
$ sudo npm install -g ionic cordova
$ ionic serve -l
```

### Please check Test.apk
This project is for Nadim Haque.<br/>
Looking forward to work with you for long term.<br/>
Thank you


Create blank project
ionic start ionic3-sqlite blank
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic-native/sqlite
ionic cordova plugin add cordova-plugin-x-toast
npm install --save @ionic-native/toast



Now, open and edit `src/app/app.module.ts` then add this imports.

import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
Add `BarcodeScanner` and `Toast` to `@NgModule` providers, so it will look like this.

providers: [
  StatusBar,
  SplashScreen,
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  SQLite,
  Toast
]


3. Create List of Expense with Add, Edit and Delete Button
The implementation of CRUD mobile app with Ionic 3, Angular 4 and SQLite start by creating a list of expense. For that, open and edit default `src/pages/home/home.ts` then add this imports.

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddDataPage } from '../add-data/add-data';
import { EditDataPage } from '../edit-data/edit-data';


Two imports of Add and Edit data required new pages for add and edit data that will be added later. Now, inject `SQLite` on the constructor variable.

constructor(public navCtrl: NavController,
  private sqlite: SQLite) {}
Add this variable for array of expenses, total income, total expense and balance before the constructor.

expenses: any = [];
totalIncome = 0;
totalExpense = 0;
balance = 0;
Add this functions below the constructor for the complete CRUD.

ionViewDidLoad() {
  this.getData();
}

ionViewWillEnter() {
  this.getData();
}

getData() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INT)', {})
    .then(res => console.log('Executed SQL'))
    .catch(e => console.log(e));
    db.executeSql('SELECT * FROM expense ORDER BY rowid DESC', {})
    .then(res => {
      this.expenses = [];
      for(var i=0; i<res.rows.length; i++) {
        this.expenses.push({rowid:res.rows.item(i).rowid,date:res.rows.item(i).date,type:res.rows.item(i).type,description:res.rows.item(i).description,amount:res.rows.item(i).amount})
      }
    })
    .catch(e => console.log(e));
    db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', {})
    .then(res => {
      if(res.rows.length>0) {
        this.totalIncome = parseInt(res.rows.item(0).totalIncome);
        this.balance = this.totalIncome-this.totalExpense;
      }
    })
    .catch(e => console.log(e));
    db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"', {})
    .then(res => {
      if(res.rows.length>0) {
        this.totalExpense = parseInt(res.rows.item(0).totalExpense);
        this.balance = this.totalIncome-this.totalExpense;
      }
    })
  }).catch(e => console.log(e));
}

addData() {
  this.navCtrl.push(AddDataPage);
}

editData(rowid) {
  this.navCtrl.push(EditDataPage, {
    rowid:rowid
  });
}

deleteData(rowid) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM expense WHERE rowid=?', [rowid])
    .then(res => {
      console.log(res);
      this.getData();
    })
    .catch(e => console.log(e));
  }).catch(e => console.log(e));
}
Next, open and edit `src/pages/home/home.html` then replace all code with this.

<ion-header>
  <ion-navbar>
    <ion-title>
      My Expense
    </ion-title>
    <ion-buttons end>
      <button ion-button icon-only (click)="addData()">
        <ion-icon name="add-circle"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <h2>Expense List</h2>
  <ion-list>
    <ion-item-sliding *ngFor="let expense of expenses; let i=index">
      <ion-item nopadding>
        <p>
          <span>{{expense.date}}</span><br>
          Type: {{expense.type}}<br>
          {{expense.description}}
        </p>
        <h3 item-end>
          Amount: ${{expense.amount}}
        </h3>
      </ion-item>
      <ion-item-options side="right">
        <button ion-button color="primary" (click)="editData(expense.rowid)">
          <ion-icon name="paper"></ion-icon>
        </button>
        <button ion-button color="danger" (click)="deleteData(expense.rowid)">
          <ion-icon name="trash"></ion-icon>
        </button>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</ion-content>
<ion-footer>
  <ion-toolbar>
    <ion-title>Balance: ${{balance}}</ion-title>
  </ion-toolbar>
</ion-footer>
The add button is presented by plus button on the navigation bar. The Edit and Delete button shows by sliding list item to the left.


4. Create new Page of Adding New Data

ionic g page AddData

Open and edit `src/pages/add-data/add-data.ts` then replace all codes with this.

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-add-data',
  templateUrl: 'add-data.html',
})
export class AddDataPage {

  data = { date:"", type:"", description:"", amount:0 };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {}

  saveData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO expense VALUES(NULL,?,?,?,?)',[this.data.date,this.data.type,this.data.description,this.data.amount])
        .then(res => {
          console.log(res);
          this.toast.show('Data saved', '5000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

}
Next, open and edit `src/pages/add-data/add-data.html` then replace all codes with this.

<ion-header>

  <ion-navbar>
    <ion-title>My Expense</ion-title>
  </ion-navbar>

</ion-header>

<ion-content padding>
  <h2>Add Data</h2>
  <form (ngSubmit)="saveData()">
    <ion-item>
      <ion-label>Date</ion-label>
      <ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="data.date" name="date" required=""></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-label>Type</ion-label>
      <ion-select [(ngModel)]="data.type" name="type" required="">
        <ion-option value="Income">Income</ion-option>
        <ion-option value="Expense">Expense</ion-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label>Description</ion-label>
      <ion-input type="text" placeholder="Description" [(ngModel)]="data.description" name="description" required="" ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>Amount</ion-label>
      <ion-input type="number" placeholder="Amount" [(ngModel)]="data.amount" name="amount" required="" ></ion-input>
    </ion-item>
    <button ion-button type="submit" block>Save Data</button>
  </form>
</ion-content>

5. Create a Page for Edit Data
Type this command for creating a new page for edit data.

ionic g page EditData
Open and edit `src/pages/edit-data/edit-data.ts` then replace all codes with this.

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-edit-data',
  templateUrl: 'edit-data.html',
})
export class EditDataPage {

  data = { rowid:0, date:"", type:"", description:"", amount:0 };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {
      this.getCurrentData(navParams.get("rowid"));
  }

  getCurrentData(rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM expense WHERE rowid=?', [rowid])
        .then(res => {
          if(res.rows.length > 0) {
            this.data.rowid = res.rows.item(0).rowid;
            this.data.date = res.rows.item(0).date;
            this.data.type = res.rows.item(0).type;
            this.data.description = res.rows.item(0).description;
            this.data.amount = res.rows.item(0).amount;
          }
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  updateData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE expense SET date=?,type=?,description=?,amount=? WHERE rowid=?',[this.data.date,this.data.type,this.data.description,this.data.amount,this.data.rowid])
        .then(res => {
          console.log(res);
          this.toast.show('Data updated', '5000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

}
Next, open and edit `src/pages/edit-data/edit-data.html` then replace all codes with this.

<ion-header>

  <ion-navbar>
    <ion-title>My Expense</ion-title>
  </ion-navbar>

</ion-header>

<ion-content padding>
  <h2>Edit Data</h2>
  <form (ngSubmit)="updateData()">
    <ion-item>
      <ion-label>Date</ion-label>
      <ion-datetime displayFormat="MM/DD/YYYY" [(ngModel)]="data.date" name="date" required=""></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-label>Type</ion-label>
      <ion-select [(ngModel)]="data.type" name="type" required="">
        <ion-option value="Income">Income</ion-option>
        <ion-option value="Expense">Expense</ion-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label>Description</ion-label>
      <ion-input type="text" placeholder="Description" [(ngModel)]="data.description" name="description" required="" ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>Amount</ion-label>
      <ion-input type="number" placeholder="Amount" [(ngModel)]="data.amount" name="amount" required="" ></ion-input>
    </ion-item>
    <ion-input type="hidden" [(ngModel)]="data.rowid" name="rowid"></ion-input>
    <button ion-button type="submit" block>Update Data</button>
  </form>
</ion-content>

6. Run and Test The Ionic 3, Angular 4 and SQLite App on the Device
Before running the Ionic 3, Angular 4 and SQLite app on the device, remove and add the platforms first.
ionic cordova platform rm android
ionic cordova platform rm ios
ionic cordova platform add android
ionic cordova platform add ios
Now, run the app on the iOS device first by type this command.

ionic cordova run ios
If you find the error like this.

iOS Error:

** BUILD SUCCEEDED **

Error: Cannot read property 'replace' of undefined

[ERROR] An error occurred while running cordova run ios (exit code 1).
Then run this command to install iOS simulator inside iOS platform.

cd platforms/ios/cordova && npm install ios-sim
Now, run again the app after back to the current folder.

cd ../../.. && ionic cordova run ios
Now, you can test the CRUD function of the app.
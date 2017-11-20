import {Injectable} from '@angular/core';
/*
  Generated class for the Sqlite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var window : any;
@Injectable()
export class Sqlite {
  public text : string = "";
  public db = null;
  public arr = [];
  constructor() {}
 /**
  * 
  * Open The Datebase
  */
  openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'todo.db', location: 'default'});
    this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Todo (id integer primary key,image text, description text)');
      }, (e) => {
        console.log('Transtion Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      })
  }
    
  /**
   * 
   * @param addItem for adding: function
   */
  addItem(image, description) {
    return new Promise(resolve => {
      this.check(image).
        then((res)=>{
          console.log(res)
          if (res==false){
            var InsertQuery = "INSERT INTO Todo (image, description) VALUES (?,?)";
                  this
                    .db
                    .executeSql(InsertQuery, [image,description], (r) => {
                      console.log('Inserted... Sucess..', image);
                      resolve(true)
                    }, e => {
                      console.log('Inserted Error', e);
                      resolve(false);
                    })
          } else{
            this.del(image).then(res=>{
              resolve(true)
            },err=>{
              resolve(false)
            }) 
          }
        },(reject)=>{
            console.log(reject)
        });
  });
  }

  //Refresh everytime

  getRows() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM Todo";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
                 this.arr.push({ image: rs.rows.item(i).image, description: rs.rows.item(i).description});
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }


  check(image) {
    return new Promise(res => {
      let query = "SELECT * FROM Todo where image=?";
      this
        .db
        .executeSql(query, [image], rs => {
          if (rs.rows.length>0) res(true);
          else res(false)
        }, (e) => {
          console.log('Sql Query Error', e);
          res(false)
        });
    })
  }

  //to delete any Item
  del(image) {
    return new Promise(resolve => {
      var query = "DELETE FROM Todo WHERE image=?";
      this
        .db
        .executeSql(query, [image], (s) => {
          console.log('Delete Success...', s);
          this
            .getRows()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }
  //to Update any Item
  update(image, description) {
    return new Promise(res => {
      var query = "UPDATE Todo SET description=?  WHERE image=?";
      this
        .db
        .executeSql(query, [
          description,image 
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getRows()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

}

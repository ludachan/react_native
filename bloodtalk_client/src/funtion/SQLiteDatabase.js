import SQLite from "react-native-sqlite-storage";
import axios from 'axios';
import {URL} from '../../config';

SQLite.DEBUG(false); //디버그모드 true, false
SQLite.enablePromise(true);

export default class SQLiteDatabase {
    initDB() {
        let db;
        return new Promise((resolve) => {
            SQLite.echoTest()
            .then(() => {
                SQLite.openDatabase({   
                    name: 'bloodtalk.db',
                    location: 'default',
                    createFromLocation: '~www/bloodtalk.db'
                })
                .then(DB => {
                    db = DB;
                    //console.log("Database OPEN");
                    db.executeSql('SELECT * FROM messageList', []).then(([results]) => {
                        //console.log("Database is ready ... executing query ...");
                        if(results.rows.length > 0) {
                            //console.log(`${JSON.stringify(results.rows.item(0))}`);
                        } else {
                            //console.log("Database no data");
                        }
                    }).catch((error) =>{
                        console.log(error);
                    });
                    resolve(db);
                })
                .catch(error => {
                    console.log(`Database OPEN error : ${error}`);
                });
            })
            .catch(error => {
                console.log("echoTest failed");
            });
        });
    };

    closeDatabase(db) {
        if (db) {
            //console.log("Closing DB");
            db.close().then(status => {
                //console.log("Database CLOSED");
            }).catch(error => {
                this.errorCB(error);
            });
        } else {
            console.log("Database was not OPENED");
        }
    };

    /* 클라이언트 DB 데이터 가져오기 */
    getClientMessagesList(chatUUID) {
        return new Promise((resolve) => {
            const messages = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`SELECT * FROM messageList where chatUUID='${chatUUID}' order by messageTime desc`, []).then(([tx, results]) => {
                        //console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            //console.log(`userIdex: ${row.userObjectId}, content: ${row.content}`)
                            const { chatUUID, messageUUID, userObjectId, messageTime, text, image, video } = row;
                            messages.push({
                                chatUUID,
                                messageUUID,
                                userObjectId,
                                messageTime,
                                text,
                                image,
                                video
                            });
                        }
                        //console.log(JSON.stringify(messages));
                        resolve(messages);
                    });
                }).then((result) => {
                    //this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });  
    }

    /* 클라이언트 DB 데이터에 저장하기 */
    saveClientMessagesList(chatUUID,messageUUID,userObjectId,messageTime,text,image,video) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`insert into messageList(chatUUID,messageUUID,userObjectId,messageTime,text,image,video) 
                    values('${chatUUID}','${messageUUID}','${userObjectId}','${messageTime}','${text}','${image}','${video}')`, []).then(([tx, results]) => {
                        console.log("클라DB받기완료");
                    });
                }).then((result) => {
                    //this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
                console.log('여기11');
            });
        });  
    }

    /* 서버DB를 받아와서 클라이언트 DB에 데이터 저장하기 */
    saveServerMessagesList(chatUUID,messageUUID,userObjectId,messageTime,text,image,video,myObjectId) {
        console.log('kakaka')
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`insert into messageList(chatUUID,messageUUID,userObjectId,messageTime,text,image,video) 
                    values('${chatUUID}','${messageUUID}','${userObjectId}','${messageTime}','${text}','${image}','${video}')`, []).then(([tx, results]) => {
                        //console.log("서버데이타 받기 완료");
                    });
                }).then((result) => {
                    //this.closeDatabase(db);
                    axios.post(URL+'/chat/delete', {
                        chatUUID: chatUUID,
                        userObjectId: myObjectId,
                      }).then(response=>{
                          console.log('Response Data : ' + response.data)
                      }).catch(err=>{
                        console.log('serverSaveMessagesList/load err ' + err)
                      })
                }).catch((err) => {
                    console.log('serverSaveMessagesList/load err : ' + err);
                });
            }).catch((err) => {
                console.log(err);
                console.log('여기22');
            });
        });  
    }

    /* 삭제 요청 온 메시지 내용 '삭제된 메시지 입니다.' 라고 업데이트 하기, 그리고 자기는 데이터를 받았으니 noSyncData에 데이터 없애기 1개의 메시지에만 적용*/
    updateClientMessagesList(chatUUID, messageUUID, myObjectId) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`update messageList set text='삭제된 메시지 입니다.', image='', video='' where messageUUID = '${messageUUID}' and chatUUID = '${chatUUID}'`, []).then(([tx, results]) => {
                    });
                }).then((result) => {
                    console.log('삭제된 메시지 입니다.')
                    axios.post(URL+'/chat/delete/message', {  //동기화가 완료 되었으니 updateMessage에 noSyncUser 지우기
                        chatUUID: chatUUID,
                        messageUUID: messageUUID,
                        userObjectId: myObjectId,
                      }).then(response=>{
                      }).catch(err=>{
                        console.log('updateClientMessagesList err ' + err)
                      })
                }).catch((err) => {
                    console.log('updateClientMessagesList err : ' + err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });  
    }


    /* 삭제 요청 온 메시지 내용 '삭제된 메시지 입니다.' 라고 업데이트 하기, 그리고 자기는 데이터를 받았으니 noSyncData에 데이터 없애기 전체의 메시지에만 적용*/
    updateClientAllMessagesList(chatUUID, messageObjectId, myObjectId) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`update messageList set text='삭제된 메시지 입니다.', image='', video='' where userObjectId = '${messageObjectId}' and chatUUID = '${chatUUID}'`, []).then(([tx, results]) => {
                    });
                }).then((result) => {
                    console.log(result)
                    axios.post(URL+'/delete/message', {
                        chatUUID: chatUUID,
                        messageObjectId: messageObjectId,
                        userObjectId: myObjectId,
                      }).then(response=>{
                      }).catch(err=>{
                        console.log('updateClientMessagesList err ' + err)
                      })
                }).catch((err) => {
                    console.log('updateClientMessagesList err : ' + err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });  
    }

    

    /*대화삭제*/
    DeleteList(){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`delete from messageList`, []).then(([tx, results]) => {
                        //console.log("Query completed");
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });  
    }
}

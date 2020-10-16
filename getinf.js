var executed = false;


function waitMsec(sec){
  time = new Date().getMilliseconds()+sec;
  while(new Date().getMilliseconds()<time);
}

function notifyMe(msg) {
 if (Notification.permission !== 'granted')
  Notification.requestPermission();
 else {
  var notification = new Notification('Notification title', {
   body: msg,
  });
  notification.onclick = function() {
  };
 }
}

var request = null;
var db = null;

function opendb(){
  request = window.indexedDB.open('kadaiDB',4);;
  db = null;
  request.onerror=function(event){
    console.log("Error opening DB");
  }
  request.onsuccess=function(event){
    db = event.target.result;
    console.log("db connected");
    console.log(db.version);
  }
  request.onupgradeneeded = function(event) {
    console.log("db updating");
    db = event.target.result;
    var objectStore = db.createObjectStore("kadais", { keyPath: "id" });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("url", "url", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });
    objectStore.createIndex("notifyed", "notifyed", { unique: false });
    objectStore.transaction.oncomplete = function(event) {
      console.log("db updated");
    };
  };
}

async function addtodb(i,transaction,final) {
  console.log("add:"+i);
  var inf = $(".w-100.event-name-container.text-truncate.line-height-3").eq(i).find("a").eq(0).attr("aria-label");
  var ourl = $(".w-100.event-name-container.text-truncate.line-height-3").eq(i).find("a").eq(0).attr("href");
  var oid = ourl.substring(ourl.indexOf("id=")+3);
  var oname = inf.substring(0,inf.indexOf("活動は"));
  var time = inf.substring(inf.indexOf("活動は")+3,inf.indexOf("が期限です")).replace("年 ","/").replace("月 ","/").replace("日","")+":00";
  var deadline = new Date(time);
  if(deadline.getTime()>=new Date().getTime()){
    let objectStore = transaction.objectStore("kadais");
    let object ={
      id: oid,
      name:oname,
      url:ourl,
      time:deadline,
      notifyed:"0"
    }
    console.log(oid+" "+oname+" "+time);
    var req = objectStore.openCursor(oid);
    req.onsuccess = function(e) {
      var cursor = e.target.result;
      if (cursor) { // key already exist
        console.log(oid+"exists");
        if(final==i){
          notifyMe("データの同期が完了しました(0)");
          window.close();
        }
      } else { // key not exist
        let request = objectStore.add(object);
        request.onsuccess = function() { // (4)
          console.log("Object added", request.result);
          if(final==i){
            notifyMe("データの同期が完了しました(0)");
           window.close();
          }
        };
        request.onerror = function() {
          console.log(oid+"err0r");
          console.log("AddError", request.error);
          if(final==i){
            notifyMe("データの同期が完了しました(1)");
            window.close();
          }
      };
      }
    };

  }
}


$(document).ready(function(){
  //何かしらの処理
  notifyMe("同期してます...(1/2)");
  $('HTML').bind('DOMSubtreeModified', async function() {
    var all = document.querySelectorAll('[aria-label="次の6か月間フィルタオプション"]')[0];
    var tf = document.querySelectorAll('[data-limit="25"]')[0];
    if(all.getAttribute("aria-current")!="true"){
      console.log("not-found");
      all.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    if(tf.getAttribute("aria-current")!="true"){
      console.log("not25");
      tf.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    var next = document.querySelectorAll('li[data-control="next"]')[1];
    next.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    var flag = next.className.includes('disabled')+""+$('.icon.fa.fa-circle-o-notch.fa-spin.fa-fw:visible').length;
    console.log(flag);
    if(flag=="true0"&&executed==false){
      executed = true;
      const promise = new Promise(function(){
        request = window.indexedDB.open('kadaiDB',4);;
        db = null;
        request.onerror=function(event){
          console.log("Error opening DB");
        }
        request.onsuccess=async function(event){
          db = event.target.result;
          console.log("db connected");
          var data = $(".w-100.event-name-container.text-truncate.line-height-3");
          console.log(data.length);
          for (let i = 0; i < data.length; i++) {
            var transaction = db.transaction(["kadais"], "readwrite");
            await addtodb(i,transaction,data.length-1);
          }
        }
        request.onupgradeneeded = function(event) {
          console.log("db updating");
          db = event.target.result;
          var objectStore = db.createObjectStore("kadais", { keyPath: "id" });
          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("url", "url", { unique: false });
          objectStore.createIndex("time", "time", { unique: false });
          objectStore.createIndex("notifyed", "notifyed", { unique: false });
          objectStore.transaction.oncomplete = async function(event) {
            console.log("db updated");
          };
        };
      });

      //10分前、1日前、一週間前
    }
  });
});

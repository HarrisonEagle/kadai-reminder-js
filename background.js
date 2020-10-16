const INTERVAL = 1000;
setTimeout(function(){
   chrome.tabs.create({url: "https://wsdmoodle.waseda.jp/my/?scarp=true", active: false }, tab =>{
     chrome.tabs.executeScript(tab.id, { file: "jquery-3.5.1.js" }, function() {
       chrome.tabs.executeScript(tab.id,{
         file:"getinf.js"
       });
     });
   });
},INTERVAL);
//ログインしてません

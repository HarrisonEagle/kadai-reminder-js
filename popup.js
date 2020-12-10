
document.addEventListener('DOMContentLoaded', async function() {

chrome.storage.local.get('wasedaid', function (results) {
  $("#wasedaid").val(results.wasedaid);
});
chrome.storage.local.get('password', function (results) {
  $("#password").val(CryptoJS.AES.decrypt(results.password, "Passphrase").toString(CryptoJS.enc.Utf8));
});

chrome.storage.local.get('kadaidata',function(json){
  const obj = JSON.parse(json.kadaidata);
  for(var i=0;i<obj.length;i++) {
    $("#tab2").append(`<div class=\"listchild\"><a href=\"${obj[i].url}\" class=\"cname\" target="_blank">${obj[i].name}</a><p class=\"cdate\">${obj[i].deadline}</p></div>`);
  }
});

  //Button
  var reload = document.getElementById("reload");
  reload.addEventListener("click", function(){
    getinf(true);
  });

  var save = document.getElementById("save");
  save.addEventListener("click", function(){
    chrome.storage.local.set({wasedaid:$("#wasedaid").val(),password:CryptoJS.AES.encrypt($("#password").val(), "Passphrase").toString()},function(){
      chrome.storage.local.get(['wasedaid', 'password'], function (results) {
        //Communication
        var form = $('<form/>', {action: "https://kadai-reminder-server.herokuapp.com/upuser", method: 'post'})
        .append($('<input/>', {name: 'wasedaid', value: CryptoJS.AES.encrypt($("#wasedaid").val(), "Passphrase").toString()}))
        .append($('<input/>', {name: "password", type:"password",value: results.password}))
        $.ajaxSetup({
          headers: {
            '  X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
       }
     });
        $.ajax({
  	        url: "https://kadai-reminder-server.herokuapp.com/upuser",
  	        type: 'POST',
            data :form.serialize(),
  	        success: function(data) {
  	            alert("Information Updated.");
  	        }
  	    });
    });
    });

  });

});

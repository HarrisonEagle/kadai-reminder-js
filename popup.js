
document.addEventListener('DOMContentLoaded', async function() {

chrome.storage.local.get('wasedaid', function (results) {
  $("#wasedaid").val(results.wasedaid);
});
chrome.storage.local.get('password', function (results) {
  $("#password").val(CryptoJS.AES.decrypt(results.password, "Passphrase").toString(CryptoJS.enc.Utf8));
});

  //Button
  var reload = document.getElementById("reload");
  reload.addEventListener("click", function(){
    chrome.storage.local.get(['wasedaid', 'password'], function (results) {
      //Communication
      var form = $('<form/>', {action: "https://kadai-reminder-server.herokuapp.com/api", method: 'post'})
      .append($('<input/>', {name: 'wasedaid', value: CryptoJS.AES.encrypt($("#wasedaid").val(), "Passphrase").toString()}))
      .append($('<input/>', {name: "password", type:"password",value: results.password}))
      $.ajaxSetup({
        headers: {
          '  X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
     }
   });
      $.ajax({
	        url: "https://kadai-reminder-server.herokuapp.com/api",
	        type: 'POST',
          data :form.serialize(),
	        success: function(data) {
	            alert(data);
	        }
	    });

  });
  });

  var save = document.getElementById("save");
  save.addEventListener("click", function(){
    alert(CryptoJS.AES.encrypt($("#password").val(), "Passphrase").toString());
    chrome.storage.local.set({wasedaid:$("#wasedaid").val(),password:CryptoJS.AES.encrypt($("#password").val(), "Passphrase").toString()});
  });

});

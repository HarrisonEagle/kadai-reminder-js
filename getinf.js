$('HTML').bind('DOMSubtreeModified', function() {
  $('a[aria-label="すべてフィルタオプション"]').click();
  $('li[data-control="next"]').find('.page-link')[1].click();
  console.log($('li[data-control="next"]').find('.page-link').eq(1).parent().hasClass('disabled')+""+$('.icon.fa.fa-circle-o-notch.fa-spin.fa-fw:visible').length
)});

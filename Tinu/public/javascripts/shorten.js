$('.btn-shorten').on('click', function () {

  $.ajax({
    url: '/tinu',
    type: 'POST',
    dataType: 'JSON',
    data: { url: $('#url-field').val() },
    success: function (data) {
      var resultHTML = '<a class="tinurl" target="_blank" href="' + data.tinu + '">'
        + data.tinu + '</a>';
      $('#tinurl').html(resultHTML);
    }
  });
});

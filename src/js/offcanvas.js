$(function () {
  'use strict'

  $('[data-toggle="offcanvas"]').on('click', function () {
    $('.offcanvas-collapse').toggleClass('d-none');
    $('#map').toggleClass('col-12 col-9 d-none d-sm-block');
  })
})

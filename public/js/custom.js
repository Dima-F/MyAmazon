
$(function() {
  $('#search').keyup(function() {
    var search_term = $(this).val();
    $.ajax({
      method: 'POST',
      url: '/api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(results) {
        $('#searchResults').empty();
        results.forEach(function(val) {
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + val._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' + val.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + val.name + '</h3>';
          html += '<p>' + val.category.name + '</p>';
          html += '<p>$' + val.price + '</p>';
          html += '</div></div></a></div>';

          $('#searchResults').append(html);
        });
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $(document).on('click', '#plus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseFloat($('#quantity').val());

    priceValue += parseFloat($('#priceHidden').val());
    quantity++;
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });

  $(document).on('click', '#minus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseFloat($('#quantity').val());
    if (quantity === 1) {
      priceValue = parseFloat($('#priceHidden').val());
    } else {
      priceValue -= parseFloat($('#priceHidden').val());
      quantity--;
    }
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });

});

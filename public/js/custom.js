$(function() {
  Stripe.setPublishableKey('pk_test_Gdeyxm2ZDVkAEuQt8w75jNWb');

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
        var data = results.hits.hits.map(function(hit) {
          return hit;
        });
        $('#searchResults').empty();
        data.forEach(function(val) {
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + val._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' + val._source.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + val._source.name + '</h3>';
          html += '<p>' + val._source.category.name + '</p>';
          html += '<p>$' + val._source.price + '</p>';
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

  function stripeResponseHandler(status, response) {
    var $form = $('#payment-form');
    if (response.error) {
      $form.find('.payment-errors').text(response.error.message);
      $form.find('button').prop('disabled', false);
    } else {
      //response contains id and card, which contains additional card details
      var token = response.id;
      //insert token into the form;
      $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
      //and submit
      $form.get(0).submit();
    }
  }

  $('#payment-form').submit(function(event) {
    var $form = $(this);
    //prevent repeated clicks
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken($form, stripeResponseHandler);
    //prevent default form submitting
    return false;
  });

});

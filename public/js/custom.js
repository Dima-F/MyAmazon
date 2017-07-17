$(function(){
  $('#search').keyup(function(){
    var search_term = $(this).val();

    $.ajax({
      method:'POST',
      url:'/api/search',
      data: { search_term },
      dataType:'json',
      success:function(json){
        var data = json.hits.hits.map(function(hit){
          return hit;
        });
        $('#searchResults').empty();
        data.forEach(function(val){
          var html="";
          html+='<div class="col-md-4">';
          html+='<a href="/product/'+val._source._id +'">';
          html+='<div class="thumbnail">';
          html+='<img src="' + val._source.image +'">';
          html+='<div class="caption">';
          html+='<h3>' + val._source.name +'</h3>';
          html+='<p>' +val._source.category.name +'</p>';
          html+='<p>$' + val._source.price +'</p>';
          html+='</div></div></a></div>';

          $('#searchResults').append(html);
        });
      },
      error:function(error){
        console.log(error);
      }
    });
  });
});

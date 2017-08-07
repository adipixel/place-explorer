
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $nytHeaderElem.text("");
    // load streetview

    // YOUR CODE GOES HERE!
    street = $('#street').val();
    city = $('#city').val();
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+street+','+city+'">');

    //loading articles from NYT
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "1de5ed55c93344a9857f62abd9ceaaaa",
      'fq': city,
      'sort': "newest"
    });
    
    $.getJSON(url, function(data){
        //console.log(data.response.docs);
        $nytHeaderElem.append('New York Times Articles for ' + city);
        for (var i = data.response.docs.length - 1; i >= 0; i--) {
            articleData = data.response.docs[i];
            article = '<li class="article"><a href="'+ articleData.web_url +'">'+ articleData.headline.main +'</a><p>'+ articleData.snippet +'</p></li>';
            $nytElem.append(article);
        }
        
    }).error(function(){
        $nytHeaderElem.append('Cannot load articles');
    });


    //loading wiki articles
    var wikiRequestTimeout =  setTimeout(function() {
        $wikiElem.text('Failed to load wikipedia links!');
    }, 8000);

    wiki_url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&callback=wikiCallback";
    $.ajax({
        url: wiki_url,
        dataType: 'jsonp',
        success: function (data) {
            console.log(data[1]);
            for (var i = 0; i < data[1].length; i++) {
                var url = 'https://en.wikipedia.org/wiki/'+ data[1][i];
                $wikiElem.append('<li><a href="'+url+'">'+data[1][i]+'</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    })
    return false;
};

$('#form-container').submit(loadData);

$(document).ready(function () {
  var text = GetQueryString("text");
  if (text != null) {
    $('#text').val(text);
    Parse(text);
  }
  $('#submit').click(function () {
    var text = $('#text').val().trim();
    if (text != "") {
      Parse(text);
    }
  });
  $("#text").on('keypress', function (e) {
    if (e.keyCode != 13) return;
    var text = $('#text').val().trim();
    if (text != "") {
      Parse(text);
    }
  });
  let timer = setInterval(() => {
    let len = $("#code").val().length;
    if (len) {
      $("#code").trigger("input");
      $("#code").val("");
    }
  }, 1000);
});

function Parse(text) {
  $('#editor_holder').html("<h4>loading...</h4>");
  $("#visual").html("<h4>loading...</h4>");
  $.ajax({
    url: "/api/?text=" + encodeURIComponent(text),
    cache: false,
    success: function (result) {
      $('#editor_holder').jsonview(result);
      visual(result);
      tree(result);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(XMLHttpRequest.responseText);
    }
  });
}

function one(k, v) {
  return "<fieldset><legend class=\"label label-info left\">" +
    k + "</legend>" + v + "</fieldset>";
}

function visual(doc) {
  if (doc == null || doc.length == 0) {
    $("#visual").html("<h4>no result</h4>");
    return
  }
  var html = "";
  for (var i = 0; i < doc.length; i++) {
    var k = "slot " + (i + 1);
    var v = "<pre>" + JSON.stringify(doc[i], null, 2) + "</pre>";
    html += one(k, v);
  }
  $("#visual").html(html);
}

function tree(doc) {
  console.log(doc);
  if (doc == null || doc.length == 0) {
    $("#tree").html("<h4>no result</h4>");
    return
  }
  var html = "";
  for (var i = 0; i < doc.length; i++) {
    html += doc[i].bracketd + '\n'
  }
  $("#code").val(html)
}

months = ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December'];

function todays_date(separator) {
   var separator = separator || " ";
   var today = new Date();
   return pretty_date(today, separator);
}

function pretty_date(date, separator) {
   var separator = separator || " ";

   var dd = date.getDate();
   var mm = date.getMonth();
   var yyyy = date.getFullYear();

   return months[mm] + separator + dd + ',' + separator + yyyy;
}

function day_of_year(date) {
   var now = new Date(date);
   var start = new Date(now.getFullYear(), 0, 0);
   var diff = now - start;
   var oneDay = 1000 * 60 * 60 * 24;
   var day = Math.floor(diff / oneDay);
   return day;
}

function date_from_day(year, day){
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

function get_verses() {
   $.getJSON('/verses.json', function(data) {
      print_verses(data);
   });
}

function print_verses(data) {

   var start_day = day_of_year(params().start.replace(/_/g, ' '));
   var html = '<table><tbody>';

   for (var i = 0; i < 365; i++) {
      var date = pretty_date(date_from_day(new Date(params().start.replace(/_/g, ' ')).getFullYear(), i + start_day));

      if (date === pretty_date(new Date())) {
         html += '<tr id="today">';
      } else {
         html += '<tr>';
      }

      html += '<td>' + date + '</td>';
      html += '<td>' + data[i].old_testament + '</td>';
      html += '<td>' + data[i].new_testament + '</td>';
      html += '<td>' + data[i].psalms_and_proverbs + '</td>';
      html += '</tr>';
   }
   html += '</tbody></table>';
   $('#verses').html(html);
}

function params() {
   var query_string = {};
   var query = window.location.search.substring(1);
   var vars = query.split("&");

   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      // Chrome bug appends slash to end of parameter
      if (pair[1] && pair[1].substr(pair[1].length - 1) === "/") {
         pair[1] = pair[1].substr(0, pair[1].length - 1);
      }

      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
         query_string[pair[0]] = pair[1];
      // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
         var arr = [ query_string[pair[0]], pair[1] ];
         query_string[pair[0]] = arr;
      // If third or later entry with this name
      } else {
         query_string[pair[0]].push(pair[1]);
      }
   }

   return query_string;
}

function go_to_date() {
   if (!params().start || !Date.parse(params().start.replace(/_/g, ' '))) {
      window.history.pushState(null, null, "?start=" + todays_date());
   }
}

function show_start_date() {
   var today = pretty_date(new Date());
   var start_date = params().start.replace(/_/g, ' ');
   var text = '';
   if (start_date === today) {
      text = "You are starting today,";
   } else if (new Date(today) > new Date(start_date)) {
      text = "You started";
   } else {
      text = "You will start";
   }
   $('#datepicker').val(start_date);
}

var refTagger = {
   settings: {
      bibleVersion: "ESV",
      socialSharing: [],
      tagChapters: true
   }
};

$(function() {
   go_to_date();
   show_start_date();
   get_verses();

   $("#datepicker").datepicker({
      inline: true,
      changeMonth: true,
      changeYear: true,
      dateFormat: "MM d, yy",
      onClose: function() {
         date = new Date($(this)[0].value);
         window.history.pushState(null, null, "?start=" + pretty_date(date, '_'));
         get_verses();
      }
   });

   (function(d, t) {
      var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
      g.src = "//api.reftagger.com/v2/RefTagger.js";
      s.parentNode.insertBefore(g, s);
   }(document, "script"));
});

months = ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December'];

function todays_date() {
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth() + 1; // January is 0!
   var yyyy = today.getFullYear();

   if (dd < 10) {
      dd = '0' + dd
   }

   if (mm < 10) {
      mm = '0' + mm
   }

   today = mm + '-' + dd + '-' + yyyy;
   return today;
}

function pretty_date(date) {
   var dd = date.getDate();
   var mm = date.getMonth();
   var yyyy = date.getFullYear();

   return months[mm] + ' ' + dd + ', ' + yyyy;
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

function us_to_ietf(date) {
   var parts = date.split('-');

   return months[parseInt(parts[0]) - 1] + ' ' + parts[1] + ', ' + parts[2];
}

function get_verses() {
   $.getJSON('/verses.json', function(data) {
      print_verses(data);
   });
}

function print_verses(data) {

   var start_day = day_of_year(us_to_ietf(params().start));

   var html = '';

   html += '<table><tbody>';
   for (var i = 0; i < 365; i++) {
      var date = pretty_date(date_from_day(2015, i + start_day));

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
   $('body').append(html);
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
   if (!params().start) {
      window.history.pushState(null, null, "?start=" + todays_date());
   }
}

function show_start_date() {
   var today = pretty_date(new Date());
   var start_date = us_to_ietf(params().start);
   var text = '';
   if (start_date === today) {
      text = "You are starting today,";
   } else if (new Date(today) > new Date(start_date)) {
      text = "You started";
   } else {
      text = "You will start";
   }
   $('#start_date').text(text + " " + start_date + ".");
}

$(function() {
   go_to_date();
   show_start_date();
   get_verses();
});

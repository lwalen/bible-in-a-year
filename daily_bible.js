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

function day_of_year() {
   var now = new Date();
   var start = new Date(now.getFullYear(), 0, 0);
   var diff = now - start;
   var oneDay = 1000 * 60 * 60 * 24;
   var day = Math.floor(diff / oneDay);
   return day;
}

function get_verses() {
   $.getJSON('/verses.json', function(data) {
      print_verses(data);
   });
}

function print_verses(data) {
   $('body').append('<table><tbody>');
   for (var i = 0; i < 365; i++) {
      $('body').append('<tr>');
      $('body').append('<td>' + data[i].old_testament + '</td>');
      $('body').append('<td>' + data[i].new_testament + '</td>');
      $('body').append('<td>' + data[i].psalms_and_proverbs + '</td>');
      $('body').append('</tr>');
   }
   $('body').append('</tbody></table>');
}

function params() {
   var query_string = {};
   var query = window.location.search.substring(1);
   var vars = query.split("&");

   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      // Chrome bug appends slash to end of parameter
      if (pair[1].substr(pair[1].length - 1) === "/") {
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

function delete_cookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function get_cookies() {
   var cookies = {}
   var cookie_string = document.cookie.split(';');
   for (var i = 0; i < cookie_string.length; i++) {
      var pair = cookie_string[i].split('=');
      cookies[pair[0].replace(/ /g, '')] = pair[1];
   }
   return cookies;
}

function go_to_date() {
   var date;

   if (get_cookies().start_date) {
      date = get_cookies().start_date;
   } else {
      date = todays_date();
   }

   window.history.pushState(null, null, "?start=" + date);
}

$(function() {

   go_to_date();
   get_verses();

   $('#start_button').click(function() {
      var no_expire = '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
      document.cookie = 'start_date=' + todays_date() + no_expire;
      return false;
   });
});

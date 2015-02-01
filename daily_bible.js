
// Takes date object and separator, returns something like January 1, 2015
function pretty_date(date, separator) {
   var separator = separator || " ";

   var day = date.getDate();
   var month = date.toLocaleString('en-us', { month: 'long' });
   var year = date.getFullYear();

   return month + separator + day + ',' + separator + year;
}

// Get the number of the day in the year
function day_of_year(date) {
   var now = new Date(date);
   var start = new Date(now.getFullYear(), 0, 0);
   var diff = now - start;
   var secondsInOneDay = 1000 * 60 * 60 * 24;
   var day = Math.floor(diff / secondsInOneDay);
   return day;
}

// Get the date on the day-th day of year
function date_from_day(year, day){
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

// Get the verses and print them
function get_verses() {
   $.getJSON('/verses.json', function(data) {
      print_verses(data);
   });
}

// Print a table of all the verses. Highlight today
function print_verses(data) {

   var start_day = day_of_year(param_date());
   var html = '<table><tbody>';

   for (var i = 0; i < 365; i++) {
      var date = pretty_date(date_from_day(new Date(param_date()).getFullYear(), i + start_day));

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

// Get the pretty date from the url hash
function param_date() {
   return window.location.hash.replace(/_/g, ' ').replace('#', '');
}

// Set the url hash to a pretty date
function set_param_date(date) {
   window.location.hash = pretty_date(date, '_');
}

// Set the date to today if an invalid one is given
function go_to_date() {
   if (!Date.parse(param_date())) {
      set_param_date(new Date());
   }
}

// Set the datepicker field start date based on url hash
function show_start_date() {
   var today = pretty_date(new Date());
   var start_date = param_date();
   $('#datepicker').val(start_date);
}

$(function() {
   go_to_date();
   show_start_date();
   get_verses();

   $("#datepicker").datepicker({
      inline: true,
      changeMonth: true,
      changeYear: true,
      dateFormat: "MM d, yy",
      onClose: function(date) {
         date = new Date(date);
         set_param_date(date);
         get_verses();
      }
   });
});

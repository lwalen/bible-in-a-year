var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

// Takes date object and separator, returns something like January 1, 2015
function pretty_date(date, separator) {
   var separator = separator || " ";

   var day = date.getDate();
   var month = monthNames[date.getMonth()];
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

function get_todays_verses() {
   $.getJSON('/verses.json', function(data) {
      print_todays_verses(data);
   });
}

function print_todays_verses(data) {
   var secondsInOneDay = 1000 * 60 * 60 * 24;
   var start = new Date(param_date());
   var today = new Date();
   var day_number = Math.floor((today - start) / secondsInOneDay);
   var verses = data[day_number];
   console.log(day_number);
   console.log(verses);

   if (day_number < 0) {
      clear_verses();
      $('#todays_verses_error').text("Nothing yet! Are you sure you don't want to start sooner?");
   } else if (day_number > 365) {
      clear_verses();
      $('#todays_verses_error').text("Isn't that a long time ago? Why don't you start again?");
   } else {
      clear_verses_error();
      $('#today_old').text(verses.old_testament);
      $('#today_psalm').text(verses.psalms_and_proverbs);
      $('#today_new').text(verses.new_testament);
   }
}

function clear_verses() {
   $('#today_old, #today_psalm, #today_new').text("");
}

function clear_verses_error() {
   $('#todays_verses_error').text("");
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
      html += '<td>' + data[i].psalms_and_proverbs + '</td>';
      html += '<td>' + data[i].new_testament + '</td>';
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

// Set the date text
function show_start_date() {
   $('#start_date_text').text(param_date());
}

function initialize_datepicker() {
   var today = new Date();
   var last_year = today.getFullYear() - 1;
   var next_year = today.getFullYear() + 1;

   $("#datepicker").datepicker({
      inline: true,
      changeMonth: true,
      changeYear: true,
      dateFormat: "MM d, yy",
      defaultDate: new Date(param_date()),
      yearRange: last_year + ":" + next_year,
      onSelect: function(date) {
         console.log(date);
         date = new Date(date);
         set_param_date(date);
         show_start_date();
         get_todays_verses();
      }
   });
}

$(function() {
   go_to_date();
   get_todays_verses();
   show_start_date();
   initialize_datepicker();

   $('#show_plan').on('click', function() {
      if ($('#verses').text() === "") {
         $('#verses').text("Loading...")
         get_verses();
         $(this).text("Hide plan");
      } else {
         $('#verses').text("");
         $(this).text("Show entire plan");
      }
   });
});

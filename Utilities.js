/**
 * This function will format the date.
 *
 * @param {date} object of type date.
 * @param {format} string representing the expected format of date.
 * 
 * @return a string of formatted date.
 */
function getFormattedDate(date, format) {
  return Utilities.formatDate(date, 'UTC', format);
}
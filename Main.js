/**
 * This function will create custom menu in the sheet after opening it.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📅ShiftHoursCalculator')
    .addItem(ITEM_CLEAR_DATA, 'clearData')
    .addItem(ITEM_MAIN_REPORT, 'emailReport')
    .addItem(ITEM_UPDATE_NEXT_PAYCYCLE, 'updateToNextPaycycle')
    .addToUi();
}

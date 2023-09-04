/**
 * This function will remove the shift hours entered in 'Time Sheet' tab.
 */
function clearData() {
  const result = SHEET_UI.alert(
                ITEM_CLEAR_DATA,
                "This action will remove all the shift hours entered by employees.\n\n"+
                "Are you sure you want to clear?",
                SHEET_UI.ButtonSet.YES_NO);

  if (result == SHEET_UI.Button.YES) {
    timeSheetClearData();
  }
}

/**
 * This function will do the 3 tasks as below.
 *    1. Email current data of working hours.
 *    2. Remove the shift hours entered by employees.
 *    3. Update the dates of the next weeks.
 */
function updateToNextPaycycle() {
  const result = SHEET_UI.prompt(
                  ITEM_UPDATE_NEXT_PAYCYCLE,
                  "This action will be done in the following manner:\n" +
                  "● Emails the data of current pay cycle.\n" +
                  "● Clears the shift hours of current pay cycle.\n" +
                  "● Updates the dates of next pay cycle.\n\n" +
                  "Please enter email address:",
                  SHEET_UI.ButtonSet.OK_CANCEL);
  const button = result.getSelectedButton();
  const recipients = result.getResponseText();

  if (button == SHEET_UI.Button.OK) {
    if (recipients == '') {
      SHEET_UI.alert(ITEM_UPDATE_NEXT_PAYCYCLE, 'Please enter atlest one email id to continue.', SHEET_UI.ButtonSet.OK);
    } else {
      sendEmail(recipients);
      timeSheetClearData();
      timeSheetUpdateDates();
    }
  }
}

/**
 * This function will remove the shift hours entered in 'Time Sheet' tab.
 */
function timeSheetClearData() {
  const cells = SHEET_TIME_SHEET.getRange('C3:AF16');
  const formulas = cells.getFormulas();
  cells.clearContent().setFormulas(formulas);
}

/**
 * This function will remove the dates from first column of 'Time Sheet' tab and update the dates of next 2 week.
 */
function timeSheetUpdateDates() {
  const lastCell = SHEET_TIME_SHEET.getRange('A16');
  const firstCell = SHEET_TIME_SHEET.getRange('A3');
  const firstDateOfWeek = new Date(lastCell.getValue().getTime() + 24 * 60 * 60 * 1000);

  firstCell.setValue(getFormattedDate(firstDateOfWeek, 'MMM / dd'));
  firstCell.autoFill(SHEET_TIME_SHEET.getRange('A3:A16'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
}
/**
 * This function will ask user to enter email ids they want to mail the report on. 
 */
function emailReport() {
  const result = SHEET_UI.prompt(
                ITEM_MAIN_REPORT,
                'Please enter the email address:',
                SHEET_UI.ButtonSet.OK_CANCEL);

  const button = result.getSelectedButton();
  const recipients = result.getResponseText();

  if (button == SHEET_UI.Button.OK) {
    if (recipients == '') {
      SHEET_UI.alert(ITEM_MAIN_REPORT, 'Please enter atlest one email id to continue.', SHEET_UI.ButtonSet.OK);
    } else {
      sendEmail(recipients);
    }
  }
}

/**
 * This function will ask for mail ids and email the report.
 * 
 * @param {recipients} email ids entered by the user.
 */
function sendEmail(recipients) {
  try {
    const dateRange = `${getFormattedDate(SHEET_TIME_SHEET.getRange('A3').getValue(), 'MMM dd')} - ${getFormattedDate(SHEET_TIME_SHEET.getRange('A16').getValue(), 'MMM dd')}`;
    const subjectLine = "Shift Hours Report [" + dateRange + "]";
    const hoursData = getData(dateRange);
    const body = getEmailText(hoursData.data);
    const htmlTemplate = HtmlService.createTemplateFromFile("EmailTemplate.html");
    htmlTemplate.hoursData = hoursData;
    const htmlBody = htmlTemplate.evaluate().getContent();
    
    MailApp.sendEmail({
      to: recipients,
      subject: subjectLine,
      body: body,
      htmlBody: htmlBody,
      attachments: [SpreadsheetApp.getActiveSpreadsheet().getAs(MimeType.PDF).setName(subjectLine)]
    })
  } catch (error) {
    SHEET_UI.alert('Something went wrong.');
    console.error([error.message]);
  }
}

/**
 * This function will return a string of working hours data.
 *
 * @param {hoursData} the object containing employee name and their total working hours.
 * 
 * @return a string having Employee Name and their hours.
 */
function getEmailText(hoursData) {
  let emailText = "";
  hoursData.forEach((data) => {
    emailText = emailText + data.name + "\n" + data.hours + "\n-----------------------\n\n";
  });
  return emailText;
}

/**
 * This function will return the object of working hours data. 
 *
 * @param {dateRange} string showing first and last date of pay cycle. 
 * 
 * @return an object having two keys "data" and "total".
 *          { dateRange: = First and last date of pay cycle.
 *            data : 
 *              { name : Name of the Employee.
 *                hours : Total hours of the employee in mentioned daterange.
 *              }    
 *            total : Total hours by all the employees.
 *          } 
 */
function getData(dateRange) {
  const values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hours').getRange('A2:B11').getValues();
  let hoursData = [];
  values.forEach((value) => {
    if (value[1] <= 0) return;
    let data = {};
    data.name = value[0];
    data.hours = value[1].toFixed(2);
    hoursData.push(data);
  });
  return {
    'dateRange': dateRange,
    'data': hoursData,
    'total': SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hours').getDataRange().getDisplayValues().slice(-1)[0][1]
  };
}

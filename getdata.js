function doPost(e) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DataProfile");

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.name,
    data.firstName,
    data.lastName,
    data.contact,
    data.email,
    data.password
  ]);

  return ContentService.createTextOutput("Success");
}

});
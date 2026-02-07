function doPost(e) {
  try {
    // Get the active spreadsheet and first sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // Gets the first sheet
    
    // Get form data
    var email = e.parameter.email;
    var timestamp = e.parameter.timestamp;
    
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Email is required'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data from the sheet
    var lastRow = sheet.getLastRow();
    
    // If sheet is empty or only has headers, add the email
    if (lastRow === 0) {
      sheet.appendRow(['Email', 'Timestamp']); // Add headers
      sheet.appendRow([email, timestamp]);
      
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Registration successful'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all emails (assuming column A)
    var emailRange = sheet.getRange(2, 1, Math.max(1, lastRow - 1), 1); // Start from row 2 to skip header
    var existingEmails = emailRange.getValues();
    
    // Check for duplicates (case-insensitive)
    var emailLower = email.toLowerCase().trim();
    for (var i = 0; i < existingEmails.length; i++) {
      if (existingEmails[i][0].toString().toLowerCase().trim() === emailLower) {
        return ContentService.createTextOutput(JSON.stringify({
          'status': 'duplicate',
          'message': 'Email already registered'
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // No duplicate found - add the email
    sheet.appendRow([email, timestamp]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Registration successful'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
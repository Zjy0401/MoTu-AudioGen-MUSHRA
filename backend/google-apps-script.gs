const SPREADSHEET_ID = '1AH2jGIcQQlC41ZTAemye_LjcwD2U28Bzk3lYx9jXb_o';
const SHEET_NAME = 'responses';

function doPost(e) {
  try {
    const rawBody = (e && e.parameter && e.parameter.payload) || (e && e.postData && e.postData.contents) || '{}';
    const payload = JSON.parse(rawBody);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'submittedAt',
        'capturedAt',
        'comments',
        'responsesJson'
      ]);
    }

    sheet.appendRow([
      new Date().toISOString(),
      payload.capturedAt || '',
      payload.comments || '',
      JSON.stringify(payload.responses || [])
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON)
      ;
  }
}

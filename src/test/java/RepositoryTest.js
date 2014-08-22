describe("Repository", function() {
  var googleApiMock = new GoogleApiMock();
  var spreadSheetApp = googleApiMock.getSpreadSheetApp();
  var spreadSheet = spreadSheetApp.getActiveSpreadSheet();
  var utilities = new googleApiMock.getUtilities();
  var repository = new Repository(spreadSheet, utilities);
  var debtorSheet = spreadSheet.insertSheet('Debiteuren');
  var debtorData = [
	['Bedrag', 'Mandaat ID', 'Eerste of herhaling', 'Mandaatdatum', 'Betaling namens', 'Naam', 'IBAN', 'Bericht'],
	[5, 'MNDT001', 'FRST', '2013-12-11', false, 'Debtor1', 'NL91ABNA0417164300', 'Message'],
	[5, 'MNDT002', 'RCUR', '2013-12-11', false, 'Debtor2', 'NL91ABNA0417164300', 'Message'],
	[5, 'MNDT003', 'RCUR', '2013-12-11', false, 'Debtor3', 'NL91ABNA0417164300', 'Message']
  ];
  
  beforeEach(function() 
  {
	var range = debtorSheet.getRange(0, 0, 0, 0);
	range.setValues(debtorData);
	range.setValue(debtorData[0][0]);
  });
  
  it("returns the first 4 debtorheaders in row 0", function() {
	var row = 0, column = 0;
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual('Bedrag');
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual('Mandaat ID');
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual('Eerste of herhaling');
	expect(debtorSheet.getRange(row, column, 0, 0).getValue()).toEqual('Mandaatdatum');
  });

  it("returns the first 4 debtorvalues in row 1", function() {
	var row = 1, column = 0;
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual(5);
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual('MNDT001');
	expect(debtorSheet.getRange(row, column++, 0, 0).getValue()).toEqual('FRST');
	expect(debtorSheet.getRange(row, column, 0, 0).getValue()).toEqual('2013-12-11');
  });

  it("contains a sheet whith name 'Debiteuren'", function() {
    expect(spreadSheet.getSheetByName('Debiteuren')).toBeTruthy();
  });

  it("returns 3 debtors", function() {
    var debtors = repository.getDebtors();
    expect(debtors.length).toEqual(3);
  });
});

var Repository = function(spreadSheet) {
  var googleApiMock = new GoogleApiMock();
  var Utils = new googleApiMock.getUtilities();
  if (typeof(Utilities) != 'undefined')
    Utils = Utilities;
  this.getDebtors = function() {
    var map = {
      'Bedrag' : 'instdamt',
      'Mandaat ID' : 'mndtid',
      'Eerste of herhaling' : 'seqtp',
      'Mandaatdatum' : 'dtofsgntr',
      'Betaling namens' : 'amdmntind',
      'Naam' : 'dbtrnm',
      'IBAN' : 'dbtriban',
      'Bericht' : 'dbtrustrd'
    };
    return readRows(new getValues('Debiteuren'), map);
  }
  this.getMembers = function() {
    var map = {
      'Naam' : 'dbtrnm',
      'IBAN' : 'dbtriban',
      'Adres' : 'adres',
      'Postcode' : 'postcode',
      'Plaats' : 'plaats',
      'Email' : 'email',
    };
    return readRows(new getValues('AspirantLeden'), map);
  }
  this.getSettingValues = function(sheetName) {
    var sheet = spreadSheet.getSheetByName(sheetName);
    var rows = sheet.getDataRange();
    var values = rows.getValues();
    var map = {
      'Verenigingsnaam' : 'initiatingparty',
      'IBAN' : 'initiatingiban',
      'BIC' : 'initiatingbic',
      'Kenmerk' : 'endtoendid',
      'Incassant ID' : 'initiatingcreditoridentifier',
      'Datum afschrijving' : 'incassodate',
      'Datum aangemaakt' : 'creationdatetime',
      'Adres' : 'adresClub',
      'Postcode' : 'postcodeClub',
      'Plaats' : 'plaatsClub',
      'Reden betaling' : 'redenBetaling',
      'Email' : 'email'
    };
    return readSettings(values, map);
  }
  this.logInSpreadSheet = function(msg) {
    var sheet = spreadSheet.getSheetByName('Gegevens');
    sheet.getRange("A15").setValue(msg);
  }
  this.deleteDocByName = function (fileName){
    var docs = DocsList.find(fileName);
    for (var n in docs)
      if (docs[n].getName() == fileName)
        DocsList.getFileById(docs[n].getId()).setTrashed(true);
  }
  
  var getValues = function(sheetName) {
    var sheet = spreadSheet.getSheetByName(sheetName);
    this.values = this.values = sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn());
    this.headers = this.values.shift();
  }
  var getValue = function(val, key) {
    if (key == 'incassodate' || key == 'dtofsgntr')
      return Utils.formatDate(val, 'CET', 'yyyy-MM-dd');
    else if (key == 'creationdatetime')
      return Utils.formatDate(val, 'CET', "yyyy-MM-dd'T'HH:mm:ss'Z'");
    else if (key == 'dbtrnm')
      return val.replace(/[^a-zA-Z0-9\/-?:().,'+ ]/g, '?');
    else
      return val;
  }
  var readSettings = function(values, map) {
    var setting = {};
    for (var i = 0, pair; pair = values[i]; i++)
      if (pair[0] && pair[0] != '' && map[pair[0]])
        setting[map[pair[0]]] = getValue(pair[1], map[pair[0]]);
    return setting;
  }
  var readRecord = function(map, headers, row) {
    var record = {};
    for (var i = 0, key; key = map[headers[i]]; i++)
      if (key)
        record[key] = getValue(row[i], key);
    return record;
  }
  var readRows = function(info, map) {
    var rows = [];
    for (var i = 0, row; row = info.values[i]; i++)
      rows[i] = readRecord(map, info.headers, row);
    return rows;
  }
}

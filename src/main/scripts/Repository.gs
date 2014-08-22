var Repository = function(spreadSheet, Utilities) {
  var getDebtorInfo = function() {
    this.sheetName = 'Debiteuren',
    this.map = {
      'Bedrag' : 'instdamt',
      'Mandaat ID' : 'mndtid',
      'Eerste of herhaling' : 'seqtp',
      'Mandaatdatum' : 'dtofsgntr',
      'Betaling namens' : 'amdmntind',
      'Naam' : 'dbtrnm',
      'IBAN' : 'dbtriban',
      'Bericht' : 'dbtrustrd'
    }
  }
  var getMemberInfo = function() {
    this.sheetName = 'AspirantLeden',
    this.map = {
      'Naam' : 'dbtrnm',
      'IBAN' : 'dbtriban',
      'Mandaat ID' : 'mandaatId',
      'Adres' : 'adres',
      'Postcode' : 'postcode',
      'Plaats' : 'plaats',
      'Email' : 'email'
    };
  }
  var getSettingInfo = function() {
    this.sheetName = 'Gegevens';
    this.map = {
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
  }
  this.setDebtorHeaders = function() {
    var info = new getDebtorInfo();
    setHeaders(info.sheetName, info.map);
  }
  this.setMemberHeaders = function() {
    var info = new getMemberInfo();
    setHeaders(info.sheetName, info.map);
  }
  this.getDebtors = function() {
    var info = new getDebtorInfo();
    return readRows(new getValues(info.sheetName), info.map);
  }
  this.getMembers = function() {
    var info = new getMemberInfo();
    return readRows(new getValues(info.sheetName), info.map);
  }
  this.getSettings = function() {
    var info = new getSettingInfo();
    var sheet = spreadSheet.getSheetByName(info.sheetName);
    var rows = sheet.getDataRange();
    var readSettings = function(values, map) {
      var setting = {};
      for (var i = 0, pair; pair = values[i]; i++)
        if (pair[0] && pair[0] != '' && map[pair[0]])
          setting[map[pair[0]]] = getValue(pair[1], map[pair[0]]);
      return setting;
    }
    return readSettings(rows.getValues(), info.map);
  }
  this.logInSpreadSheet = function(msg) {
    var sheet = spreadSheet.getSheetByName('Gegevens');
    sheet.getRange("A15").setValue(msg);
  }
  var setHeaders = function(sheetName, map) {
    var sheet = spreadSheet.getSheetByName(sheetName);
    var keys = Object.keys(map);
    for (index in keys)
      sheet.getRange(1, eval(index) + 1).setValue(keys[index]);
  }
  var deleteDocByName = function (fileName){
    var docs = DocsList.find(fileName);
    for (var n in docs)
      if (docs[n].getName() == fileName)
        DocsList.getFileById(docs[n].getId()).setTrashed(true);
  }
  var getValues = function(sheetName) {
    var rows = spreadSheet.getSheetByName(sheetName).getDataRange();
    this.values = rows.getValues();
    this.headers = this.values.shift();
  }
  var getValue = function(val, key) {
    if (key == 'incassodate' || key == 'dtofsgntr')
      return Utilities.formatDate(val, 'CET', 'yyyy-MM-dd');
    else if (key == 'creationdatetime')
      return Utilities.formatDate(val, 'CET', "yyyy-MM-dd'T'HH:mm:ss'Z'");
    else if (key == 'dbtrnm')
      return val.replace(/[^a-zA-Z0-9\/-?:().,'+ ]/g, '?');
    else
      return val;
  }
  var readRows = function(info, map) {
    var readRecord = function(map, headers, row) {
      var record = {};
      for (var i = 0; i < headers.length; i++)
        if (map[headers[i]])
          record[map[headers[i]]] = getValue(row[i], map[headers[i]]);
      return record;
    }
    var rows = [];
    for (var i = 0; i < info.values.length; i++)
      rows[i] = readRecord(map, info.headers, info.values[i]);
    return rows;
  }
}

function PermissionForm(settings, body, DocumentApp) {
  var margin = 20;
  
  this.generate = function() {
    setDocProperties();
    addHeader();
    addClubFields();
    addInfoBox();
    addMemberFields();
    addSignup();
  }

  var setDocProperties = function() {
    body.setMarginBottom(margin);
    body.setMarginTop(margin);
    body.setMarginLeft(margin);
    body.setMarginRight(margin);
  }
  
  var addHeader = function() {
    this.rows = [ ['Doorlopende machtiging', ' ', 'SEPA'] ];
    this.columns = [
        {cellWidth: 450, cellColor : '#93c47d', fontColor : '#ffffff', fontSize : 24},
        {cellWidth: 25, cellColor : '#ffffff', fontColor : '#ffffff', fontSize : 24},
        {cellWidth: 100, cellColor : '#351c75', fontColor : '#ffffff', fontSize : 24}
      ];
    this.sectionSettings = { };
    
    setFormFieldProperties();
  }
  
  var addClubFields = function() {
    this.rows = [ 
        ['Incassant:', ' '],
        ['Naam', settings.verenigingsnaam],
        ['Adres', settings.adresClub],
        ['Postcode, plaats', settings.postcodeClub + ' ' + settings.plaatsClub],
        ['Incassant ID', settings.incassantId],
        ['Kenmerk machtiging', settings.kenmerk],
        ['Reden betaling', settings.redenBetaling]
      ];
    this.columns = [
        {cellWidth : 150, fontSize : 11},
        {cellWidth : 300, fontSize : 11, fontFamily : DocumentApp.FontFamily.COURIER_NEW}
      ];
    this.sectionSettings = { };
    
    setFormFieldProperties();
    setCellProperties(table.getCell(0, 0), {bold : true});
  }

  var addInfoBox = function() {
    this.rows = [
      ['Door ondertekening van dit formulier geeft u toestemming aan ' + settings.verenigingsnaam + ' om doorlopende ' + 
      'incasso-opdrachten te sturen naar uw bank om een bedrag van uw rekening af te schijven en aan uw bank om ' +
      'doorlopend een bedrag van uw rekening af te schrijven overeenkomstig de opdracht van ' + settings.verenigingsnaam + '.\n\n' + 
      'Als u het niet eens bent met deze afschrijving kunt u deze laten terugboeken. Neem hiervoor binnen 8 weken na ' +
      'afschrijving contact op met uw bank. Vraag uw bank naar de voorwaarden.']
    ];
    this.columns = [ { cellWidth : 575 } ];
    this.sectionSettings = { borderWidth : 1, borderColor : '#93c47d' };
    
    setFormFieldProperties();
  }
  
  var addMemberFields = function () {
    this.rows = [
      ['Naam', settings.tenNameVan],
      ['Adres', settings.adres],
      ['Postcode, plaats', settings.postcode + ' ' + settings.plaats],
      ['IBAN', settings.iban]
    ];
    this.columns = [
        {cellWidth : 150},
        {cellWidth : 300, fontFamily : DocumentApp.FontFamily.COURIER_NEW}
      ];
    this.sectionSettings = { };
    
    setFormFieldProperties();
  }
  
  var addSignup = function() {
    this.rows = [
      ['Plaats en datum', '\n\n'],
      [' ', ''],
      ['Handtekekening', '\n\n'],
    ];
    this.columns = [
        {cellWidth : 150},
        {cellWidth : 300, underline : true, linespacingafter : 10}
    ];
    this.sectionSettings = { };
    
    setFormFieldProperties();
  }

  var setFormFieldProperties = function() {
    table = body.appendTable(rows);
    table.setBorderWidth(sectionSettings.borderWidth ? sectionSettings.borderWidth : 0);
    table.setBorderColor(sectionSettings.borderColor ? sectionSettings.borderColor : '#000000');
    for (var row = 0; row < rows.length; row++)
      for (var column = 0; column < columns.length; column++)
        setCellProperties(table.getCell(row, column), columns[column]);
  }

  var setCellProperties = function (cell, properties) {
    cell.setBackgroundColor(properties.cellColor ? properties.cellColor : '#ffffff');
    if (properties.cellWidth)
      cell.setWidth(properties.cellWidth);
    setTextProperties(cell, properties);
  }
  
  var setTextProperties = function(cell, properties) {
    var text = cell.editAsText();
    if (text.getText().length == 0)
      return;
    setLineSpacing(cell, properties);
    text.setForegroundColor(0, text.getText().length  - 1, properties.fontColor ? properties.fontColor : '#000000' );
    text.setFontSize(properties.fontSize ? properties.fontSize : 11);
    text.setBold(properties.bold ? true : false);
    if (properties.fontFamily)
      text.setFontFamily(properties.fontFamily);
  }

  var setLineSpacing = function(cell, properties) {
     var searchResult = null;
     var lastParagraph = null;
     while (searchResult = cell.findElement(DocumentApp.ElementType.PARAGRAPH, searchResult)) {
       var paragraph = searchResult.getElement().asParagraph();
       paragraph.setSpacingBefore(0);
       paragraph.setSpacingAfter(settings.linespacingafter ? settings.linespacingafter : 0);
       paragraph.setLineSpacing(settings.linespacing ? settings.linespacing : 1);
       lastParagraph = paragraph;
     }
     if (lastParagraph && properties.underline)
       lastParagraph.appendHorizontalRule();
  }
}

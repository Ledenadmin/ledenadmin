describe("PermissionForm", function() {
  var settings = {
    verenigingsnaam : 'Vereniging',
    adresClub : 'adres',
    postcodeClub : 'postcode',
    plaatsClub : 'plaats',
    incassantId : 'incassantid',
    mandaatId : 'mandaatId',
    redenBetaling : 'reden',
    tenNameVan : 'tenNameVan',
    adres : 'adres',
    postcode : 'postcode',
    plaats : 'plaats',
    iban : 'iban'
  };
  var googleApiMock = new GoogleApiMock();
  var documentApp = googleApiMock.getDocumentApp();
  var body = new googleApiMock.Body();
  new PermissionForm(settings, body, documentApp).generate();
  var elements = body.getElements();
  
  beforeEach(function() {
  });

  it("has set document margins to 20", function() {
    var margins = body.getMargins();
    expect(margins.left).toEqual(50);
    expect(margins.right).toEqual(30);
    expect(margins.top).toEqual(20);
    expect(margins.bottom).toEqual(20);
  });
  
  it("has added 5 sections", function() {
    expect(elements.length).toEqual(5);
  });

  it("has added the expected headersection", function() {
    var table = [
      [{content : 'Doorlopende machtiging', color : '#93c47d'}, {content: ' '}, {content: 'SEPA', color : '#351c75'}]
    ];
    checkTable(elements[0], table, [100, 15, 400])
  });
  
  it("has a fontsize of 24 and a fontcolor of #ffffff", function () {
    var cell = elements[0].getCell(0, 0);
    expect(cell.editAsText().getTextSettings().fontSize).toEqual(24);
    expect(cell.editAsText().getTextSettings().fontColor).toEqual('#ffffff');
  });

  it("has added the expected clubfields", function() {
    var table = [
      [{content : 'Incassant:'}, {content: ' '}],
      [{content : 'Naam'}, {content: settings.verenigingsnaam}],
      [{content : 'Adres'}, {content: settings.adresClub}],
      [{content : 'Postcode, plaats'}, {content: settings.postcodeClub + ' ' + settings.plaatsClub}],
      [{content : 'Incassant ID'}, {content: settings.incassantId}],
      [{content : 'Kenmerk machtiging'}, {content: settings.mandaatId}],
      [{content : 'Reden betaling'}, {content: settings.redenBetaling}]
    ];
    checkTable(elements[1], table, [150, 365])
  });
  
  it("has made the first field bold and the second not", function() {
    expect(elements[1].getCell(0, 0).editAsText().getTextSettings().bold).toEqual(true);
    expect(elements[1].getCell(0, 1).editAsText().getTextSettings().bold).toEqual(false);
  });
  
  it ("has added the expected infobox", function() {
    var expectedText = 'Door ondertekening van dit formulier geeft u toestemming aan ' + 
      settings.verenigingsnaam + ' om doorlopende ' + 
      'incasso-opdrachten te sturen naar uw bank om een bedrag van uw rekening af te schijven en aan uw bank om ' +
      'doorlopend een bedrag van uw rekening af te schrijven overeenkomstig de opdracht van ' + settings.verenigingsnaam + '.\n\n' + 
      'Als u het niet eens bent met deze afschrijving kunt u deze laten terugboeken. Neem hiervoor binnen 8 weken na ' +
      'afschrijving contact op met uw bank. Vraag uw bank naar de voorwaarden.';
    checkCell(elements[2].getCell(0, 0).getProperties(), expectedText, 515, '#ffffff');
  });
  
  it("has put a border with width 1 and color #93c47d around the infobox", function() {
	expect(elements[2].getBorder()).toEqual({ width : 1, color : '#93c47d'});
  });
  
  it ("has added the memberfields with the correct border settings", function() {
    var table = [
      [{content : 'Naam'}, {content : settings.tenNameVan}],
      [{content : 'Adres'}, {content : settings.adres}],
      [{content : 'Postcode, plaats'}, {content : settings.postcode + ' ' + settings.plaats}],
      [{content : 'IBAN'}, {content : settings.iban}],
    ];
    checkTable(elements[3], table, [150, 365]);
  });
  
  it ("has sections with COURIER_NEW fontfamily", function () {
    var memberFields = elements[3];
    expect(memberFields.getCell(0, 0).editAsText().getTextSettings().fontFamily).toEqual('');
    expect(memberFields.getCell(0, 1).editAsText().getTextSettings().fontFamily).toEqual('COURIER_NEW');
    expect(memberFields.getCell(1, 1).editAsText().getTextSettings().fontFamily).toEqual('COURIER_NEW');
    expect(memberFields.getCell(2, 1).editAsText().getTextSettings().fontFamily).toEqual('COURIER_NEW');
    expect(memberFields.getCell(3, 1).editAsText().getTextSettings().fontFamily).toEqual('COURIER_NEW');
  });
  
  it ("has added the expected signSection", function() {
    var table = [
      [{content : 'Plaats en datum'}, {content : '\n\n'}],
      [{content : ' '}, {content : ''}],
      [{content : 'Handtekening'}, {content : '\n\n'}],
    ];
    checkTable(elements[4], table, [150, 365]);
  });
  
  it("finds underlined signSection paragraphs", function () {
    var signSection = elements[4];
    expectUnderlined(signSection.getCell(0, 0), false);
    expectUnderlined(signSection.getCell(0, 1), true);
    expectUnderlined(signSection.getCell(1, 0), false);
    expectUnderlined(signSection.getCell(1, 1), false);
    expectUnderlined(signSection.getCell(2, 0), false);
    expectUnderlined(signSection.getCell(2, 1), true);
  });
  
  var checkTable = function (section, table, columnWidths) {
    for (var i = 0; rows = table[i]; i++)
      checkRow(section, i, columnWidths, rows);
  }
  
  var checkRow = function(table, rowNumber, columnWidths, rows) {
    for (var i = 0; i < columnWidths.length; i++)
      checkCell(table.getCell(rowNumber, i).getProperties(), 
        rows[i].content, columnWidths[i], 
        rows[i].color ? rows[i].color : '#ffffff');
  }
  
  var checkCell = function(properties, content, width, color) {
	expect(properties).toEqual(jasmine.objectContaining({content : content, width : width, backgroundColor : color}));
  }
  
  var expectUnderlined = function (cell, isUnderlined) {
    var searchResult = null;
    for (var i = 0; i < 3; i++)
      searchResult = cell.findElement('PARAGRAPH', searchResult);
    var expectedUnderline = searchResult != null ? searchResult.getElement().asParagraph().getHorizontalRulesCount() : 0;
    expect(expectedUnderline).toEqual(isUnderlined ? 1 : 0);
  }
});

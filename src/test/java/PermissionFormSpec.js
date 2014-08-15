describe("PermissionForm", function() {
  var permissionForm, body, elements;
  var settings = {
	  verenigingsnaam : 'Vereniging',
	  adresClub : 'adres',
	  postcodeClub : 'postcode',
	  plaatsClub : 'plaats',
	  incassantId : 'incassantid',
	  kenmerk : 'kenmerk',
	  redenBetaling : 'reden',
	  tenNameVan : 'tenNameVan',
	  adres : 'adres',
	  postcode : 'postcode',
	  plaats : 'plaats',
	  iban : 'iban'
  };
  var googleApiMock = new org.ledenadmin.GoogleApiMock();
  var body = new googleApiMock.Body();
  
  beforeEach(function() {
    if (permissionForm) return;
    permissionForm = new org.ledenadmin.PermissionForm(settings, body, googleApiMock.DocumentApp);
	permissionForm.generate();
    elements = body.getElements();
  });

  it("has set document margins to 20", function() {
	var margins = body.getMargins();
    expect(margins.left).toEqual(20);
    expect(margins.right).toEqual(20);
    expect(margins.top).toEqual(20);
    expect(margins.bottom).toEqual(20);
  });
  
  it("has added 5 sections", function() {
	expect(elements.length).toEqual(5);
  });

  it("has added the expected headersection", function() {
    var headerSection = elements[0];
	checkCell(headerSection.getCell(0, 0).getProperties(), 'Doorlopende machtiging', 450, '#93c47d');
	checkCell(headerSection.getCell(0, 1).getProperties(), ' ', 25, '#ffffff');
	checkCell(headerSection.getCell(0, 2).getProperties(), 'SEPA', 100, '#351c75');
  });
  
  it("has a fontsize of 24 and a fontcolor of #ffffff", function () {
    var headerSection = elements[0];
	var cell = headerSection.getCell(0, 0);
	expect(cell.editAsText().getTextSettings().fontSize).toEqual(24);
	expect(cell.editAsText().getTextSettings().fontColor).toEqual('#ffffff');
  });

  it("has added the expected clubfields", function() {
    var clubFieldTable = elements[1];
	checkCell(clubFieldTable.getCell(0, 0).getProperties(), 'Incassant:', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(0, 1).getProperties(), ' ', 300, '#ffffff');
	checkCell(clubFieldTable.getCell(1, 0).getProperties(), 'Naam', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(1, 1).getProperties(), settings.verenigingsnaam, 300, '#ffffff');
	checkCell(clubFieldTable.getCell(2, 0).getProperties(), 'Adres', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(2, 1).getProperties(), settings.adresClub, 300, '#ffffff');
	checkCell(clubFieldTable.getCell(3, 0).getProperties(), 'Postcode, plaats', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(3, 1).getProperties(), settings.postcodeClub + ' ' + settings.plaatsClub, 300, '#ffffff');
	checkCell(clubFieldTable.getCell(4, 0).getProperties(), 'Incassant ID', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(4, 1).getProperties(), settings.incassantId, 300, '#ffffff');
	checkCell(clubFieldTable.getCell(5, 0).getProperties(), 'Kenmerk machtiging', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(5, 1).getProperties(), settings.kenmerk, 300, '#ffffff');
	checkCell(clubFieldTable.getCell(6, 0).getProperties(), 'Reden betaling', 150, '#ffffff');
	checkCell(clubFieldTable.getCell(6, 1).getProperties(), settings.redenBetaling, 300, '#ffffff');
  });
  
  it("has made the first field bold and the second not", function() {
    var clubFieldTable = elements[1];
	expect(clubFieldTable.getCell(0, 0).editAsText().getTextSettings().bold).toEqual(true);
	expect(clubFieldTable.getCell(0, 1).editAsText().getTextSettings().bold).toEqual(false);
  });
  
  it ("has added the expected infobox", function() {
    var infoBox = elements[2];
	var expectedText = 'Door ondertekening van dit formulier geeft u toestemming aan ' + settings.verenigingsnaam + ' om doorlopende ' + 
      'incasso-opdrachten te sturen naar uw bank om een bedrag van uw rekening af te schijven en aan uw bank om ' +
      'doorlopend een bedrag van uw rekening af te schrijven overeenkomstig de opdracht van ' + settings.verenigingsnaam + '.\n\n' + 
      'Als u het niet eens bent met deze afschrijving kunt u deze laten terugboeken. Neem hiervoor binnen 8 weken na ' +
      'afschrijving contact op met uw bank. Vraag uw bank naar de voorwaarden.';
	var cell = infoBox.getCell(0, 0);
	checkCell(cell.getProperties(), expectedText, 575, '#ffffff');
  });
  
  it("has put a border with width 1 and color #93c47d around the infobox", function() {
    var infoBox = elements[2];
	var border = infoBox.getBorder();
	expect(border.width).toEqual(1);
	expect(border.color).toEqual('#93c47d');
  });
  
  it ("has added the memberfields with the correct border settings", function() {
    var memberFields = elements[3];
	checkCell(memberFields.getCell(0, 0).getProperties(), 'Naam', 150, '#ffffff');
	checkCell(memberFields.getCell(0, 1).getProperties(), settings.tenNameVan, 300, '#ffffff');
	checkCell(memberFields.getCell(1, 0).getProperties(), 'Adres', 150, '#ffffff');
	checkCell(memberFields.getCell(1, 1).getProperties(), settings.adres, 300, '#ffffff');
	checkCell(memberFields.getCell(2, 0).getProperties(), 'Postcode, plaats', 150, '#ffffff');
	checkCell(memberFields.getCell(2, 1).getProperties(), settings.postcode + ' ' + settings.plaats, 300, '#ffffff');
	checkCell(memberFields.getCell(3, 0).getProperties(), 'IBAN', 150, '#ffffff');
	checkCell(memberFields.getCell(3, 1).getProperties(), settings.iban, 300, '#ffffff');
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
    var signSection = elements[4];
	checkCell(signSection.getCell(0, 0).getProperties(), 'Plaats en datum', 150, '#ffffff');
	checkCell(signSection.getCell(0, 1).getProperties(), '\n\n', 300, '#ffffff');
	checkCell(signSection.getCell(1, 0).getProperties(), ' ', 150, '#ffffff');
	checkCell(signSection.getCell(1, 1).getProperties(), '', 300, '#ffffff');
	checkCell(signSection.getCell(2, 0).getProperties(), 'Handtekekening', 150, '#ffffff');
	checkCell(signSection.getCell(2, 1).getProperties(), '\n\n', 300, '#ffffff');
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
  
  var checkCell = function(properties, content, width, color) {
	expect(properties.content).toEqual(content);
	expect(properties.width).toEqual(width);
	expect(properties.backgroundColor).toEqual(color);
  }
  
  var expectUnderlined = function (cell, isUnderlined) {
	var searchResult = null;
	for (var i = 0; i < 3; i++)
	  searchResult = cell.findElement('PARAGRAPH', searchResult);
	var expectedUnderline = searchResult != null ? searchResult.getElement().asParagraph().getHorizontalRulesCount() : 0;
	expect(expectedUnderline).toEqual(isUnderlined ? 1 : 0);
  }
});

var GoogleApiMock = function() {
  var googleApiMock = this;
  this.DocumentApp = { FontFamily : { COURIER_NEW : 'COURIER_NEW' }, ElementType : { PARAGRAPH : 'PARAGRAPH' } }

  this.Text = function(content) {
    var textSettings = { fontSize : 0, bold  : false, fontFamily : '', fontColor : '' }

    this.getText = function () {return content;}
	this.setForegroundColor = function (firstIndex, lastIndex, color) { textSettings.fontColor = color; }
	this.setFontSize = function(size) { textSettings.fontSize = size; }
	this.setBold = function(bold) { textSettings.bold = bold; }
	this.setFontFamily = function(family) { textSettings.fontFamily = family; }
	this.getTextSettings = function() { return textSettings; }
  }
  this.Paragraph = function (content) {
    var settings = { spacingBefore: 0, spacingAfter : 0, lineSpacing : 0}
	var horizontalRules = [];
	
    this.setSpacingBefore = function(spacing) { settings.spacingBefore = spacing; }
	this.setSpacingAfter = function (spacing) { settings.spacingAfter = spacing; }
	this.setLineSpacing = function(spacing) { settings.lineSpacing = spacing; }
	this.appendHorizontalRule = function() { if (content != '') horizontalRules.push(''); }
	this.getHorizontalRulesCount = function() { return horizontalRules.length; }
	this.getText = function() { return content; }
  }
  this.Element = function(content) {
    var paragraph = new googleApiMock.Paragraph(content);
	this.asParagraph = function() { return paragraph; }
  }
  this.SearchResult = function(content) {
    var element = new googleApiMock.Element(content);
    this.getElement = function() { return element; }
  }
  this.Cell = function(content) {
	var properties = { content : content, text : new googleApiMock.Text(content), backgroundColor : '', width : 0 }
	var getSearchResults = function() {
      var elements = content.split('\n');
	  var results = new Array(elements.length);
	  for (var i = 0, element; element = i < elements.length ? elements[i] ? elements[i] : ' ' : false; i++)
	    results[i] = new googleApiMock.SearchResult(element);
	  return results;
	}
	var searchResults = getSearchResults();
	var currentIndex;
	
	this.getProperties = function() { return properties; }
    this.setBackgroundColor = function(backgroundColor) { properties.backgroundColor = backgroundColor; }
	this.setWidth = function(width) { properties.width = width; }
	this.editAsText = function() { return properties.text;}
	this.findElement = function(type, result) {
	  if (type != 'PARAGRAPH')
	    return null;
      if (result == null)
	    currentIndex = 0;
	  return result = (currentIndex < searchResults.length ? searchResults[currentIndex++] : null);
	}
  }
  this.Table = function(rows) {
    var getRowCells = function(row) {
	  this.cells = [];
	  for (var i = 0; i < row.length; i++)
		this.cells.push(new googleApiMock.Cell(row[i]));
	}
    var getCells = function(rows) {
      this.rows = [];
	  for (var i = 0, row; row = rows[i]; i++)
	    this.rows.push(new getRowCells(row));
	}
    var cells = new getCells(rows);
	var border = { width : 0, color : ''};

    this.setBorderWidth = function(width) { border.width = width; }
    this.setBorderColor = function(color) { border.color = color; }
	this.getCell = function(row, column) { return cells.rows[row].cells[column]; }
	this.getBorder = function () { return border; }
  }
  this.Body = function() {
    var margins = { left : 0, right : 0, top : 0, bottom : 0 }

	this.elements = [];
	this.getMargins = function() { return margins; }
	this.getElements = function() { return this.elements; }
    this.setMarginBottom = function(margin) { margins.bottom = margin; }
    this.setMarginTop = function(margin) { margins.top = margin; }
    this.setMarginLeft = function(margin) { margins.left = margin; }
    this.setMarginRight = function(margin) { margins.right = margin; }
	this.appendTable = function (rows) { 
	   var table = new googleApiMock.Table(rows);
	   this.elements.push(table);
	   return table;
	}
  }
}

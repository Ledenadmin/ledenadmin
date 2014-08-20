var GoogleApiMock = function() {
  var googleApiMock = this;
  var DocumentApp = { FontFamily : { COURIER_NEW : 'COURIER_NEW' }, ElementType : { PARAGRAPH : 'PARAGRAPH' } }

  this.getDocumentApp = function() { return DocumentApp; }
  this.getSpreadSheetApp = function() { return new googleApiMock.SpreadSheetApp(); }
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
    this.appendHorizontalRule = function() { horizontalRules.push(''); }
    this.getHorizontalRulesCount = function() { return horizontalRules.length; }
    this.getText = function() { return content; }
  }
  this.Element = function(content) {
    var paragraph = new googleApiMock.Paragraph(content);
    this.asParagraph = function() { return paragraph; }
  }
  this.SearchResult = function(type, content) {
    var element = new googleApiMock.Element(content);
    this.getType = function() { return type; }
    this.getElement = function() { return element; }
  }
  this.Cell = function(content) {
    var properties = { content : content, text : new googleApiMock.Text(content), backgroundColor : '', width : 0 }
    var getType = function(content) { return content == '' ? '' : DocumentApp.ElementType.PARAGRAPH; }
    var getSearchResults = function() {
      var elements = content.split('\n');
      var results = new Array(elements.length);
      for (var i = 0; i < elements.length; i++)
        results[i] = new googleApiMock.SearchResult(elements[i], getType(content));
      return results;
    }
    var searchResults = getSearchResults();
  
    this.getProperties = function() { return properties; }
    this.setBackgroundColor = function(backgroundColor) { properties.backgroundColor = backgroundColor; }
    this.setWidth = function(width) { properties.width = width; }
    this.editAsText = function() { return properties.text;}
    this.findElement = function(type, result) {
      var getNextResult = function () { return currentIndex < searchResults.length ? searchResults[currentIndex++] : null; }
      if (result == null)
        var currentIndex = 0;
      result = getNextResult();
      while (currentIndex < searchResults.length && result.getType() != type)
        result = getNextResult();
      return result;
    }
  }
  this.Table = function(rows) {
    var getRowCells = function(row) {
      this.cells = [];
      for (var i = 0; i < row.length; i++)
        this.cells[i] = new googleApiMock.Cell(row[i]);
    }
    var getCells = function(rows) {
      this.rows = [];
      for (var i = 0; i < rows.length; i++)
        this.rows[i] = new getRowCells(rows[i]);
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
    var elements = [];

    this.getMargins = function() { return margins; }
    this.getElements = function() { return elements; }
    this.setMarginBottom = function(margin) { margins.bottom = margin; }
    this.setMarginTop = function(margin) { margins.top = margin; }
    this.setMarginLeft = function(margin) { margins.left = margin; }
    this.setMarginRight = function(margin) { margins.right = margin; }
    this.appendTable = function (rows) { return elements[elements.length] = new googleApiMock.Table(rows); }
  }
  this.Range = function(sheet, rows, dimensions) {
	var getDimensions = function(row, column, numRows, numColumns) {
	  return { row : row, numRows : numRows, column : column, numColumns : numColumns };
	}
    this.sheet = sheet;
	this.dimensions = arguments.length < 3 ? getDimensions(0, 0, 0, 0) : dimensions;
	this.rows = arguments.length < 2 ? [] : rows;
	this.getValue = function() { return this.rows[this.dimensions.row][this.dimensions.column]; }
	this.getValues = function() { return this.rows; }
	this.getLastRow = function() { return this.dimensions.numRows - 1; }
	this.getLastColumn = function() { return this.dimensions.numColumns - 1; }
	this.getRange = function(row, column, numRows, numColumns) { 
	  var offset = getDimensions(row + this.dimensions.row, column + this.dimensions.column, numRows, numColumns);
      return new googleApiMock.Range(this.sheet, this.rows, offset);
	}
	this.setValue = function(val) {
	  this.rows[this.dimensions.row][this.dimensions.column] = val;
	}
	this.setValues = function(values) {
      for (var r = 0; r < values.length; r++)
        for (var c = 0; c < values[r].length; c++) {
		  if (!this.rows[this.dimensions.row + r])
		    this.rows[this.dimensions.row + r] = [];
          this.rows[this.dimensions.row + r][this.dimensions.column + c] = values[r][c];
		}
	  this.dimensions.numRows = Math.max(this.dimensions.numRows, this.dimensions.row + 1 + values.length);
	  this.dimensions.numColumns = Math.max(this.dimensions.numColumns, this.dimensions.column + 1 + values[0].length);
	}
  }
  this.Sheet = function(name) {
    var range = new googleApiMock.Range(this);
    this.getDataRange = function () { return range;	}
	this.getRange = function(row, column, numRows, numColumns) {
	  return range.getRange(row, column, numRows, numColumns);
	}
	this.getSheetValues = function(startRow, startColumn, numRows, numColumns) {
	  return range.getValues();
	}
	this.getLastRow = function() { return range.getLastRow(); }
	this.getLastColumn = function() { return range.getLastColumn(); }
  }
  this.SpreadSheet = function() {
    var sheets = [];
    this.insertSheet = function(sheetName) {
	  return (sheets[sheetName] = new googleApiMock.Sheet(sheetName));
	}
    this.getSheetByName = function(name) {
	  return sheets[name];
	}
  }
  this.SpreadSheetApp = function() {
    var activeSpreadSheet = new googleApiMock.SpreadSheet();
    this.getActiveSpreadSheet = function() {
	  return activeSpreadSheet;
	}
  }
  this.getUtilities = function() {
    this.formatDate = function(date, timeZone, format) { return date; }
  }
}

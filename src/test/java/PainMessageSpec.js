describe("PainMessage", function() {
  var painMessage;
  var debtors;
  var settings;
  
  beforeEach(function() {
    debtors = [
		{	instdamt : 5, mndtid : 'MNDT001',  amdmntind : false,  dbtrnm : 'Debtor1', dtofsgntr : '2013-12-11',
		    dbtriban : 'NL91ABNA0417164300', dbtrustrd : 'Message',  seqtp : 'FRST'},
		{  instdamt : 5, mndtid : 'MNDT002',  amdmntind : false,  dbtrnm : 'Debtor2', dtofsgntr : '2013-12-11',
		   dbtriban : 'NL91ABNA0417164300', dbtrustrd : 'Message',  seqtp : 'RCUR'}
	];
	settings = {
		endtoendid : '127679340',
		incassodate : '2013-12-11',
		creationdatetime : '2013-12-11T11:11:11',
		initiatingparty : 'Vereniging',
		initiatingiban : 'NL91ABNA0417164300',
		initiatingbic : 'RABONL4U',
		initiatingcreditoridentifier : 'NLZZZ'
	};
    painMessage = new PainMessage(settings);
  });

  it("should generate the correct xml", function() {
    expect(painMessage.getXml(debtors)).toEqual("<Document xmlns='urn:iso:std:iso:20022:tech:xsd:pain.008.001.02' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'><CstmrDrctDbtInitn><GrpHdr><MsgId>1276793402013-12-11</MsgId><CreDtTm>2013-12-11T11:11:11</CreDtTm><NbOfTxs>2</NbOfTxs><InitgPty><Nm>Vereniging</Nm></InitgPty></GrpHdr><PmtInf xmlns='urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'><PmtInfId>127679340-FRST</PmtInfId><PmtMtd>DD</PmtMtd><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl><LclInstrm><Cd>CORE</Cd></LclInstrm><SeqTp>FRST</SeqTp></PmtTpInf><ReqdColltnDt>2013-12-11</ReqdColltnDt><Cdtr><Nm>Vereniging</Nm><PstlAdr><Ctry>NL</Ctry></PstlAdr></Cdtr><CdtrAcct><Id><IBAN>NL91ABNA0417164300</IBAN></Id></CdtrAcct><CdtrAgt><FinInstnId><BIC>RABONL4U</BIC></FinInstnId></CdtrAgt><UltmtCdtr><Nm>Vereniging</Nm></UltmtCdtr><ChrgBr>SLEV</ChrgBr><CdtrSchmeId><Id><PrvtId><Othr><Id>NLZZZ</Id><SchmeNm><Prtry>SEPA</Prtry></SchmeNm></Othr></PrvtId></Id></CdtrSchmeId><DrctDbtTxInf xmlns='urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'><PmtId><EndToEndId>127679340-MNDT001</EndToEndId></PmtId><InstdAmt Ccy='EUR'>5</InstdAmt><DrctDbtTx><MndtRltdInf><MndtId>MNDT001</MndtId><DtOfSgntr>2013-12-11</DtOfSgntr><AmdmntInd>false</AmdmntInd></MndtRltdInf></DrctDbtTx><DbtrAgt><FinInstnId/></DbtrAgt><Dbtr><Nm>Debtor1</Nm><PstlAdr><Ctry>NL</Ctry></PstlAdr></Dbtr><DbtrAcct><Id><IBAN>NL91ABNA0417164300</IBAN></Id></DbtrAcct><UltmtDbtr><Nm>Debtor1</Nm></UltmtDbtr><RmtInf><Ustrd>Message</Ustrd></RmtInf></DrctDbtTxInf></PmtInf><PmtInf xmlns='urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'><PmtInfId>127679340-RCUR</PmtInfId><PmtMtd>DD</PmtMtd><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl><LclInstrm><Cd>CORE</Cd></LclInstrm><SeqTp>RCUR</SeqTp></PmtTpInf><ReqdColltnDt>2013-12-11</ReqdColltnDt><Cdtr><Nm>Vereniging</Nm><PstlAdr><Ctry>NL</Ctry></PstlAdr></Cdtr><CdtrAcct><Id><IBAN>NL91ABNA0417164300</IBAN></Id></CdtrAcct><CdtrAgt><FinInstnId><BIC>RABONL4U</BIC></FinInstnId></CdtrAgt><UltmtCdtr><Nm>Vereniging</Nm></UltmtCdtr><ChrgBr>SLEV</ChrgBr><CdtrSchmeId><Id><PrvtId><Othr><Id>NLZZZ</Id><SchmeNm><Prtry>SEPA</Prtry></SchmeNm></Othr></PrvtId></Id></CdtrSchmeId><DrctDbtTxInf xmlns='urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'><PmtId><EndToEndId>127679340-MNDT002</EndToEndId></PmtId><InstdAmt Ccy='EUR'>5</InstdAmt><DrctDbtTx><MndtRltdInf><MndtId>MNDT002</MndtId><DtOfSgntr>2013-12-11</DtOfSgntr><AmdmntInd>false</AmdmntInd></MndtRltdInf></DrctDbtTx><DbtrAgt><FinInstnId/></DbtrAgt><Dbtr><Nm>Debtor2</Nm><PstlAdr><Ctry>NL</Ctry></PstlAdr></Dbtr><DbtrAcct><Id><IBAN>NL91ABNA0417164300</IBAN></Id></DbtrAcct><UltmtDbtr><Nm>Debtor2</Nm></UltmtDbtr><RmtInf><Ustrd>Message</Ustrd></RmtInf></DrctDbtTxInf></PmtInf></CstmrDrctDbtInitn></Document>");
  });
});

var PainMessage = function (settings) {
  var nameSpace = "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02";
  var nbOfTxsFRST = 0; 
  var nbOfTxsRCUR = 0;
  var updateTransactionCount = function(isFirst) { if (isFirst) nbOfTxsFRST++; else nbOfTxsRCUR++; }
  var addTransaction = function(pmtInf, xml, isFirst) { 
    pmtInf.addContent(xml); 
    updateTransactionCount(isFirst);
  }
  var getDrctDbtTxInfXml = function (debtor) {
    this.getXml = function () { 
      return "<DrctDbtTxInf xmlns='" + nameSpace + "'>" +
               "<PmtId><EndToEndId>" + settings.endtoendid + "-" + debtor.mndtid + "</EndToEndId></PmtId>" +
               "<InstdAmt Ccy='EUR'>" + debtor.instdamt + "</InstdAmt>" + 
               "<DrctDbtTx>" + 
                 "<MndtRltdInf>" +
                   "<MndtId>" + debtor.mndtid + "</MndtId>" +
                   "<DtOfSgntr>" + debtor.dtofsgntr + "</DtOfSgntr>" +
                   "<AmdmntInd>" + debtor.amdmntind + "</AmdmntInd>" +
                 "</MndtRltdInf>" + 
               "</DrctDbtTx>" +
               "<DbtrAgt><FinInstnId/></DbtrAgt>" + 
               "<Dbtr>" +
                 "<Nm>" + debtor.dbtrnm + "</Nm>" +
                 "<PstlAdr><Ctry>NL</Ctry></PstlAdr>" + 
               "</Dbtr>" +
               "<DbtrAcct><Id><IBAN>" + debtor.dbtriban + "</IBAN></Id></DbtrAcct>" +
               "<UltmtDbtr><Nm>" + debtor.dbtrnm + "</Nm></UltmtDbtr>" +
               "<RmtInf><Ustrd>" + debtor.dbtrustrd + "</Ustrd></RmtInf>" + 
             "</DrctDbtTxInf>";
    }
  }
  var getPmtInfXml = function (paymentType) {
    var xml = "";
    this.addContent = function (contentXml) { xml += contentXml; }
    this.getXml = function () { 
      if (xml == "")
        return xml;
      return "<PmtInf xmlns='" + nameSpace + "'>" +
              "<PmtInfId>" + settings.endtoendid + '-' + paymentType + "</PmtInfId>" +
              "<PmtMtd>DD</PmtMtd>" +
              "<PmtTpInf>" +
                "<SvcLvl><Cd>SEPA</Cd></SvcLvl>" +
                "<LclInstrm><Cd>CORE</Cd></LclInstrm>" +
                "<SeqTp>" + paymentType + "</SeqTp>" +
              "</PmtTpInf>" +
              "<ReqdColltnDt>" + settings.incassodate.split('T')[0] + "</ReqdColltnDt>" +
              "<Cdtr>" +
                "<Nm>" + settings.initiatingparty + "</Nm>" +
                "<PstlAdr><Ctry>NL</Ctry></PstlAdr>" +
              "</Cdtr>" +
              "<CdtrAcct><Id><IBAN>" + settings.initiatingiban + "</IBAN></Id></CdtrAcct>" +
              "<CdtrAgt><FinInstnId><BIC>" + settings.initiatingbic + "</BIC></FinInstnId></CdtrAgt>" +
              "<UltmtCdtr><Nm>" + settings.initiatingparty + "</Nm></UltmtCdtr>" +
              "<ChrgBr>SLEV</ChrgBr>" +
              "<CdtrSchmeId>" +
                "<Id>" +
                  "<PrvtId>" +
                    "<Othr>" +
                     "<Id>" + settings.initiatingcreditoridentifier + "</Id>" +
                     "<SchmeNm><Prtry>SEPA</Prtry></SchmeNm>" +
                    "</Othr>" +
                  "</PrvtId>" +
                "</Id>" +
              "</CdtrSchmeId>" +
              xml +
            "</PmtInf>";
    }
  }
  var getDocumentXml = function (xml) {
    return "<Document xmlns='" + nameSpace + "' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" +
               "<CstmrDrctDbtInitn>" +
                 "<GrpHdr>" +
                   "<MsgId>" + settings.endtoendid + settings.creationdatetime.split('T')[0] + "</MsgId>" +
                   "<CreDtTm>" + settings.creationdatetime + "</CreDtTm>" +
                   "<NbOfTxs>" + (nbOfTxsFRST + nbOfTxsRCUR) + "</NbOfTxs>" +
                   "<InitgPty><Nm>" + settings.initiatingparty + "</Nm></InitgPty>" +
                 "</GrpHdr>" +
                 xml + 
               "</CstmrDrctDbtInitn>" +
             "</Document>";
  }
  this.getXml = function(debtors) {
    var isFirst = function (flag) { return flag == 'FRST'; }
    var pmtInfFRST = new getPmtInfXml('FRST');
    var pmtInfRCUR = new getPmtInfXml('RCUR');

    for (var i = 0, debtor; debtor = debtors[i]; i++)
      addTransaction(isFirst(debtor.seqtp) ? pmtInfFRST : pmtInfRCUR, new getDrctDbtTxInfXml(debtor).getXml(), isFirst(debtor.seqtp));
     
    return getDocumentXml(pmtInfFRST.getXml() + pmtInfRCUR.getXml());
  }
}

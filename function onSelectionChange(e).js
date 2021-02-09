function onSelectionChange(e) 
{

  // Set background to red if a single empty cell is selected.
  var range = e.range;
  var sheet = range.getSheet();

var Treecell
var LastTree
var LastResearch = range.getValue()
var LastTree_eng
var LastResearch_eng
var LCARScommand
var levelfound
var Effectname
var Effectsheet
var Effectcell
 
if (sheet.getName() == 'Forschungsbaum')
{

  if (range.getRow() > 4)
  {
    //Research analysis
    Logger.log('Sheet: ' + range.getSheet().getName() + ' Range: ' + range.getA1Notation());
    
    if (range.getRow() < 41 && range.getRow() > 4)
    {
    Treecell = sheet.getRange(5,1);}
    
    if (range.getRow() >= 41 && range.getRow() < 77)
    {
    Treecell = sheet.getRange(41,1);}
    
    if (e.range.getRow() >= 77 && range.getRow() < 111)
    {
    Treecell = sheet.getRange(77,1);}
    
    if (e.range.getRow() >= 111 && range.getRow() < 148)
    {
    Treecell = sheet.getRange(111,1);}
    
    if (range.getRow() >= 148 && range.getRow() < 170)
    {
    Treecell = sheet.getRange(148,1);}
    
    LastTree = Treecell.getValue();

    Logger.log('Treecell: '+ Treecell.getValue());
    sheet.getRange(2,1).setValue(LastTree);
    Logger.log('Forschung: '+ LastResearch);
    sheet.getRange(2,5).setValue(range.getValue());
    
    
    //find correct resaerch sheet name
      let Findsheet = Researchsheet(Treecell.getValue());
    
      Logger.log('Findsheet: '+ Findsheet);
      sheet.getRange(2,3).setValue(Findsheet); 

    //find the german research in research sheet and return english research  
      let LastResearch_engcell = Researchcell(e,Findsheet,LastResearch);

      Logger.log(LastResearch_engcell.getValue());

      if (LastResearch_engcell.getValue() != "-"){

        Logger.log(LastResearch_engcell);
        
        let LastResearch_eng = LastResearch_engcell.getValue()

    
        
        let row = LastResearch_engcell.getRow()
        
        levelfound = e.source.getSheetByName(Findsheet).getRange(row,6).getValue();
        Logger.log(levelfound);
        
        Logger.log ("found row " + row.toString() + " in sheet " +Findsheet + " : " + LastResearch_eng );
        sheet.getRange(2,7).setValue(LastResearch_eng);   
        
        if (levelfound != '' &&  levelfound != 'Max' ){
          LCARScommand = '!res \"' + LastResearch_eng +'\" '+ levelfound;
          sheet.getRange(2,8).setValue(levelfound);}
        else{
          LCARScommand = '!res \"' + LastResearch_eng + '\"';
          sheet.getRange(2,8).setValue('');
        }
        
        sheet.getRange(2,9).setValue(LCARScommand);    
        
        var Effectlist=e.source.getSheetByName('Effect list');
        
        data = Effectlist.getRange(1, 3, 1000).getValues();
        Logger.log(data);
        row = data.findIndex(researches => {return researches[0] == LastResearch_eng})+1; 
        Logger.log('Effectrow' + row.toString());
        
        var Effectcell = Findsheet.concat('!G').concat(row.toString());
        
        if (row > 0){
        Effectname = Effectlist.getRange(row,2).getValue();
        Logger.log('Effectcell:'+Effectcell);
        //sheet.getRange(2,14).setValue(Effectcell); 
        }
        else {
        Effectname = 'NO EFFECT';
        Logger.log('no effect');
        //sheet.getRange(2,14).setValue('-'); 
        }
          
        sheet.getRange(2,10).setValue(Effectname); 
        sheet.getRange(2,11).setValue(''); 
        sheet.getRange(2,12).setValue(''); 
        sheet.getRange(2,13).setValue(''); 
        sheet.getRange(2,14).setValue('');
      }
      else  
        {
          sheet.getRange(2,7).setValue("-");
          sheet.getRange(2,8).setValue("-");
          sheet.getRange(2,9).setValue("-");
          sheet.getRange(2,10).setValue("-");
        }  
    }
  else if (range.getRow() == 2)
  {
    if  (range.getColumn() == 11)
    {
      AnalyzeBonus(sheet,e);
     }   

     else if (range.getColumn() == 8)
      {
        AnalyzeLevel(range,sheet)
      }  
      else if (range.getColumn() == 4)
      {
        Logger.log('Analyze full paste');
        AnalyzeDetails(sheet,e);
      }  
       
   }    
}
else if (sheet.getName() == 'Ship LCARS Processor1')
  if (range.getRow() == 2)
  {
    if  (range.getColumn() == 2)
    {
      AnalyzeShips(sheet,e,'Ship LCARS Processor1');
     }   
  }
}
 
function Researchsheet(Treename)
{

var Findsheet;
  
  switch (Treename){
      case 'Kämpfe':{
      Findsheet ='Research Combat';}
            break;
      case 'Station':{
      Findsheet ='Research Station';}
            break;
      case 'Galaxie':{
      Findsheet ='Research Galaxy';}
            break;
      case 'Gesetzloser':{
      Findsheet ='Research Outlaw';}
            break;
      case 'Gebiet':{
      Findsheet ='Research Territory';}
            break;
            default:
      }
      
return Findsheet;
}
 
function Researchcell (e,Researchsheet,GermanResearch)
{


    let data = e.source.getSheetByName(Researchsheet).getRange(1, 1, 1000).getValues();
    let row = data.findIndex(researches => {return researches[0] == GermanResearch})+1; 
    let LastResearch_engcell = e.range.getSheet().getRange(1,2)
    Logger.log('Researchcell:'+row.toString());
    if (row != 0){
         Logger.log("return value");
         LastResearch_engcell = e.source.getSheetByName(Researchsheet).getRange(row,2);
    }
   
   return LastResearch_engcell ;
}

function Shipscell (Shipsheet,LCARSCommand)
{

    let ShipData=LCARSCommand.split(' Tier' )
    //Logger.log(ShipData);
    let Ship = ShipData[0].split('!')[1]
    let Level = ShipData[1]
    let data = Shipsheet.getRange(1, 1, 1000).getValues();
    let row = data.findIndex(researches => {return researches[0] == Ship})+1; 
    let Shipcell = Shipsheet.getRange(row,1)
    if (Level>0){
      Shipcell = Shipsheet.getRange(row+Number(Level)-1,1)
    }   
   return Shipcell ;
}
function AnalyzeBonus(sheet,e)
{
  //Bonusvalue entered 
      sheet.getRange(2,12).setValue(''); 
      sheet.getRange(2,13).setValue(''); 
      sheet.getRange(2,14).setValue('');
      
      var LCARSbonus;
      var LCARSBonusrange = range;
      
      var LCARSBonusstring = LCARSBonusrange.getValue().toString();
      
        Logger.log(LCARSBonusstring);
        
      if ((sheet.getRange(2,3).getValue() != '') && (sheet.getRange(2,5).getValue() != '') && (LCARSBonusstring != '')){
        //get correct sheet and cell from reasearch data
           
        
        Effectsheet = Researchsheet(sheet.getRange(2,1).getValue());
        Logger.log('Effectsheet for the entered alue:' +Effectsheet);
        Effectcell = Researchcell(e,Effectsheet,sheet.getRange(2,5).getValue());


        if (Effectcell != "-"){
          Logger.log(Effectcell.getA1Notation());
          let Effectsheetobject =  e.source.getSheetByName(Effectsheet)
          
          let Effectrow = Effectcell.getRow()-1+sheet.getRange(2,8).getValue()
          
          Effectsheetobject.getRange(Effectrow,7).setValue(sheet.getRange(2,10).getValue());
                  
        // Effectcell.setValue(sheet.getRange(2,10).getValue())
          
          if (LCARSBonusstring.search('%') > 0) {
            LCARSbonus = LCARSBonusrange.getValue().replace(/[^0-9]/g, "")
            LCARSbonus = 1+ LCARSbonus / 10000 
            sheet.getRange(2,12).setValue(LCARSbonus);  
            Effectsheetobject.getRange(Effectrow,8).setValue(LCARSbonus);
            sheet.getRange(2,14).setValue('OK');
          }
          else 
          {
            LCARSbonus = LCARSBonusrange.getValue();
            sheet.getRange(2,13).setValue(LCARSbonus);  
            Effectsheetobject.getRange(Effectrow,9).setValue(LCARSbonus);
            sheet.getRange(2,14).setValue('OK');
          }
        }else{
          sheet.getRange(2,12).setValue(LCARSbonus)
        }  
      }  
      else
      {
        /*
        sheet.getRange(2,7).setValue("-");
        sheet.getRange(2,8).setValue("-");
        sheet.getRange(2,9).setValue("-");
        sheet.getRange(2,10).setValue("-");
        */
      }
}

function AnalyzeDetails(sheet,e)
{
  //Bonusvalue entered 
      sheet.getRange(2,12).setValue(''); 
      sheet.getRange(2,13).setValue(''); 
      sheet.getRange(2,14).setValue('');
      
      var LCARSbonus;

      let LCARSDetailstring = sheet.getRange('D2:D18');
        
      if ((sheet.getRange(2,3).getValue() != '') && (sheet.getRange(2,5).getValue() != '') && (LCARSDetailstring != '')){

       //get correct sheet and cell from reasearch data 
        Effectsheet = Researchsheet(sheet.getRange(2,1).getValue());
        Logger.log('Effectsheet for the entered alue:' +Effectsheet);
        Effectcell = Researchcell(e,Effectsheet,sheet.getRange(2,5).getValue());

        Logger.log('EffectCell' + Effectcell.getA1Notation())

        if (Effectcell != "-"){
          Logger.log(Effectcell.getA1Notation());
          let Effectsheetobject =  e.source.getSheetByName(Effectsheet)
          
          let Effectrow = Effectcell.getRow()-1+sheet.getRange(2,8).getValue()
          Logger.log(Effectrow);
          //get Preresearches
          let LCARSArray = LCARSArrayfromCell1(sheet.getRange(4,4));

          LCARSArray.forEach(function(Prec,i)
          {
            Effectsheetobject.getRange(Effectrow,10+i).setValue(Prec[0]+' #'+Prec[1]);
          })

          //get Costs
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(10,4),'   ',' ');
          LCARSArray.forEach(function(Prec,i)
          {
            Effectsheetobject.getRange(Effectrow,17+i*2-1).setValue(Prec[1]);
            Effectsheetobject.getRange(Effectrow,17+i*2).setValue(Prec[0]);
          })

          //get Time
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(12,4),'Seconds:',' **');
            Effectsheetobject.getRange(Effectrow,14).setValue(LCARSArray[1][0]);

          //get Powerincrease
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(14,4),'Increase: ','');
            Effectsheetobject.getRange(Effectrow,15).setValue(LCARSArray[1]);

          
        }else{
          sheet.getRange(2,12).setValue(LCARSbonus)
        }  
      }  
      else
      {
        /*
        sheet.getRange(2,7).setValue("-");
        sheet.getRange(2,8).setValue("-");
        sheet.getRange(2,9).setValue("-");
        sheet.getRange(2,10).setValue("-");
        */
      }
}

function LCARSArrayfromCell1(theCell){


       var LCARSDetailstring = theCell.getValue().toString();
      
        Logger.log(LCARSDetailstring);
        let LCARSDetails = LCARSDetailstring.split(')');
        LCARSDetails.forEach(function(LCARSDetail, i)
        {
          LCARSDetail = LCARSDetail.split('(');
          Logger.log(LCARSDetail)
          LCARSDetails[i]=LCARSDetail;
        })
        LCARSDetails.splice(LCARSDetails.length-1,1);
        Logger.log (LCARSDetails);
        return LCARSDetails
}

function LCARSArrayfromCell2(theCell,splitter1,splitter2){


       var LCARSDetailstring = theCell.getValue().toString();
      
        //Logger.log(LCARSDetailstring);
        let LCARSDetails = LCARSDetailstring.split(splitter1);
        if (splitter2!=''){
          LCARSDetails.forEach(function(LCARSDetail, i)
          {
            LCARSDetail = LCARSDetail.split(splitter2);
            //Logger.log(LCARSDetail)
            LCARSDetails[i]=LCARSDetail.toString().trim();
          })
                  
        }
        //LCARSDetails.splice(LCARSDetails.length-1,1);
        Logger.log (LCARSDetails);
        return LCARSDetails
}

function LCARSArrayfromCell3(theCell,splitter1,splitter2){


       var LCARSDetailstring = theCell.getValue().toString();
      
        Logger.log(LCARSDetailstring);
        Logger.log(splitter2);
        let LCARSDetails = LCARSDetailstring.split(splitter1);
        if (splitter2!=''){
          LCARSDetails.forEach(function(LCARSDetail, i)
          {
            LCARSDetail = LCARSDetail.toString();
            LCARSDetail = LCARSDetail.replace(',','');
            LCARSDetail = LCARSDetail.substr(1,LCARSDetail.search(',')-1) + LCARSDetail.substr(LCARSDetail.search(',')+1,LCARSDetail.length-LCARSDetail.search(','));
            //Logger.log(LCARSDetail);
            LCARSDetail = LCARSDetail.split(splitter2);
            Logger.log(LCARSDetail)
            LCARSDetails[i]=LCARSDetail.toString().trim();
          })
                  
        }
        //LCARSDetails.splice(LCARSDetails.length-1,1);
        //Logger.log (LCARSDetails);
        return LCARSDetails
}
 
function GetTitledRow(range,title)
{

  let Retrow = 0;
  forEachRangeCell(range, (cell) => {
  //Logger.log(cell.getValue());

    if (cell.getValue().toString().search(title)!=-1)
    {
      Logger.log ('found'+cell.getValue());
      Retrow = cell.getRow();
    }
    })
  
  return Retrow;

}

function forEachRangeCell(range, f) {
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();

  for (let i = 1; i <= numCols; i++) {
    for (let j = 1; j <= numRows; j++) {
      const cell = range.getCell(j, i)

      f(cell)
    }
  }
}

function AnalyzeLevel(range, sheet)
{

      if (range.getValue() != ''){
      let LCARSCommand = sheet.getRange(2,9).getValue();
      Logger.log(LCARSCommand);
      let newLCARSCommand = LCARSCommand.substring(0,LCARSCommand.search('\" ')).concat('\" ').concat(range.getValue());
      Logger.log(newLCARSCommand);
      sheet.getRange(2,9).setValue(newLCARSCommand);
      }
}

function AnalyzeShips(sheet,e,Sheetname)
{

      var Slottext;

      let LCARSDetailstring = sheet.getRange('B2:B49');
        
      if ((sheet.getRange(2,1).getValue() != '') ){

       //get correct sheet and cell from reasearch data 
        Shipsheet = e.source.getSheetByName('Ship Data');
        Effectcell = Shipscell(Shipsheet,sheet.getRange(2,1).getValue());

        Logger.log('EffectCell' + Effectcell.getA1Notation())

        if (Effectcell.getValue() != ''){
          let Effectsheetobject =  e.source.getSheetByName('Ship Data')
 
          let Effectrow = Effectcell.getRow();
          Logger.log(Effectrow);
          

          //get Ability
          let CurRow = GetTitledRow(LCARSDetailstring,'Ship Ability')
          let LCARSArray = LCARSArrayfromCell2(sheet.getRange(1+CurRow,2),' ');
          sheet.getRange(2,6).setValue(LCARSArray[0]);

          
          //get Ability Bonus
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(4+CurRow,2),'   ');
          Logger.log('AB1:'+LCARSArray[LCARSArray.length-1])
          sheet.getRange(2,8).setValue(LCARSArray[LCARSArray.length-1]);
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(5+CurRow,2),'   ');
          sheet.getRange(2,9).setValue(LCARSArray[LCARSArray.length-1]);
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(6+CurRow,2),'   ');
          sheet.getRange(2,10).setValue(LCARSArray[LCARSArray.length-1]);
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(7+CurRow,2),'   ');
          sheet.getRange(2,11).setValue(LCARSArray[LCARSArray.length-1]);
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(8+CurRow,2),'   ');
          sheet.getRange(2,12).setValue(LCARSArray[LCARSArray.length-1]);

         //BP
         CurRow = GetTitledRow(LCARSDetailstring,'Blueprints')
         if (CurRow!=0){
         LCARSArray = LCARSArrayfromCell2(sheet.getRange(11+CurRow,2),'  ');
         sheet.getRange(2,13).setValue(LCARSArray[1]);
         Logger.log(LCARSArray);
         if (LCARSArray.length > 2){
          if (LCARSArray[9].search('K Total')!=0){
            sheet.getRange(2,14).setValue(LCARSArray[9].replace('K Total','000'));
            } 
          }
         }

        
         //Reqs
         CurRow = GetTitledRow(LCARSDetailstring,'Requirements')
         if (CurRow!=0){
         sheet.getRange(2,15).setValue(sheet.getRange(13+CurRow,2).getValue())
         }

          //Scrapyard
         CurRow = GetTitledRow(LCARSDetailstring,'Scrapyard')
         if (CurRow!=0){
         LCARSArray = LCARSArrayfromCell2(sheet.getRange(17+CurRow,2),'?');
         sheet.getRange(2,24).setValue(LCARSArray[1]);
         }

         CurRow = GetTitledRow(LCARSDetailstring,'Build Costs')
         Logger.log(CurRow);
         if (CurRow!=0){
         //get RepCosts
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(1+CurRow,2),'   ');
         }
         Logger.log(LCARSArray);
          
          sheet.getRange(2,25).setValue(LCARSArray[0].split(' ')[1]);
          sheet.getRange(2,26).setValue(LCARSArray[0].split(' ')[0]);
          sheet.getRange(2,27).setValue(LCARSArray[1].split(' ')[1]);
          sheet.getRange(2,28).setValue(LCARSArray[1].split(' ')[0]);
          
        //get RepTime
        LCARSArray = LCARSArrayfromCell2(sheet.getRange(25+CurRow,2),'Seconds');
        sheet.getRange(2,29).setValue(LCARSArray[0].split('Time: ')[1]);

        //get BuildTime
        LCARSArray = LCARSArrayfromCell2(sheet.getRange(23+CurRow,2),'Seconds');
        sheet.getRange(2,30).setValue(LCARSArray[0].split('Time: ')[1]);

        Logger.log('CurRow:'+CurRow)
        //get Tier build cost
        LCARSArray = LCARSArrayfromCell3(sheet.getRange(19+CurRow,2),'   ',' ');

        Logger.log(LCARSArray[0]);
        Logger.log(LCARSArray[1]);
        Logger.log(LCARSArray[2]);
        Logger.log(LCARSArray[3]);
          LCARSArray.forEach(function(Prec,i)
          {
            Prec = Prec.replace('★,','★');
            Prec = Prec.split(',')
            sheet.getRange(2,32+i*2-1).setValue(Prec[1]);
            sheet.getRange(2,32+i*2).setValue(Prec[0])
          })



         //Slots
         let i=0;
         do {
            Slottext =  sheet.getRange(41+i,2).getValue().split('  ')[0];
            if (!Slottext.startsWith('-'))
            {
            Logger.log(Slottext);
            sheet.getRange(2,16+i).setValue(Slottext)
            i++;}
          }
         while (!Slottext.startsWith('-'));
         //sheet.getRange(2,14).setValue(sheet.getRange(41,2).getValue()
        

/*
          LCARSArray.forEach(function(Prec,i)
          {
            Effectsheetobject.getRange(Effectrow,10+i).setValue(Prec[0]+' #'+Prec[1]);
          })

          //get Costs
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(10,4),'   ',' ');
          LCARSArray.forEach(function(Prec,i)
          {
            Effectsheetobject.getRange(Effectrow,17+i*2-1).setValue(Prec[1]);
            Effectsheetobject.getRange(Effectrow,17+i*2).setValue(Prec[0]);
          })

          //get Time
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(12,4),'Seconds:',' **');
            Effectsheetobject.getRange(Effectrow,14).setValue(LCARSArray[1][0]);

          //get Powerincrease
          LCARSArray = LCARSArrayfromCell2(sheet.getRange(14,4),'Increase: ','');
            Effectsheetobject.getRange(Effectrow,15).setValue(LCARSArray[1]);
          */

        }  
      }  
      else
      {
        /*
        sheet.getRange(2,7).setValue("-");
        sheet.getRange(2,8).setValue("-");
        sheet.getRange(2,9).setValue("-");
        sheet.getRange(2,10).setValue("-");
        */
      }
}










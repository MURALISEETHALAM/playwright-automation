import * as XLSX from 'xlsx';

export class ExcelHelper {

  static filePath = 'testdata/testdata.xlsx';

  static getData(sheetName: string, tcid: string) {
    const workbook = XLSX.readFile(this.filePath);
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);
    return data.find(row => row.TCID === tcid);
  }

  static writeData(sheetName: string, tcid: string, columnName: string, value: string) {
    const workbook = XLSX.readFile(this.filePath);
    const sheet = workbook.Sheets[sheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

    // find row by TCID
    const row = jsonData.find(r => r.TCID === tcid);

    if (row) {
      row[columnName] = value;
    }

    // convert json back to sheet
    const newSheet = XLSX.utils.json_to_sheet(jsonData);
    workbook.Sheets[sheetName] = newSheet;

    // save file
    XLSX.writeFile(workbook, this.filePath);
  }
}
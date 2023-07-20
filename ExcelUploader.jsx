import { read, write, utils } from 'xlsx';
import { saveAs } from 'file-saver';


const ExcelUploader = () => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: 'binary' });

        console.log('Nombres de las hojas:', workbook.SheetNames);
        const sheetName = 'Hoja1'; // Reemplaza 'NOMBRE_DE_LA_HOJA' con el nombre de la hoja que deseas acceder
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = utils.sheet_to_json(worksheet);
        console.log(jsonData);

        const modifiedData = jsonData.map((item) => {

          const ganancia = item.GANANCIA
          delete item.GANANCIA

          return {
            ...item,
            ganancia
          }
        })

        console.log(modifiedData);

        // Ejemplo: Guardar el archivo Excel
        const newWorkbook = utils.book_new()
        const newWorksheet = utils.json_to_sheet(modifiedData)
        utils.book_append_sheet(newWorkbook, newWorksheet, 'HojaNueva')
        const excelBuffer = write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        
        // Descarga del nuevo archivo excel
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'nuevoArchivo.xlsx');

      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
    </div>
  );
};

export default ExcelUploader;

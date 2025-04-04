// const multer = require('multer');
// const path = require('path');
// const { slugify } = require('transliteration');

// const fileFilter = require('./utils/LocalfileFilter');

// const singleStorageUpload = ({
//   entity,
//   fileType = 'default',
//   uploadFieldName = 'file',
//   fieldName = 'file',
// }) => {
//   var diskStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, `src/public/uploads/${entity}`);
//     },
//     filename: function (req, file, cb) {
//       try {
//         // fetching the file extension of the uploaded file
//         let fileExtension = path.extname(file.originalname);
//         let uniqueFileID = Math.random().toString(36).slice(2, 7); 

//         let originalname = '';
//         if (req.body.seotitle) {
//           originalname = slugify(req.body.seotitle.toLocaleLowerCase()); 
//         } else {
//           originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase());
//         }

//         let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

//         const filePath = `public/uploads/${entity}/${_fileName}`;
//         // saving file name and extension in request upload object
//         req.upload = {
//           fileName: _fileName,
//           fieldExt: fileExtension,
//           entity: entity,
//           fieldName: fieldName,
//           fileType: fileType,
//           filePath: filePath,
//         };

//         req.body[fieldName] = filePath;

//         cb(null, _fileName);
//       } catch (error) {
//         cb(error); // pass the error to the callback
//       }
//     },
//   });

//   let filterType = fileFilter(fileType);

//   const multerStorage = multer({ storage: diskStorage, fileFilter: filterType }).single('file');
//   return multerStorage;
// };

// module.exports = singleStorageUpload;

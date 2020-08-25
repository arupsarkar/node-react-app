import http from './httpCommon';


// const upload = (file, onUploadProgress) => {
//     console.log('File upload service', '...upload started please wait')
//     let formData = new FormData();
//     formData.append("file", file);
//     console.log('File upload service, file data', file);
//     console.log('File upload service, file data', formData);

//     return http.post ("/api/upload", formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress,
//     })
// }


const upload = (file) => {
    console.log('File upload service', '...upload started please wait')
    let formData = new FormData();
    formData.append('file', file);
    console.log('File upload service, file data', file);
    console.log('File upload service, file data', formData);

    return http.post ("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        
    })
}

const getFiles = () => {
    return http.get("/api/files");
  };

  export default {
    upload,
    getFiles,
  };  
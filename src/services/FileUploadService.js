import http from './httpCommon';


const upload = (file, onUploadProgress) => {

    let formData = new FormData();
    formData.append("file", file);

    return http.post ("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    })
}


const getFiles = () => {
    return http.get("/api/files");
  };

  export default {
    upload,
    getFiles,
  };  
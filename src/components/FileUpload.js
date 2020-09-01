import React, {useState, useEffect} from 'react'
import  UploadService from '../services/FileUploadService'


import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link';

const columns = [
  {id: 'file_id', label: 'File Id', minWidth: 50},
  {id: 'key', label: 'Name', minWidth: 150},
  {id: 'object_url', label: 'File Location', minWidth: 300}
]


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});


const UploadFiles = () => {


    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
  
    const [fileInfos, setFileInfos] = useState([]);
    const [fileUploadStatus, setFileUploadStatus] = useState(false);

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const getFiles = () => {
        UploadService.getFiles()
        .then((res) => {
            console.log('response', res.data);
            setFileInfos(res.data)
        })
        .catch((err) => {
            console.log('Error getting files', err)
        })
    }

    const submitUpload = (event) => {
        event.preventDefault()
        let currentFile = selectedFiles[0];
        console.log('current file', currentFile);
        setCurrentFile(currentFile);
        UploadService.upload(currentFile)
        .then((res) => {
            console.log('response', res)
            getFiles()
            setFileUploadStatus(true);
        })
        .catch(() => {
            console.log('error', 'error uploading file')
        })
    }
    const upload = () => {

        let currentFile = selectedFiles[0];
        console.log('current file', currentFile);
        setProgress(0);
        setCurrentFile(currentFile);
        
        UploadService.upload(currentFile, (event) => {
          setMessage("File upload in progress, please wait");   
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            console.log('response', response);
            setMessage("File uploaded successfully!");
            setFileUploadStatus(true);
            return UploadService.getFiles();
          })
          .then((files) => {
            console.log('files response', files)
            setFileInfos(files.data);
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
    
        setSelectedFiles(undefined);
    };    


    useEffect(() => {
        console.log('useEffect()', 'start');
        getFiles()
        console.log('useEffect()', 'end');    
    }, [fileUploadStatus]) 


    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    return (

        <div>
        {currentFile && (

          <Paper elevation={1}>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + "%" }}
              >
                {progress}%
              </div>
            </div>          
          </Paper>

        )}
  
        <Paper elevation={2}>

          <label className="btn btn-default">
            <input type="file" onChange={selectFile} />
          </label>
    
          <button
            className="btn btn-success"
            disabled={!selectedFiles}
            onClick={upload}
          >
            Upload
          </button>        
        </Paper>

        
          <Paper elevation={1}>
            <div className="alert alert-light" role="alert">
              {message}
            </div>          
          </Paper>

  


        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>

                <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>

            </TableHead>

            <TableBody>
            {fileInfos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'object_url' ? <Link href={value}> {value}</Link> : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>

            </Table>                
          </TableContainer>

            <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={fileInfos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />          
        </Paper>

        
      </div>

    )
}


export default UploadFiles;
import React, {useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {fileUpload, imageUpload} from "../redux/actions/register/documents";

import '../assets/css/documents.css';
const baseStyle = {
    outline: 'none',
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function StyledDropzone(props){
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('selectedFile', file);
        if(props.btnText === "Upload") {
            fileUpload(formData).then((res) => {
                props.func(res.data.results, file.name);
            }).catch((err) => {
                props.func('Format');
            });
        } else {
            imageUpload(formData).then((res) => {
                props.func(res.data.results, file.name);
            }).catch((err) => {
                console.log(err);
                props.func('Format');
            })
        }
    }, [props]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return (
        <div className="upload-customize">
            <div className="txt-14 col-white upload-p text-center" {...getRootProps({style})}>
                <input {...getInputProps()} />
                <CloudUploadIcon style={{fontSize: 64}}/>
                {
                    props.btnText === "Upload"?
                        <div className="btn-fileUpload txt-14 col-white justify-center">{props.btnText}</div>
                        :
                        <div className="btn-fileUpload profile txt-14 col-white">{props.btnText}</div>
                }
            </div>
        </div>
    );
}

import React from 'react';
import '../assets/css/documents.css';
import DocumentsMenu from "./documents-menu";

function Documents() {
    return (
        <>
            <div className="documents-body">
                <div className="txt-24 col-black">Documents</div>

                <div className="documents-upload-p">
                    <div className="flex-document cathy txt-14 justify-left">
                        <div className="upload-card align-center">
                            <img className="upload-icon" src={require('../assets/img/upload.svg')} alt="" />

                            <div className="pt-20 pb-20 justify-center">
                                <div className="btn-upload col-white justify-center mouse-cursor">Upload</div>
                            </div>
                            <div className="txt-12">File types accepted include:  pdf, docx, txt</div>
                        </div>
                    </div>
                </div>

                <DocumentsMenu/>
            </div>
        </>
    )
}
export default Documents;

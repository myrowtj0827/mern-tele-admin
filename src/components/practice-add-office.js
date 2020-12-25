
import React from 'react';
import '../assets/css/practice.css';

const PracticeAddOffice = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <>
            <div className={showHideClassName}>
                <section className="office-modal-main">
                    <div className="profile-header txt-18 justify-left col-white">Add Office</div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue profile">

                        <div className="flex-space pb-30">
                            <div className="office-modal">
                                <div className="">OFFICE NAME</div>
                                <input/>
                            </div>

                            <div className="office-modal">
                                <div className="">CITY</div>
                                <input/>
                            </div>
                        </div>

                        <div className="flex-space pb-30">
                            <div className="office-modal">
                                <div className="">PHONE</div>
                                <input/>
                            </div>

                            <div className="office-modal">
                                <div className="">STATE</div>
                                <input/>
                            </div>
                        </div>

                        <div className="flex-space pb-30">
                            <div className="office-modal">
                                <div className="">ADDRESS</div>
                                <input/>
                            </div>

                            <div className="office-modal">
                                <div className="">ZIP</div>
                                <input/>
                            </div>
                        </div>

                        <div className="flex-space pb-30">
                            <div className="office-modal">
                                <div className="">ADDRESS LINE 2</div>
                                <input/>
                            </div>

                            <div className="office-modal">
                                <div className="">COUNTRY</div>
                                <input/>
                            </div>
                        </div>

                        <div className="btn-common mouse-cursor create save-cancel justify-center col-white">Save</div>
                        <div className="btn-common mouse-cursor cancel justify-center" onClick={handleClose}>Cancel</div>
                    </div>
                </section>
            </div>
        </>
    )
};
export default PracticeAddOffice;
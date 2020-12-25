import React from 'react';
import '../assets/css/practice.css';
import PracticesHeader from "./practice-header";

function PracticeProfile() {
    return (
        <>
            <PracticesHeader/>
            <div className="profile-body-p">
                    <div className="practice-profile-grid5">
                        <div className="practice-photo-box">
                            <div className="photo-upBg">
                                <img className="practice-photo-virtual" src={require('../assets/img/virtual-uploadPhoto.svg')} alt="" />
                            </div>
                            <div className="new-photo-pt align-center">
                                <div className="txt-24 col-darkBlue justify-center">Davy's Room</div>
                                <div className="btn-common room col-white mouse-cursor">Upload New Photo</div>
                            </div>
                        </div>

                        <div className="practice-info-box">
                            <div className="txt-18 txt-medium col-darkBlue">Practice Info</div>
                            <div className="pt-30 col-heavyDark">Name</div>
                            <input className="userInfo" placeholder="Davy Johns" />

                            <div className="btn-common practice-userInfo mouse-cursor">Update</div>
                        </div>
                    </div>
            </div>
        </>
    )
}
export default PracticeProfile;
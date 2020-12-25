import React from 'react';
import '../assets/css/practice.css';
import PracticesHeader from "./practice-header";

function PracticeInfo() {
    return (
        <>
            <PracticesHeader/>
            <div className="payment-body">
                <div className="payment-card txt-14 col-heavyDark">
                    <div className="txt-18 col-darkBlue">Extra Billing Information</div>
                    <div className="flex-space warning-message invoice">
                        <div className="flex-warning txt-14 col-darkBlue">
                            <img className="warning-icon" src={require('../assets/img/warning-circle.svg')} alt="" />
                            <div className="payment-pl-5">
                                This information will appear on all of your receipts, and is a great place to add your full business name, VAT number, or address of record. Do not include any confidential or financial information such as credit card numbers.
                            </div>
                        </div>
                    </div>

                    <textarea className="invoice-box" />

                    <div className="flex-common updated">
                        <div className="btn-common btn-update col-white align-center mouse-cursor">Update</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PracticeInfo;
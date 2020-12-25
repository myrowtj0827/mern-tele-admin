import React from 'react';
import '../assets/css/practice.css';
import PracticesHeader from "./practice-header";

function PracticePayment() {
    return (
        <>
            <PracticesHeader/>
            <div className="payment-body">

                <div className="flex-space warning-message">
                    <div className="flex-warning txt-14 col-darkBlue">
                        <img className="warning-icon" src={require('../assets/img/warning.svg')} alt="" />
                        <div className="payment-pl-5">
                            You are currently within your free trial period. Your trial will expire on August 24th, 2020.
                        </div>
                    </div>
                    <div><img className="warning-times" src={require('../assets/img/times.svg')} alt="" /></div>
                </div>

                <div className="payment-card txt-16 col-heavyDark">
                    <div className="col-darkBlue">Payment Method</div>

                    <div className="pt-20">Cardholder</div>
                    <input placeholder="" />

                    <div className="pt-20">Card</div>
                    <input placeholder="Card Number"/>

                    <div className="pt-20">Address</div>
                    <input placeholder=""/>

                    <div className="pt-20">Address line 2</div>
                    <input placeholder=""/>

                    <div className="pt-20">City</div>
                    <input placeholder=""/>

                    <div className="pt-20">State Zip / Postal code</div>
                    <div className="flex-space">
                        <input placeholder="State"/>
                        <input placeholder="Postal Code"/>
                    </div>

                    <div className="pt-20">Country</div>
                    <select defaultValue={'1'}>
                        <option value={'1'}>United States</option>
                    </select>

                    <div className="flex-common updated">
                        <div className="btn-common btn-update col-white align-center mouse-cursor">Update</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PracticePayment;
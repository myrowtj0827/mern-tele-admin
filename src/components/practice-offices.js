import React, { Component } from 'react';
import '../assets/css/practice.css';
import PracticesHeader from "./practice-header";
import PracticeAddOffice from "./practice-add-office";


class PracticeOffices extends Component{
    state = { show: false };

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        return (
            <>
                <PracticesHeader/>
                <div className="payment-body">
                    <div className="payment-card txt-14 col-heavyDark">
                        <div className="flex-space">
                            <div className="txt-18 col-darkBlue">ENABLE CUSTOM OFFICES</div>

                            <span className="">
                                <label className="switchBtn">
                                    <input type="checkbox" />
                                    <div className="slide round"></div>
                                </label>
                             </span>
                        </div>

                        <div className="flex-space warning-message invoice">
                            <div className="flex-warning txt-14 col-darkBlue">
                                <img className="warning-icon" src={require('../assets/img/warning-circle.svg')} alt="" />
                                <div className="payment-pl-5">
                                    Enabling this setting allows picking a specific office location when an in-office appointment is booked by the provider or by the client. This is useful if you have multiple office locations. If you leave this setting disabled, you may still book in-office appointments, but a specific location will not be required. Office address will also be included in appointment confirmation emails.
                                </div>
                            </div>
                        </div>

                        <div className="flex-common updated">
                            <div className="btn-common btn-update add-office col-white align-center mouse-cursor" onClick={this.showModal}>Add Office</div>
                        </div>
                        <div style={{overflowX: 'auto'}}>
                            <table id={'office'} className="col-black align-center">
                                <tbody>
                                    <tr className="txt-14 txt-medium office">
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th></th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>ZIP</th>
                                        <th></th>
                                    </tr>

                                    <tr className="txt-12">
                                        <td>Cathy</td>
                                        <td>Address address</td>
                                        <td>Address 2</td>
                                        <td>City</td>
                                        <td>ST</td>
                                        <td>545454</td>
                                        <td className="mouse-cursor">
                                            <img src={require('../assets/img/edit.svg')} alt="" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*  Modal  */}
                <PracticeAddOffice show={this.state.show} handleClose={this.hideModal}>
                </PracticeAddOffice>
            </>
        )
    }
}
export default PracticeOffices;
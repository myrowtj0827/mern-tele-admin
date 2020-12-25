import React, {Component} from 'react';
import {
    logout,
    acceptTerms,
} from "../redux/actions/register/login-register";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import Config from "../config/index";

class FirstModal extends Component {
    Cancel = () => {
        const {
            handleClose,
        } = this.props;

        handleClose();
    };
    logOutToggle = () => {
        const {
            logout,
        } = this.props;

        let data = {
            id: localStorage.getItem('provider_id'),
            role: 'provider',
        };

        if(logout){
            logout(data, this.props.history);
        }
    };
    onContinue = () => {
        const {
            acceptTerms,
        } = this.props;
        if(acceptTerms) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };
            acceptTerms(data);
        }
        this.Cancel();
    };
    render() {
        const showHideClassName = this.props.show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>

                <section className="modal-article accept">
                    <div className="create-modal-header txt-22 justify-left col-white">Accept Terms and Conditions</div>
                    <div className="txt-18 col-blue mt-20" style={{padding: 30}}>
                        By continuing to teletherapist, you are accepting our
                        <a href={Config.FRONT_URL + "/pricing"} className="under-line" style={{paddingLeft: 10}}>Terms and Conditions</a>
                    </div>
                    <div className="flex-space accept modal-p">
                        <div className="btn-common mouse-cursor cancel col-darkBlue justify-center continue-mt" onClick={this.onContinue}>Continue to teletherapist</div>
                        <div className="btn-common mouse-cursor create justify-center col-white" onClick={this.logOutToggle}>Log Out</div>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    {
        logout,
        acceptTerms,
    }
)(FirstModal);


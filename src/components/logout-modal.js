import React, {Component} from 'react';
import {
    logout,
} from "../redux/actions/register/login-register";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

class Logout extends Component {
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
    render() {
        const showHideClassName = this.props.show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>

                <section className="modal-article">
                    <div className="create-modal-header txt-18 justify-left col-white">Log Out</div>

                    <div className="pt-45 pb-30 txt-16 col-blue justify-center">Do you want to log out really?</div>
                    <div className="flex-grid2 modal-grid2-gaps modal-p">
                        <div className="btn-common cancel mouse-cursor justify-center" onClick={this.Cancel}>Cancel</div>
                        <div className="btn-common create btn-delete mouse-cursor justify-center col-white" onClick={this.logOutToggle}>Ok</div>
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
    }
)(Logout);


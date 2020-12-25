import React, {Component} from 'react';
import { deleteUser } from "../redux/actions/register/login-register";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

class DeleteUser extends Component {
    Cancel = () => {
        const {
            handleClose
        } = this.props;

        handleClose();
    };

    deleteToggle = (_id, role) => {
        const data = {
            _id: _id,
            role: role,
        };

        const {
            deleteUser
        } = this.props;

        deleteUser(data);
    };

    render() {
        const showHideClassName = this.props.show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>

                <section className="modal-article">
                    <div className="create-modal-header txt-18 justify-left col-white">Delete User</div>

                    <div className="pt-45 pb-30 txt-16 col-blue justify-center">Do you want to delete this user really?</div>


                    <div className="flex-grid2 modal-grid2-gaps modal-p">
                        <div className="btn-common mouse-cursor cancel justify-center" onClick={this.Cancel}>Cancel</div>
                        <div className="btn-common mouse-cursor create justify-center col-white" onClick={() => this.deleteToggle(this.props.deleteId, this.props.role)}>Delete</div>
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
        deleteUser,
    }
)(DeleteUser);


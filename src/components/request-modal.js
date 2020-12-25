import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import {
    deleteClientRequest,
} from "../redux/actions/register/client-register-request"
class DeleteClientRequest extends Component {
    cancel = () => {
        const {
            handleClose
        } = this.props;

        handleClose();
    };

    deleteToggle = (data) => {
        const {
            deleteClientRequest,
        } = this.props;

        deleteClientRequest(data);
    };

    render() {
        const showHideClassName = this.props.requestShow ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>

                <section className="modal-article">
                    <div className="create-modal-header txt-18 justify-left col-white">Delete</div>

                    <div className="pt-45 pb-30 txt-16 col-blue justify-center">Do you want to delete this request really?</div>


                    <div className="flex-grid2 modal-grid2-gaps modal-p">
                        <div className="btn-common mouse-cursor cancel justify-center" onClick={this.cancel}>Cancel</div>
                        <div className="btn-common mouse-cursor create justify-center col-white" onClick={() => this.deleteToggle(this.props.deleteData)}>Delete</div>
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
        deleteClientRequest,
    }
)(DeleteClientRequest);
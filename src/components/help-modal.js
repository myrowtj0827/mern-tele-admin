import React, {Component} from 'react';
import { deleteArticle } from "../redux/actions/register/help-articles";
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

class DeleteHelpArticle extends Component {
    Cancel = () => {
        const {
            handleClose
        } = this.props;

        handleClose();
    };

    deleteToggle = (_id) => {
        const data = {
            _id: _id,
        };

        const {
            deleteArticle
        } = this.props;

        deleteArticle(data);
    };

    render() {
        const showHideClassName = this.props.show ? "modal-b display-modal-block" : "modal-b display-modal-none";
        return (
            <div className={showHideClassName}>
                <section className="modal-article">
                    <div className="create-modal-header txt-18 justify-left col-white">Delete Article</div>
                    <div className="pt-45 pb-30 txt-16 col-blue justify-center">Do you want to delete this article really?</div>
                    <div className="flex-grid2 modal-grid2-gaps modal-p">
                        <div className="btn-common mouse-cursor cancel justify-center" onClick={this.Cancel}>Cancel</div>
                        <div className="btn-common mouse-cursor create justify-center col-white" onClick={() => this.deleteToggle(this.props.deleteId)}>Delete</div>
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
        deleteArticle,
    }
)(DeleteHelpArticle);
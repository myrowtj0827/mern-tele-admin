import React from 'react';
import '../assets/css/dashboard.css';
import {getRequestProvider, verification} from "../redux/actions/register/login-register";
import {connect} from "react-redux";
import Config from "../config";

class SuccessTxt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            requestInfo: '',
        }
    }

    componentDidMount() {
        const {
            getRequestProvider,
        } = this.props;

        getRequestProvider({
            id: this.props.match.params.id,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.requestProvider !== this.props.requestProvider) {
            this.setState({
                requestInfo: this.props.requestProvider,
            });
        }

        const {
            verification
        } = this.props;

        if(this.state.requestInfo && this.state.requestInfo !== '') {
            verification(this.state.requestInfo);
        }
    }

    goto = () => {
        window.location.href = "/login";
    };

    render() {
        return (
            <>
                <div className="admin-login-bg">
                    <div className="login-form-p" style={{paddingTop: 0}}>
                        <div className="admin-logo">
                            <a className="col-buttonAndLink" href={Config.FRONT_URL + '/home/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>

                        <div className="justify-center">
                            <div className="pt-45 col-white txt-24">
                                <div>
                                    {this.state.requestInfo.email} verification succeeded!
                                </div>
                            </div>
                        </div>

                        <div className="pt-45 justify-center">
                            <div className="btn-common goto txt-16 col-white justify-center mouse-cursor" onClick={this.goto}>
                                Go to Login
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        requestProvider: state.registers.requestProvider,
    }
};

export default connect(
    mapStateToProps,
    { getRequestProvider, verification,}
)(SuccessTxt);



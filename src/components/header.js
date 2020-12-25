import React, {Component} from 'react';
import "../assets/css/dashboard.css"
import {connect} from "react-redux";
import Logout from "./logout-modal";

class Header extends Component{
    constructor(){
        super();

        this.state = {
            account: '',
            show: false,
        }
    }
    showModal = () => {
        this.setState({
            show: true,
        })
    };
    hideModal = () => {
        this.setState({
            show: false,
        })
    };
    render(){
        return (
            <>
                <div className="flex-space header-space">
                    <div className="rectangle-menu justify-center mouse-cursor" onClick={this.props.toggleSideMenu}>
                        <img
                            src={require(this.props.shownSideMenu ? '../assets/img/desktop-menu.svg' : '../assets/img/mobile-menu.svg')}
                            alt=""/>
                    </div>

                    <div className="align-right txt-16 col-heavyDark justify-center">
                        <div className="btn-header mouse-cursor " onClick={this.showModal}>
                            <div className="flex-space">
                                Log Out
                            </div>
                        </div>
                    </div>
                </div>

                {/*	Modal */}
                <Logout
                    show={this.state.show}
                    handleClose={this.hideModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    {

    }
)(Header);



// import React, {Component} from 'react';
// import {
//     getPhotoByIdRole,
//     logout,
// } from '../redux/actions/register/login-register';
//
// import "../assets/css/dashboard.css"
// import {connect} from "react-redux";
// import {Link} from "react-router-dom";
//
// class Header extends Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             account: '',
//         }
//     }
//
//     componentDidMount() {
//         const {
//             getPhotoByIdRole,
//         } = this.props;
//
//         getPhotoByIdRole({
//             id: localStorage.provider_id,
//             role: 'provider',
//         });
//     }
//
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if (this.props.providerPhotoInfo && prevProps.providerPhotoInfo !== this.props.providerPhotoInfo) {
//             this.setState({
//                 account: this.props.providerPhotoInfo
//             })
//         }
//     }
//
//     logOut = () => {
//         const {
//             logout
//         } = this.props;
//
//         let data = {
//             id: localStorage.getItem('provider_id'),
//             role: 'provider',
//         };
//
//         if (logout) {
//             logout(data, this.props.history);
//         }
//     };
//
//     render() {
//         return (
//             <>
//                 <div className="flex-space-header">
//                     <div className="rectangle-menu justify-center mouse-cursor" onClick={this.props.toggleSideMenu}>
//                         <img
//                             src={require(this.props.shownSideMenu ? '../assets/img/desktop-menu.svg' : '../assets/img/mobile-menu.svg')}
//                             alt=""/>
//                     </div>
//
//                     <div className="align-right txt-16 col-heavyDark justify-center">
//                         {/*<div className="btn-header mouse-cursor" onClick={this.logOut}>*/}
//                         <Link to={"/settings-profile"} className="btn-header mouse-cursor">
//                             <div className="flex-space">
//                                 <div>
//                                     Hi, <span className="txt-bold">{this.state.account.name}</span>
//                                 </div>
//
//                                 <div>
//                                     <div className="msg-navbar mouse-cursor msg-dropdown">
//                                         <img className="photo-header mouse-cursor"
//                                              src={
//                                                  this.state.account.photo
//                                                      ?
//                                                      this.state.account.photo
//                                                      :
//                                                      require('../assets/img/account.svg')}
//                                              alt=""/>
//
//                                         <div className="msg-dropdown-content col-white">
//                                             <div className="edit-delete" onClick={() => this.logOut(localStorage.provider_id)}>
//                                                 Logout
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Link>
//                     </div>
//                 </div>
//             </>
//         );
//     }
// }
//
// const mapStateToProps = (state) => {
//     return {
//         providerPhotoInfo: state.registers.providerPhotoInfo,
//     }
// };
//
// export default connect(
//     mapStateToProps,
//     {getPhotoByIdRole, logout}
// )(Header);

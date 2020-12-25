import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import "../assets/css/settings.css";

class SettingsHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBtn: 1,
            menuVisible: false,
        }
    }

    componentDidMount() {
        const {
            location
        } = this.props;

        if (location.pathname === '/settings-profile') {
            this.setState({
                selectedBtn: 1,
            })
        } else if (location.pathname === '/settings-practice') {
            this.setState({
                selectedBtn: 2,
            })
        } else if (location.pathname === '/settings-security') {
            this.setState({
                selectedBtn: 3,
            })
        } else if (location.pathname === '/settings-waiting') {
            this.setState({
                selectedBtn: 4,
            })
        } else if (location.pathname === '/practice-subscription') {
            this.setState({
                selectedBtn: 5,
            })
        } else if (location.pathname === '/practice-scheduling') {
            this.setState({
                selectedBtn: 6,
            })
        } else if (location.pathname === '/settings-drag') {
            this.setState({
                selectedBtn: 7,
            })
        }

    }

    profileToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible,
        })
    };

    render() {
        return (
            <>
                <div className="flex-header justify-center">
                    <Link to="/settings-profile">
                        <div
                            className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Profile
                        </div>
                    </Link>
                    <Link to="/settings-practice">
                        <div
                            className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Practice
                        </div>
                    </Link>
                    <Link to="/settings-security">
                        <div
                            className={this.state.selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Security
                        </div>
                    </Link>
                    <Link to="/settings-waiting">
                        <div
                            className={this.state.selectedBtn === 4 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Waiting Room
                        </div>
                    </Link>
                    <Link to="/practice-subscription">
                        <div
                            className={this.state.selectedBtn === 5 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Subscription
                        </div>
                    </Link>
                    <Link to="/practice-scheduling">
                        <div
                            className={this.state.selectedBtn === 6 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Scheduling
                        </div>
                    </Link>
                    <Link to="/settings-drag">
                        <div
                            className={this.state.selectedBtn === 7 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Drag and Drop
                        </div>
                    </Link>
                </div>

                <div className="menu-right" onClick={this.profileToggleMenu}>
                    <img className="practice-mobile-menu mouse-cursor"
                         src={require('../assets/img/practice-menu.svg')} alt=""/>
                </div>

                {
                    this.state.menuVisible && (
                        <div className="menu-container trans-menu">
                            <Link to="/settings-profile">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Profile</div>
                            </Link>
                            <Link to="/settings-practice">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Practice</div>
                            </Link>
                            <Link to="/settings-security">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Security</div>
                            </Link>
                            <Link to="/settings-waiting">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl"> Waiting Room</div>
                            </Link>
                            <Link to="/practice-subscription">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl"> Subscription</div>
                            </Link>
                            <Link to="/practice-scheduling">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl"> Scheduling</div>
                            </Link>
                            <Link to="/settings-drag">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Drag and Drop</div>
                            </Link>
                        </div>
                    )
                }
            </>
        );
    }

}

export default withRouter(SettingsHeader);
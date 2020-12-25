import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import "../assets/css/settings.css";

class AppointmentHeader extends Component {
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

        if (location.pathname === '/appointment') {
            this.setState({
                selectedBtn: 1,
            })
        } else if (location.pathname === '/appointment-type') {
            this.setState({
                selectedBtn: 2,
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
                    <Link to="/appointment">
                        <div
                            className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Calendar
                        </div>
                    </Link>
                    <Link to="/appointment-type">
                        <div
                            className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Appointment Type
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
                            <Link to="/appointment">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Calendar</div>
                            </Link>
                            <Link to="/appointment-type">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Appointment Type</div>
                            </Link>
                        </div>
                    )
                }
            </>
        );
    }
}

export default withRouter(AppointmentHeader);
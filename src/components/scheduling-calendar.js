import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../assets/css/scheduling.css';
import CalendarJsx from "../assets/js/CalendarJsx";
import DashboardCreateAppointment from "./dashboard-create-appointment";

class SchedulingCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBtn: 1,
            modalVisible: false,
            menuVisible: false,
        }
    }

    componentDidMount() {
        if(window.location.pathname === '/practice-profile') {
            this.setState({
                selectedBtn: 1,
            })
        } else if(window.location.pathname === '/practice-subscription') {
            this.setState({
                selectedBtn: 2,
            })
        } else if(window.location.pathname === '/practice-payment') {
            this.setState({
                selectedBtn: 3,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    showModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        })
    };

    hideModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    ToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible,
        });
    };

    render() {
        return (
            <>
                <div className="scheduling-calendar-body">
                    <div className="flex-space">
                        <div className="flex-space flex-left">
                            <Link to="/scheduling-calendar">
                                <div
                                    className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                                >
                                    Calendar
                                </div>
                            </Link>
                            <Link to="/">
                                <div
                                    className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                                >
                                    Client Scheduler
                                </div>
                            </Link>
                            <Link to="/">
                                <div
                                    className={this.state.selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                                >
                                    Waiting Room
                                </div>
                            </Link>

                            <div onClick={this.ToggleMenu}>
                                <img className="practice-mobile-menu mouse-cursor"
                                     src={require('../assets/img/practice-menu.svg')} alt=""/>
                            </div>
                        </div>

                        <div>
                            <div className="btn-create-appointment txt-16 col-white align-right mouse-cursor" onClick={this.showModal}>Create Appointment</div>
                        </div>
                    </div>

                    {
                        this.state.menuVisible && (
                            <div className="menu-container trans-menu">
                                <Link to="/scheduling-calendar">
                                    <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Calendar</div>
                                </Link>
                                <Link to="/">
                                    <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Client Scheduler</div>
                                </Link>
                                <Link to="/">
                                    <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Waiting Room</div>
                                </Link>
                            </div>
                        )
                    }

                    <div className="pt-45 pb-30 calendar-right-btn">
                        <div className="pl-40 calendars first-p">
                            <select defaultValue={'1'} className="mouse-cursor">
                                <option value={'1'}>My Calendar</option>
                                <option value={'1'}>Practice Calendar</option>
                            </select>
                        </div>

                        <div className="pl-40 calendars">
                            <select defaultValue={'2'} className="mouse-cursor">
                                <option value={'2'}>Month</option>
                                <option value={'2'}>Week</option>
                                <option value={'2'}>Day</option>
                            </select>
                        </div>

                        <div className="pl-40">
                            <div className="btn-create-appointment today txt-16 col-white align-right mouse-cursor">Today</div>
                        </div>
                    </div>

                    <CalendarJsx />
                </div>

                {/*  Modal  */}
                <DashboardCreateAppointment show={this.state.modalVisible}  handleClose={this.hideModal} />
            </>
        )
    }
}
export default SchedulingCalendar;

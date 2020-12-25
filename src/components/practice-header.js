import React, {useEffect, useState} from 'react';
import {Link, withRouter, useLocation} from "react-router-dom";
import "../assets/css/practice.css";

function PracticesHeader() {

    const [selectedBtn, selectMenu] = useState(1);
    let location = useLocation();

    useEffect(() => {
        if (location.pathname === '/practice-profile') {
            selectMenu(1);
        // } else if (location.pathname === '/practice-subscription') {
        //     selectMenu(2);
        } else if (location.pathname === '/practice-payment') {
            selectMenu(3);
        } else if (location.pathname === '/practice-invoice') {
            selectMenu(4);
        } else if (location.pathname === '/practice-offices') {
            selectMenu(5);
        // } else if (location.pathname === '/practice-scheduling') {
        //     selectMenu(6);
        } else if (location.pathname === '/practice-branding') {
            selectMenu(7);
        }
    }, [location.pathname]);

    const [menuVisible, setMenuVisible] = useState(false);
    const profileToggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <>
            <div className="pt-20">
                <div className="flex-header justify-center">
                    <Link to="/practice-profile">
                        <div
                            className={selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Profile
                        </div>
                    </Link>
                    {/*<Link to="/practice-subscription">*/}
                    {/*    <div*/}
                    {/*        className={selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}*/}
                    {/*    >*/}
                    {/*        Subscription*/}
                    {/*    </div>*/}
                    {/*</Link>*/}
                    <Link to="/practice-payment">
                        <div
                            className={selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Payment Method
                        </div>
                    </Link>
                    <Link to="/practice-invoice">
                        <div
                            className={selectedBtn === 4 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Invoice
                        </div>
                    </Link>
                    <Link to="/practice-offices">
                        <div
                            className={selectedBtn === 5 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Offices
                        </div>
                    </Link>
                    {/*<Link to="/practice-scheduling">*/}
                    {/*    <div*/}
                    {/*        className={selectedBtn === 6 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}*/}
                    {/*    >*/}
                    {/*        Scheduling*/}
                    {/*    </div>*/}
                    {/*</Link>*/}
                    <Link to="/practice-branding">
                        <div
                            className={selectedBtn === 7 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Branding
                        </div>
                    </Link>
                </div>

                <div className="" onClick={profileToggleMenu}>
                    <img className="practice-mobile-menu mouse-cursor"
                         src={require('../assets/img/practice-menu.svg')} alt=""/>
                </div>

                {
                    menuVisible && (
                        <div className="menu-container trans-menu">
                            <Link to="/practice-profile">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Profile</div>
                            </Link>
                            {/*<Link to="/practice-subscription">*/}
                            {/*    <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Subscription</div>*/}
                            {/*</Link>*/}
                            <Link to="/practice-method">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Payment Method</div>
                            </Link>
                            <Link to="/practice-invoice">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Invoice</div>
                            </Link>
                            <Link to="/practice-offices">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Offices</div>
                            </Link>
                            {/*<Link to="/practice-scheduling">*/}
                            {/*    <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Scheduling</div>*/}
                            {/*</Link>*/}
                            <Link to="/practice-branding">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Branding</div>
                            </Link>
                        </div>
                    )
                }
            </div>
        </>
    );
}
export default withRouter(PracticesHeader);

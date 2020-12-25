import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import "../assets/css/settings.css";

class HelpHeader extends Component {
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

        if (location.pathname === '/help') {
            this.setState({
                selectedBtn: 1,
            })
        } else if (location.pathname === '/help-published') {
            this.setState({
                selectedBtn: 2,
            })
        } else if (location.pathname.startsWith('/help-new') === true) {
            this.setState({
                selectedBtn: 3,
            })
        }
    }

    articleToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible,
        })
    };

    render() {
        return (
            <>
                <div className="flex-header justify-center">
                    <Link to="/help">
                        <div
                            className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            All Helps
                        </div>
                    </Link>
                    <Link to="/help-published">
                        <div
                            className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Published by me
                        </div>
                    </Link>
                    <Link to="/help-new">
                        <div
                            className={this.state.selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            New Help
                        </div>
                    </Link>
                </div>

                <div className="menu-right" onClick={this.articleToggleMenu}>
                    <img className="practice-mobile-menu mouse-cursor"
                         src={require('../assets/img/practice-menu.svg')} alt=""/>
                </div>

                {
                    this.state.menuVisible && (
                        <div className="menu-container trans-menu">
                            <Link to="/help">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">All Helps</div>
                            </Link>
                            <Link to="/help-published">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Published by me</div>
                            </Link>
                            <Link to="/help-new">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">New Help</div>
                            </Link>
                        </div>
                    )
                }
            </>
        );
    }

}

export default withRouter(HelpHeader);
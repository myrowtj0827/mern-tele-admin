import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import "../assets/css/settings.css";

class ArticlesHeader extends Component {
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

        if (location.pathname === '/all-articles') {
            this.setState({
                selectedBtn: 1,
            })
        } else if (location.pathname === '/published') {
            this.setState({
                selectedBtn: 2,
            })
        } else if (location.pathname.startsWith('/new-article') === true) {
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
                    <Link to="/all-articles">
                        <div
                            className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            All articles
                        </div>
                    </Link>
                    <Link to="/published">
                        <div
                            className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            Published by me
                        </div>
                    </Link>
                    <Link to="/new-article">
                        <div
                            className={this.state.selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                        >
                            New Article
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
                            <Link to="/all-articles">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">All articles</div>
                            </Link>
                            <Link to="/published">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Published by me</div>
                            </Link>
                            <Link to="/new-article">
                                <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">New Article</div>
                            </Link>
                        </div>
                    )
                }
            </>
        );
    }

}

export default withRouter(ArticlesHeader);
import React, { Component } from 'react';
import '../assets/css/settings.css';
import {Link} from "react-router-dom";
import Config from "../config/index";

import { musicImageByIdRole, roomImg } from "../redux/actions/register/login-register";
import {connect} from "react-redux";

class SettingsWaitingRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountInfo: '',
            imgNum: 3,
            mp3Num: 3,
        }
    }

    componentDidMount() {
        const {
            musicImageByIdRole
        } = this.props;

        if(musicImageByIdRole) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };

            musicImageByIdRole(data);
        }

        const audioEl = document.getElementsByClassName("audio-element")[0];
        audioEl.play();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.backgroundImgMusic !== this.props.backgroundImgMusic) {
            this.setState({
                accountInfo: this.props.backgroundImgMusic,
            });

            if(this.props.backgroundImgMusic.bgRoom) {
                this.setState({
                    imgNum: Number(this.props.backgroundImgMusic.bgRoom),
                })
            }

            if(this.props.backgroundImgMusic.bgMusic) {
                this.setState({
                    mp3Num: Number(this.props.backgroundImgMusic.bgMusic),
                })
            }
        }

        if(prevState.mp3Num !== this.state.mp3Num) {
            const audioEl = document.getElementsByClassName("audio-element")[0];
            audioEl.play();
        }
    }

    nextImg = () => {
        const path = this.state.imgNum;
        if(path === 5) {
            this.setState({
                imgNum: 1,
            })
        } else {
            this.setState({
                imgNum: path + 1,
            });
        }
    };

    prevImg = () => {
        const path = this.state.imgNum;
        if(path === 1) {
            this.setState({
                imgNum: 5,
            })
        } else {
            this.setState({
                imgNum: path - 1,
            });
        }
    };

    nextMusic = () => {
        const path = this.state.mp3Num;
        if(path === 5) {
            this.setState({
                mp3Num: 1,
            })
        } else {
            this.setState({
                mp3Num: path + 1,
            });
        }
    };

    prevMusic = () => {
        const path = this.state.mp3Num;
        if(path === 1) {
            this.setState({
                mp3Num: 5,
            })
        } else {
            this.setState({
                mp3Num: path - 1,
            });
        }
    };

    save = () => {
        const data = {
            bgRoom: this.state.imgNum,
            bgMusic: this.state.mp3Num,
            id: localStorage.provider_id,
            role: 'provider',
        };
        const {
            roomImg
        } = this.props;

        roomImg(data);
    };

    render() {
        return (

            <>
                <div className="waiting-bg" style={{backgroundImage: 'url(' + Config.SIM_API_URL + 'waiting/' + this.state.imgNum + '.png)'}}>
                    <div className="login-form-p">
                        <div className="admin-logo">
                            <img className="logo-img" src={require('../assets/img/app-logo.svg')} alt=""/>
                        </div>

                        <div className="txt-waiting waiting-body col-heavyDark">
                            <div className="pb-42 txt-line col-heavyDark align-center"><i className="fas fa-angle-left"></i>
                                This is a simulation of your waiting room. Use the arrows to pick a background image and song that you like, and click save!
                            </div>
                            <audio className="audio-element">
                                <source src={Config.SIM_API_URL + 'waiting/' + this.state.mp3Num + '.mp3'} />
                            </audio>

                            <div className="flex-space pb-15">
                                <div className="btn-arrow justify-center mouse-cursor" onClick={this.prevImg}>
                                    <img className="arrow-size" src={require('../assets/img/arrow-left.svg')} alt="" />
                                </div>

                                <div>Room {this.state.imgNum}</div>

                                <div className="btn-arrow justify-center mouse-cursor" onClick={this.nextImg}>
                                    <img className="arrow-size" src={require('../assets/img/arrow-right.svg')} alt="" />
                                </div>
                            </div>

                            <div className="flex-space pb-15">
                                <div className="btn-arrow justify-center mouse-cursor" onClick={this.prevMusic}>
                                    <img className="arrow-size" src={require('../assets/img/arrow-left.svg')} alt="" />
                                </div>

                                <div>Music {this.state.mp3Num}</div>

                                <div className="btn-arrow justify-center mouse-cursor" onClick={this.nextMusic}>
                                    <img className="arrow-size" src={require('../assets/img/arrow-right.svg')} alt="" />
                                </div>
                            </div>

                            <Link to='/dashboard'>
                                <div className="btn-common save justify-center txt-16 col-white mouse-cursor" onClick={this.save}>Save</div>
                            </Link>
                            <Link to='/settings-practice'>
                                <div className="btn-common cancel justify-center txt-16 col-white mouse-cursor">Cancel</div>
                            </Link>
                        </div>

                    </div>

                </div>
            </>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        backgroundImgMusic: state.registers.backgroundImgMusic,
    }
};

export default connect(
    mapStateToProps,
    { musicImageByIdRole, roomImg }
)(SettingsWaitingRoom);
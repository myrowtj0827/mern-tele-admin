import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/views.css';

function Messages() {
    return (
        <>
            <div className="txt-24 col-black pb-30 message">
                Messages
            </div>

            <div className="message-card mouse-cursor">
                <Link to='/view-messages'>
                    <div className="flex-space">
                        <div className="flex-message justify-center ">
                            <img className="" src={require('../assets/img/message-user.svg')} alt="" />
                            <span className="align-left message-pl">
                                <div className="txt-18 col-darkBlue">User 1</div>
                                <div className="txt-16 col-lightColor">Lorem ipsum ...</div>
                            </span>
                        </div>
                        <div className="txt-18 col-buttonAndLink">1 day ago</div>
                    </div>
                </Link>
            </div>

            <div className="message-card mouse-cursor">
                <Link to='/view-messages'>
                    <div className="flex-space">
                        <div className="flex-message justify-center">
                            <span><img className="" src={require('../assets/img/message-user.svg')} alt="" /></span>
                            <span className="align-left message-pl">
                                <div className="txt-18 col-darkBlue">User 1</div>
                                <div className="txt-16 col-lightColor">Lorem ipsum ...</div>
                            </span>
                        </div>
                        <div className="txt-18 col-buttonAndLink">1 day ago</div>
                    </div>
                </Link>
            </div>

            <div className="message-card mouse-cursor">
                <Link to='/view-messages'>
                    <div className="flex-space">
                        <div className="flex-message justify-center">
                            <span><img className="" src={require('../assets/img/message-user.svg')} alt="" /></span>
                            <span className="align-left message-pl">
                                <div className="txt-18 col-darkBlue">User 1</div>
                                <div className="txt-16 col-lightColor">Lorem ipsum ...</div>
                            </span>
                        </div>
                        <div className="txt-18 col-buttonAndLink">1 day ago</div>
                    </div>
                </Link>
            </div>

            <div className="message-card mouse-cursor">
                <Link to='/view-messages'>
                    <div className="flex-space">
                        <div className="flex-message justify-center">
                            <span><img className="" src={require('../assets/img/message-user.svg')} alt="" /></span>
                            <span className="align-left message-pl">
                                <div className="txt-18 col-darkBlue">User 1</div>
                                <div className="txt-16 col-lightColor">Lorem ipsum ...</div>
                            </span>
                        </div>
                        <div className="txt-18 col-buttonAndLink">1 day ago</div>
                    </div>
                </Link>
            </div>
        </>
    )
}
export default Messages;
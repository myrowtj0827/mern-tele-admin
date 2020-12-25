import React, {Component} from 'react';
import {Redirect, Switch} from "react-router-dom";

import AddProfile from "./add-profile";
import Dashboard from "./dashboard";
import DashboardCreateAppointment from "./dashboard-create-appointment";
//import Messages from "./messages";
import Payments from "./payments";
import ProviderManagement from "./provider-management";
import SchedulingCalendar from "./scheduling-calendar";
import SchedulingCalendarCreateAppt from "./scheduling-calendar-create-appt";
import SchedulingCalendarEdit from "./scheduling-calendar-edit";

import SettingsPractice from "./settings-practice";
import InjectedSettingsProfile from "./settings-profile";
import SettingsSecurity from "./settings-security";
import SettingsWaitingRoom from "./settings-waiting-room";

import ViewMessages from "./view-messages";
import SideBar from "./sidebar";
import Header from "./header";
import Support from "./support";
import Reports from "./reports";
import PracticeProfile from "./practice-profile";
import PracticeInfo from "./practice-info";
import PracticePayment from "./practice-payment";
import PracticeOffices from "./practice-offices";
import PracticeBranding from "./practice-branding";
import PracticeScheduling from "./practice-scheduling";
import Documents from "./documents";
import DocumentsMydoc from "./documents-mydoc";
import DocumentsShared from "./documents-shared";
import PrivateRoute from "./private-route";
import Articles from "./articles";
import Published from "./articles-published";
import ArticleNew from "./article-new";
import ArticleDetails from "./article-details";
import HelpDetails from "./help-details";
import Help from "./help";
import HelpPublished from "./help-published";
import HelpNew from "./help-new";
import InjectedPracticeSubscription from "./practice-subscription";
import {connect} from "react-redux";
// import {createSubscription, getCurrentSubscription, getPricingPlans} from "../redux/actions/register/login-register";
import ClientManagement from "./client-management";
import Appointment from "./appointment";
import AppointmentType from "./appointment-type";
import SettingsDrag from "./settings-drag";
import Config from "../config/index";




import Chatbot from "react-chatbot-kit";
import configChat from "../chatbot/config";
import ActionProvider from "../chatbot/ActionProvider";
import MessageParser from "../chatbot/MessageParser";

import { chatDescription} from "../redux/actions/register/chatbot";
import AddChatbotData from "./add-chatbotData";

class Body extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shown_side_menu: true,
            botVisible: false,
            page_id: false,
            get_reply: '',
        };
    }

    toggleSideMenu = () => {
        this.setState({shown_side_menu: !this.state.shown_side_menu});
    };

    onClickBot = () => {
        this.setState({
            botVisible: !this.state.botVisible,
        })
    };

    onClickBack = () => {
        const {
            chatDescription
        } = this.props;

        const data = {
            pageShown:  !this.props.description_page.pageShown,
            pageNumber: this.props.description_page.pageNumber,
        };
        if(chatDescription) {
            chatDescription(data);
        }
    };

    render() {
        return (
            <>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="flex-common">
                    <div className="header-p phoneShown"><Header shownSideMenu={this.state.shown_side_menu}
                                                                 toggleSideMenu={this.toggleSideMenu}/></div>
                    <div className={`sidebar-width col-white ${this.state.shown_side_menu ? '' : 'collapse'}`}>
                        <div className="sidebar-inner-part">
                            <SideBar/>
                        </div>
                    </div>

                    <div className={`body-width ${this.state.shown_side_menu ? '' : 'collapse'}`}>
                        <div className="header-p tabletShown"><Header shownSideMenu={this.state.shown_side_menu}
                                                                      toggleSideMenu={this.toggleSideMenu}/></div>

                        <div className="body-p">
                            <Switch>
                                <PrivateRoute
                                    path='/dashboard'
                                    component={Dashboard}
                                />
                                <PrivateRoute
                                    path='/add-profile'
                                    component={AddProfile}
                                />
                                <PrivateRoute
                                    path='/create-appointment'
                                    component={DashboardCreateAppointment}
                                />
                                <PrivateRoute
                                    path='/appointment'
                                    component={Appointment}
                                />
                                <PrivateRoute
                                    path='/appointment-type'
                                    component={AppointmentType}
                                />
                                <PrivateRoute
                                    path='/payments'
                                    component={Payments}
                                />
                                <PrivateRoute
                                    path='/provider-management'
                                    component={ProviderManagement}
                                />
                                <PrivateRoute
                                    path='/client-management/:slug?'
                                    component={ClientManagement}
                                />

                                <PrivateRoute
                                    path='/scheduling-calendar'
                                    component={SchedulingCalendar}
                                />

                                <PrivateRoute
                                    path='/scheduling-calendar-create'
                                    component={SchedulingCalendarCreateAppt}
                                />

                                <PrivateRoute
                                    path='/scheduling-calendar-view'
                                    component={SchedulingCalendarEdit}
                                />

                                <PrivateRoute
                                    path='/settings-practice'
                                    component={SettingsPractice}
                                />
                                <PrivateRoute
                                    path='/settings-profile'
                                    component={InjectedSettingsProfile}
                                />
                                <PrivateRoute
                                    path='/settings-security'
                                    component={SettingsSecurity}
                                />
                                <PrivateRoute
                                    path='/settings-waiting'
                                    component={SettingsWaitingRoom}
                                />
                                <PrivateRoute
                                    path="/settings-drag"
                                    component={SettingsDrag}
                                />

                                <PrivateRoute
                                    path='/view-messages/:id?'
                                    component={ViewMessages}
                                />

                                <PrivateRoute
                                    path='/practice-profile'
                                    component={PracticeProfile}
                                />
                                <PrivateRoute
                                    path='/practice-subscription'
                                    component={InjectedPracticeSubscription}
                                />
                                <PrivateRoute
                                    path='/practice-invoice'
                                    component={PracticeInfo}
                                />
                                <PrivateRoute
                                    path='/practice-payment'
                                    component={PracticePayment}
                                />
                                <PrivateRoute
                                    path='/practice-offices'
                                    component={PracticeOffices}
                                />
                                <PrivateRoute
                                    path='/practice-scheduling'
                                    component={PracticeScheduling}
                                />
                                <PrivateRoute
                                    path='/practice-branding'
                                    component={PracticeBranding}
                                />

                                <PrivateRoute
                                    path='/documents'
                                    component={Documents}
                                />
                                <PrivateRoute
                                    path='/documents-mydoc'
                                    component={DocumentsMydoc}
                                />
                                <PrivateRoute
                                    path='/documents-shared'
                                    component={DocumentsShared}
                                />

                                <PrivateRoute
                                    path='/support'
                                    component={Support}
                                />
                                <PrivateRoute
                                    path='/reports'
                                    component={Reports}
                                />

                                <PrivateRoute
                                    path='/all-articles'
                                    component={Articles}
                                />
                                <PrivateRoute
                                    path='/published'
                                    component={Published}
                                />
                                <PrivateRoute
                                    path='/new-article/:id?'
                                    component={ArticleNew}
                                />
                                <PrivateRoute
                                    path='/article-details/:id'
                                    component={ArticleDetails}
                                />

                                <PrivateRoute
                                    path='/help-details/:id'
                                    component={HelpDetails}
                                />
                                <PrivateRoute
                                    path='/help'
                                    component={Help}
                                />
                                <PrivateRoute
                                    path='/help-published'
                                    component={HelpPublished}
                                />
                                <PrivateRoute
                                    path='/help-new/:id?'
                                    component={HelpNew}
                                />
                                <PrivateRoute
                                    path='/add-chatbot'
                                    component={AddChatbotData}
                                />

                                <Redirect
                                    to='/dashboard'
                                />
                            </Switch>
                        </div>

                        <div className={this.state.shown_side_menu? "bot-footer": "slide-bot-footer"}>
                            <div className="btn-bot" onClick={this.onClickBot}>
                                <img className="icon-bot" src={require('../assets/img/message-bot.jpg')} alt="Bot" />
                                Message teletherapist
                            </div>
                        </div>
                        {
                            this.state.botVisible && (
                                <div className="chatbot-form">
                                    <div className="bot-position">
                                        {
                                            this.props.description_page && this.props.description_page.pageShown === true ?
                                                <div className="react-chatbot-kit-chat-container">
                                                    <div className="react-chatbot-kit-chat-header header-bot">
                                                        <div className="flex-space justify-left">
                                                            <div className="description" onClick={this.onClickBack}>
                                                                <img className="bot-arrow" src={require('../assets/img/bot-arrow.svg')} alt="Bot Back" />
                                                            </div>
                                                            <div className="txt-18">
                                                                {
                                                                    this.props.description_page.pageNumber === 0 && (
                                                                        <div>Help Center</div>
                                                                    )
                                                                }
                                                                {
                                                                    this.props.description_page.pageNumber === 1 && (
                                                                        <div>teletherapist</div>
                                                                    )
                                                                }
                                                                {
                                                                    this.props.description_page.pageNumber === 2 && (
                                                                        <div>teletherapist</div>
                                                                    )
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="react-chatbot-kit-chat-message-container desc-index">
                                                        {
                                                            this.props.description_page.pageNumber === 0 && (
                                                                <>
                                                                    <div className="txt-22 pb-20 pt-30">What is your pricing?</div>
                                                                    <div className="pricing-txt">
                                                                        Need to check out our pricing plans?
                                                                    </div>
                                                                    <p>
                                                                        If you are already on trial, you can quickly subscribe and see our plans under Settings > Subscription when logged in.
                                                                    </p>
                                                                    <p>
                                                                        If you are not yet on trial and just checking things out, click here to see our pricing plan details. You can also sign up for our FREE, no credit card needed 3 day trial on the same page. :)
                                                                    </p>
                                                                    <p>
                                                                        We also offer a 20% non-profit discount!
                                                                    </p>
                                                                    <p>
                                                                        To view our pricing and plans for individual or small (less than 5) providers, check our
                                                                        <a className="col-blue under-line" href={Config.FRONT_URL + "/pricing"}> pricing page here.</a> Our pricing is per provider per month.
                                                                    </p>
                                                                    <p>
                                                                        If you have more than 5 providers in your group practice, our group plans will be applicable.
                                                                    </p>
                                                                    <a className="col-blue under-line" href={Config.FRONT_URL + "/pricing"}> Check those out here.</a>

                                                                    <div className="pt-45 pb-30">
                                                                        <a href={Config.FRONT_URL + "/pricing"} className="btn-selected link-price col-white mouse-cursor" style={{margin: 20}}>Pricing Plans</a>
                                                                    </div>
                                                                </>
                                                            )
                                                        }

                                                        {
                                                            this.props.description_page.pageNumber === 1 && (
                                                                <>
                                                                    <div className="txt-22 pb-20 pt-30">We've got options!</div>
                                                                    <div className="pricing-txt">
                                                                        If you are a visual or auditory learner you'll love our training videos!
                                                                    </div>
                                                                    <div><a className="col-blue under-line txt-14" href={Config.FRONT_URL + "/features-online-session"}>{Config.FRONT_URL + "/features-online-session"}</a></div>
                                                                    <p>
                                                                        If things stick best when you can read step by step instructions we've got you covered! Check our help center.
                                                                    </p>
                                                                    <div><a className="col-blue under-line txt-14" href={Config.FRONT_URL + "/help-center"}>{Config.FRONT_URL + "/help-center"}</a></div>
                                                                    <p>
                                                                        If you still have questions - have no fear! Just let us know what we can assist you with.
                                                                    </p>
                                                                </>
                                                            )
                                                        }

                                                        {
                                                            this.props.description_page.pageNumber === 2 && (
                                                                <>
                                                                    <>
                                                                        <div className="txt-18 pb-20 pt-30">We are happy to help resolve any technical difficulties you might be experiencing!</div>
                                                                        <div className="pricing-txt">
                                                                            Can you provide the following information:
                                                                        </div>
                                                                        <p>
                                                                            Describe in as much detail as you can the problem you are experiencing
                                                                        </p>
                                                                        <p>
                                                                            The Browser and Device you are using
                                                                        </p>
                                                                        <p>
                                                                            The Browser and Device your CLIENT is using
                                                                        </p>

                                                                    </>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <Chatbot
                                                    config={configChat}
                                                    actionProvider={ActionProvider}
                                                    messageParser={MessageParser}
                                                    name={localStorage.provider_name}
                                                    get_reply={this.state.get_reply}
                                                />
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        description_page: state.registers.description_page,
    }
};

export default connect(
    mapStateToProps,
    {
        chatDescription,
    }
)(Body);


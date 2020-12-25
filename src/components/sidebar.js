import React, {Component} from 'react';
import '../assets/css/sideBar.css';
import {Link} from "react-router-dom";
import Config from "../config/index"
import {
	getProviderByIdRole,
} from "../redux/actions/register/login-register"
import {connect} from "react-redux";
class Sidebar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			settingsVisible: false,
			supportVisible: false,
			userInfo: '',
		}
	}
	componentDidMount() {
		const {
			getProviderByIdRole,
		} = this.props;
		getProviderByIdRole({
			id: localStorage.provider_id,
			role: 'provider',
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.accountSimpleInfo && this.props.accountSimpleInfo !== prevProps.accountSimpleInfo) {
			this.setState({
				userInfo: this.props.accountSimpleInfo,
			});
			console.log(this.props.accountSimpleInfo, " &&&&&&&&&&&&&&&&&")
		}
	}

	toggleSettings = () => {
		this.setState({
			settingsVisible: !this.state.settingsVisible,
			supportVisible: this.state.settingsVisible && false,
		})
	};
	toggleSupport = () => {
		this.setState({
			supportVisible: !this.state.supportVisible,
			settingsVisible: this.state.supportVisible && false,
		})
	};

	render() {
		return (
			<>
				{/*<div className="justify-center">*/}
				{/*	<img className="logo-p" src={require('../assets/img/app-logo-sidebar.svg')} alt=""/>*/}
				{/*</div>*/}

				<div className="align-left pt-30 ml-20">
					{
						this.state.userInfo && (
							<>
								<img
									className="sidebar-photo-header"
									src={
										this.state.userInfo.photo
											?
											this.state.userInfo.photo
											:
											require('../assets/img/account.svg')}
									alt=""
								/>
								<div className="pt-10">{this.state.userInfo.name && this.state.userInfo.name}</div>
								<div className="pt-10 mb-20">{this.state.userInfo.name && this.state.userInfo.practice_name}</div>
							</>
						)
					}
				</div>


				<div className="menu-item mouse-cursor">
					<Link to="/dashboard">
						<img className="icon-plr" src={require('../assets/img/dashboard-icon.svg')} alt=""/>
						Dashboard
					</Link>
				</div>
				<div className="menu-item mouse-cursor">
					<Link to="/provider-management">
						<img className="icon-plr" src={require('../assets/img/people-icon.svg')} alt=""/>
						Account Users
					</Link>
				</div>
				<div className="menu-item mouse-cursor">
					<Link to="/client-management">
						<img className="icon-plr" src={require('../assets/img/people-icon.svg')} alt=""/>
						Clients
					</Link>
				</div>
				<div className="menu-item mouse-cursor">
					<Link to="/appointment">
						<img className="icon-plr" src={require('../assets/img/dashboard-icon.svg')} alt=""/>
						Appointments
					</Link>
				</div>

				<div className="menu-item mouse-cursor">
					<Link to="/view-messages">
						<img className="icon-plr" src={require('../assets/img/message-icon.svg')} alt=""/>
						Message
					</Link>
				</div>

				{/*<div className="menu-item mouse-cursor">*/}
				{/*	<Link to="/scheduling-calendar">*/}
				{/*		<img className="icon-plr" src={require('../assets/img/scheduling-icon.svg')} alt=""/>*/}
				{/*		Scheduling*/}
				{/*	</Link>*/}
				{/*</div>*/}

				<div className="menu-item mouse-cursor">
					<Link to="/payments">
						<img className="icon-plr" src={require('../assets/img/payment-icon.svg')} alt=""/>
						Payments
					</Link>
				</div>

				<div className="menu-item mouse-cursor">
					<Link to="/documents">
						<img className="icon-plr" src={require('../assets/img/documents.svg')} alt=""/>
						Documents
					</Link>
				</div>

				<div className="menu-item mouse-cursor">
					<Link to="/reports">
						<img className="icon-plr" src={require('../assets/img/report-icon.svg')} alt=""/>
						Reports
					</Link>
				</div>

				<div
					className={this.state.settingsVisible ? 'menu-item mouse-cursor settings-position col-selected-bg' : 'menu-item mouse-cursor settings-position'}
					onClick={this.toggleSettings}>
					<img className="icon-plr" src={require('../assets/img/settings-icon.svg')} alt=""/>
					{this.state.userInfo && this.state.userInfo.practice_name? this.state.userInfo.practice_name: "Settings"}
					{
						this.state.settingsVisible ?
							<div className="settings-icon"><img src={require('../assets/img/dorpdown-icon.svg')} alt=""/></div>
							: <div className="settings-icon"><img src={require('../assets/img/right-icon.svg')} alt=""/></div>
					}

				</div>

				{
					this.state.settingsVisible && (
						<div className="span-bg">
							<div className="collapse-bg settings">
								<Link to="/settings-profile">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Profile
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/settings-practice">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Practice
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/settings-security">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Security
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/settings-waiting">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Waiting Room
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/practice-subscription">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Subscription
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/practice-scheduling">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Scheduling
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/settings-drag">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Drag and Drop
								</Link>
							</div>
							{/*<div className="collapse-bg settings">*/}
							{/*	<Link to="/practice-scheduling">*/}
							{/*		<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>*/}
							{/*		Scheduling*/}
							{/*	</Link>*/}
							{/*</div>*/}
							{/*<div className="collapse-bg settings">*/}
							{/*	<Link to="/practice-branding">*/}
							{/*		<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>*/}
							{/*		Branding*/}
							{/*	</Link>*/}
							{/*</div>*/}
						</div>
					)
				}

				<div
					className={this.state.supportVisible ? 'menu-item mouse-cursor settings-position col-selected-bg' : 'menu-item mouse-cursor settings-position'}
					onClick={this.toggleSupport}>
					<img className="icon-plr" src={require('../assets/img/support-icon.svg')} alt=""/>
					Support
					{
						this.state.supportVisible ?
							<div className="settings-icon"><img src={require('../assets/img/dorpdown-icon.svg')} alt=""/></div>
							: <div className="settings-icon"><img src={require('../assets/img/right-icon.svg')} alt=""/></div>
					}

				</div>

				{
					this.state.supportVisible && (
						<div className="span-bg">
							<div className="collapse-bg settings">
								<Link to="/all-articles">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Blog
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/help">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Help-Center
								</Link>
							</div>
							<div className="collapse-bg settings">
								<Link to="/add-chatbot">
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Add Chatbot Data
								</Link>
							</div>
							<div className="collapse-bg settings">
								<a href={Config.FRONT_URL + '/help-center/'}>
									<img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
									Go TeleTherapist
								</a>
							</div>
						</div>
					)
				}
			</>
		)
	}


}
const mapStateToProps = (state) => {
	return {
		accountSimpleInfo: state.registers.accountSimpleInfo,
	}
};

export default connect(
	mapStateToProps,
	{
		getProviderByIdRole,
	}
)(Sidebar);


import React, {Component} from 'react';
import '../assets/css/settings.css';
import SettingsHeader from "./settings-header";

import {getPractice} from "../redux/actions/register/login-register";
import {connect} from "react-redux";

class SettingsPractice extends Component{
	constructor(props){
		super(props);
		this.state = {
			arrayList: '',
		}
	}
	componentDidMount(){
		const {
			getPractice
		} = this.props;

		if(getPractice){
			getPractice({
				id: localStorage.provider_id,
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.practiceList && prevProps.practiceList !== this.props.practiceList){
			this.setState({
				arrayList: this.props.practiceList,
			});
		}
	}
	render(){
		return (
			<>
				<div className="setting-body-p">
					<SettingsHeader/>

					<div className="practice-position">
						<div className="card-common txt-16 txt-medium">
							<div className="txt-18 col-darkBlue">Current</div>
							<div className="col-heavyDark pt-30 pb-10">
								A list of practices that you currently belong to. If you leave a practice, all of your associated data
								will be deleted.
							</div>
							<div>
								<hr/>
							</div>
							{
								this.state.arrayList && this.state.arrayList.map((item, key) => {
									return(
										<div key={key}>
											<div className="flex-practice justify-left">
												{
													!item.photo ?
														<div><img className="mouse-cursor" src={require('../assets/img/current-practice-icon.svg')} alt=""/></div>
														:
														<div><img className="mouse-cursor photo-size" src={item.photo} alt=""/></div>
												}
												<div className="align-left practice-pl">
													<div className="col-darkBlue">
														{item.name}'s practice,
														<span className="col-lightColor">
															{item.practice_name}
														</span>
													</div>
													<div className="col-buttonAndLink">
														You are the owner of this practice.
													</div>
												</div>
											</div>

											<div>
												<hr/>
											</div>
										</div>
									)
								})
							}
							{
								this.state.nCount === 0 && (
									<div>
										<div className="flex-practice">
											<div><img className="mouse-cursor" src={require('../assets/img/current-practice-icon.svg')}
																alt=""/></div>
											<div className="align-left practice-pl justify-center">
												<div className="col-buttonAndLink">You don't have any practice yet.</div>
											</div>
										</div>
										<div>
											<hr/>
										</div>
									</div>
								)
							}

							<div className="current"></div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		practiceList: state.registers.practiceList,
	}
};

export default connect(
	mapStateToProps,
	{
		getPractice,
	}
)(SettingsPractice);

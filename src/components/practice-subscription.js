import React, {Component} from 'react';
import '../assets/css/practice.css';
//import PracticesHeader from "./practice-header";
import SettingsHeader from "./settings-header";
import {ElementsConsumer} from '@stripe/react-stripe-js';
import {connect} from "react-redux";
import {
	getPricingPlans,
	getCurrentSubscription,
	createSubscription,
} from "../redux/actions/register/login-register";
import config from "../config";
import {Link} from "react-router-dom";

class PracticeSubscription extends Component{
	constructor(props){
		super(props);

		this.state = {
			selectedMenu: 1,
			plans: {},
		}
	}

	componentDidMount(){
		const {getPricingPlans, getCurrentSubscription} = this.props;
		getPricingPlans();
		getCurrentSubscription({user_id: localStorage.provider_id});
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevProps.pricing_plans !== this.props.pricing_plans){
			console.log("pricing plans:", this.props.pricing_plans);
			const plans = {};
			for(const plan of this.props.pricing_plans){
				plans[plan.id] = Math.round(plan.amount / 100);
			}
			this.setState({plans: plans});
		}
		if(prevProps.current_subscription !== this.props.current_subscription){
			console.log("current subscription:", this.props.current_subscription);

		}
	}

	selectMenu = n => {
		this.setState({selectedMenu: n});
	};

	pickPricingPlan = plan_id => {
		if(this.props.current_subscription){
			if(this.props.current_subscription.plan.id !== plan_id){
				if(!window.confirm("A subscription already created! If you create another, the old one will be deleted without a refund. Are you sure?"))
					return;
			}
			else
				return
		}

		console.log("picked pricing plan:", plan_id);
		const {createSubscription} = this.props;

		createSubscription({
			user_id: localStorage.provider_id,
			plan_id: plan_id,
		});
	};

	render(){
		return (
			<>
				<SettingsHeader/>
				<div className="subscription-body">
					<div className="align-right individual-plans">
						<div className="txt-16">
							<span className={this.state.selectedMenu === 1 ? 'btn-monthly-selected btn-monthly txt-medium mouse-cursor' : 'btn-monthly txt-medium mouse-cursor'}
								  onClick={() => this.selectMenu(1)}
							>
								Monthly
							</span>

							<span
								className={this.state.selectedMenu === 2 ? 'btn-monthly-selected btn-annualy txt-medium mouse-cursor' : 'btn-annualy txt-medium mouse-cursor'}
								onClick={() => this.selectMenu(2)}
							>
                            Annualy
                        </span>
						</div>
					</div>

					<div
						className="txt-18 txt-medium col-darkBlue individual-plans">{this.state.selectedMenu === 1 ? 'Monthly' : 'Yearly'} Plans
					</div>

					<div className="pb-20 txt-14 txt-medium col-lightColor">
						Individual plans are for solo therapists and small practices. You can hold both one-on-one and
						group sessions. As the owner, you are the first provider in your practice.
					</div>
				</div>
				<div>

					{/*<div className="pb-20 flex-grid3 subscription-grid3-gaps txt-12 txt-medium col-heavyDark">*/}
					{/*	<div className="card-subscription mouse-cursor" onClick={() => {*/}
					{/*		this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`]);*/}
					{/*	}}>*/}
					{/*		<div className="check" style={{*/}
					{/*			display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`] === this.props.current_subscription.plan.id ? 'block' : 'none'*/}
					{/*		}}><img src={require('../assets/img/check.svg')} alt=""/></div>*/}
					{/*		<div className="txt-18 col-darkBlue">BASIC</div>*/}
					{/*		<div className="pt-30">✓ 1 provider</div>*/}
					{/*		<div className="pt-10">✓ 5 online sessions per month</div>*/}
					{/*		<div className="pt-10">✓ Track your in-office sessions</div>*/}
					{/*		<div className="pt-10">✓ Client self-scheduling</div>*/}
					{/*		<div className="pb-60">✓ Custom availability rules</div>*/}
					{/*		<div className="txt-24 col-darkBlue price">*/}
					{/*			${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}*/}
					{/*		</div>*/}
					{/*	</div>*/}

					{/*	<div className="card-subscription mouse-cursor" onClick={() => {*/}
					{/*		this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`]);*/}
					{/*	}}>*/}
					{/*		<div className="check" style={{*/}
					{/*			display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`] === this.props.current_subscription.plan.id ? 'block' : 'none'*/}
					{/*		}}><img src={require('../assets/img/check.svg')} alt=""/></div>*/}
					{/*		<div className="txt-18 col-darkBlue">ADVANCED</div>*/}
					{/*		<div className="pt-30">✓ All features in Basic</div>*/}
					{/*		<div className="pt-10">✓ Unlimited sessions</div>*/}
					{/*		<div className="pt-10">✓ One office manager per provider</div>*/}
					{/*		<div className="pt-10">✓ Advanced client self-scheduling</div>*/}
					{/*		<div className="pt-10">✓ Document sharing</div>*/}
					{/*		<div className="pt-10">✓ Payment requests</div>*/}
					{/*		<div className="pt-10">✓ Scheduling from your website</div>*/}
					{/*		<div className="pt-10">✓ Custom appointment types</div>*/}
					{/*		<div className="pb-60">✓ Directory listing</div>*/}
					{/*		<div className="txt-24 col-darkBlue price">*/}
					{/*			${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}*/}
					{/*		</div>*/}
					{/*	</div>*/}

					{/*	<div className="card-subscription mouse-cursor" onClick={() => {*/}
					{/*		this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`]);*/}
					{/*	}}>*/}
					{/*		<div className="check" style={{*/}
					{/*			display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`] === this.props.current_subscription.plan.id ? 'block' : 'none'*/}
					{/*		}}><img src={require('../assets/img/check.svg')} alt=""/></div>*/}
					{/*		<div className="txt-18 col-darkBlue">ULTIMATE</div>*/}
					{/*		<div className="pt-10">✓ All features in Plus</div>*/}
					{/*		<div className="pt-10">✓ Session notes</div>*/}
					{/*		<div className="pt-10">✓ General notes</div>*/}
					{/*		<div className="pt-10">✓ Secure messaging</div>*/}
					{/*		<div className="pb-60">✓ Custom branding</div>*/}
					{/*		<div className="txt-24 col-darkBlue price">*/}
					{/*			${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</div>*/}

					<div className="">
						<div className="flex-grid3 shape">
							<div className="shape-payment1 col-shape-payment1 txt-16 col-white mouse-cursor" onClick={() => {
								this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`]);
							}}>
								<div className="rectangle-trans col-shape-payment1"></div>
								<div className="justify-center">
									<div className="txt-18 col-darkBlue">BASIC</div>
									<div className="check" style={{
										display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`] === this.props.current_subscription.plan.id ? 'block' : 'none'
									}}><img src={require('../assets/img/check.svg')} alt=""/></div>
								</div>
								<div className="pt-30">✓ 1 provider</div>
								<div className="pt-10">✓ 5 online sessions per month</div>
								<div className="pt-10">✓ Track your in-office sessions</div>
								<div className="pt-10">✓ Client self-scheduling</div>
								<div className="pb-60">✓ Custom availability rules</div>
								<div className="justify-center">
									<div className="txt-24 col-darkBlue price">
										${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_basic`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}
									</div>
								</div>
								<div className="btn-card col-shape-payment1 border-btn-1 txt-14 mouse-cursor">START FREE TRIAL</div>
							</div>

							<div className="shape-payment2 col-shape-payment2 txt-16 col-white mouse-cursor" onClick={() => {
								this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`]);
							}}>
								<div className="rectangle-trans col-shape-payment2"></div>
								<div className="justify-center">
									<div className="txt-18 col-darkBlue">ADVANCED</div>
									<div className="check" style={{
										display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`] === this.props.current_subscription.plan.id ? 'block' : 'none'
									}}><img src={require('../assets/img/check.svg')} alt=""/></div>
								</div>
								<div className="pt-30">✓ All features in Basic</div>
								<div className="pt-10">✓ Unlimited sessions</div>
								<div className="pt-10">✓ One office manager per provider</div>
								<div className="pt-10">✓ Advanced client self-scheduling</div>
								<div className="pt-10">✓ Document sharing</div>
								<div className="pt-10">✓ Payment requests</div>
								<div className="pt-10">✓ Scheduling from your website</div>
								<div className="pt-10">✓ Custom appointment types</div>
								<div className="pb-60">✓ Directory listing</div>
								<div className="justify-center">
									<div className="txt-24 col-darkBlue price">
										${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_plus`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}
									</div>
								</div>
								<div className="btn-card col-shape-payment2 border-btn-2 txt-14 mouse-cursor">START FREE TRIAL</div>
							</div>

							<div className="mobile-shape shape-payment3 col-shape-payment3 txt-16 col-white mouse-cursor" onClick={() => {
								this.pickPricingPlan(config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`]);
							}}>
								<div className="rectangle-trans col-shape-payment3"></div>

								<div className="justify-center">
									<div className="txt-18 col-darkBlue">ULTIMATE</div>
									<div className="check" style={{
										display: this.props.current_subscription && config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`] === this.props.current_subscription.plan.id ? 'block' : 'none'
									}}><img src={require('../assets/img/check.svg')} alt=""/></div>
								</div>

								<div className="pt-10">✓ All features in Plus</div>
								<div className="pt-10">✓ Session notes</div>
								<div className="pt-10">✓ General notes</div>
								<div className="pt-10">✓ Secure messaging</div>
								<div className="pb-60">✓ Custom branding</div>
								<div className="justify-center">
									<div className="txt-24 col-darkBlue price">
										${this.state.plans[config.STRIPE_PLANS_NAME_TO_ID[`${this.state.selectedMenu === 1 ? 'month' : 'year'}_individual_ultimate`]]} / {this.state.selectedMenu === 1 ? 'month' : 'year'}
									</div>
								</div>
								<div className="btn-card col-shape-payment3 border-btn-3 txt-14 mouse-cursor">START FREE TRIAL</div>
							</div>
						</div>
					</div>


					{this.props.current_subscription ? (
						<div className="txt-12 start-subscription">
							<div>
								<b>Subscription start:&nbsp;</b>
								{new Date(this.props.current_subscription.billing_cycle_anchor * 1000).toLocaleDateString('en-US')}
							</div>
							<div>
								<b>Current period:&nbsp;</b>
								{new Date(this.props.current_subscription.current_period_start * 1000).toLocaleDateString('en-US')}
								-
								{new Date(this.props.current_subscription.current_period_end * 1000).toLocaleDateString('en-US')}
							</div>
						</div>
					) : (
						<div className={"txt-12"}>
							It seems you have not register your billing info yet.
							<br/>
							Please go to <Link to={"/settings-profile"} style={{fontWeight: 600}}>profile page</Link> and enter your credit/debit card info.
						</div>
					)}
				</div>
			</>
		)
	}
}

const InjectedPracticeSubscription = (props) => {
	return (
		<ElementsConsumer>
			{({elements, stripe}) => (
				<PracticeSubscription elements={elements} stripe={stripe} {...props}/>
			)}
		</ElementsConsumer>
	);
};

export default connect(
	state => {
		return {
			pricing_plans: state.registers.pricing_plans,
			current_subscription: state.registers.current_subscription,
			spinning: state.registers.spinning,
		}
	},
	{
		getPricingPlans,
		getCurrentSubscription,
		createSubscription,
	}
)(InjectedPracticeSubscription);

import React, {Component} from 'react';
import '../assets/css/settings.css';
import SettingsHeader from "./settings-header";
import {
	getFullUserByIdRole,
	providerInfoUpdate,
	userAddressUpdate,
	providerAboutUpdate,
	reset,
} from '../redux/actions/register/login-register';

import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StyledDropzone from "./dropFile";
import StateProvince from "./state-province";
import CountriesList from "./country-list";
import {CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
import {SPECIAL_CATEGORIES, FILTER_LIST} from "../config/therapist-config";

const CARD_OPTIONS = {
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: '#c4f0ff',
			color: '#333',
			fontWeight: 400,
			fontFamily: 'Poppins, sans-serif',
			fontSize: '14px',
			':-webkit-autofill': {color: '#fce883'},
			'::placeholder': {color: '#ccc'},
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee',
		},
	},
};

class SettingsProfile extends Component{
	constructor(props){
		super(props);
		this.tmr = null;
		this.state = {
			menuVisible: false,
			checked: [],

			menuVisibleCategory: false,
			special_checked: [],

			account: '',
			name: '',
			email: '',
			phone: '',
			updated_date: new Date().toLocaleTimeString([], {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: 'numeric',
				minute: '2-digit'
			}),
			photo: '',
			bigPhoto: '',
			showPhoto: '',

			bgPhoto: '',
			showBgPhoto: '',

			cardholder_name: '',
			address1: '',
			address2: '',
			city: '',
			state_province: '',
			zip_code: '',
			country: 'US',

			about: '',
			license_info: '',
			cost: '',
			gender: '',
			age: '',
		};
	}

	componentDidMount(){
		const {
			getFullUserByIdRole
		} = this.props;
		if(getFullUserByIdRole){
			const data = {
				id: localStorage.provider_id,
				role: 'provider',
			};

			getFullUserByIdRole(data);
		}

		this.setState({
			country: 'US',
			state_province: 'Alabama',
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.providerFullInfo && prevProps.providerFullInfo !== this.props.providerFullInfo){
			this.setState({
				account: this.props.providerFullInfo,
				showPhoto: this.props.providerFullInfo.photo,
				showBgPhoto: this.props.providerFullInfo.bgPhoto,
				checked: this.props.providerFullInfo.expertise,
				special_checked: this.props.providerFullInfo.category? this.props.providerFullInfo.category : [],
				gender: this.props.providerFullInfo.gender? this.props.providerFullInfo.gender: 'Male',
				country: this.props.providerFullInfo.country? this.props.providerFullInfo.country: "US",
			});
			if(this.props.providerFullInfo.state_province) {
				this.setState({
					state_province: this.props.providerFullInfo.state_province,
				})
			}
		}

		if((this.state.country !== 'US') && (prevState.country !== this.state.country)){
			this.setState({
				state_province: '',
			});
		}

		if(this.state.photo && prevState.photo !== this.state.photo){
			this.setState({
				showPhoto: this.state.photo,
			});
		}

		if(this.state.bgPhoto && prevState.bgPhoto !== this.state.bgPhoto){
			this.setState({
				showBgPhoto: this.state.bgPhoto,
			});
		}

		if(prevProps.account_link !== this.props.account_link && this.props.account_link){
			window.open(this.props.account_link, "_new");
		}

		if(this.props.msg_profile_update && prevProps.msg_profile_update !== this.props.msg_profile_update) {
			toast(this.props.msg_profile_update);
			const {
				reset,
			} = this.props;
			clearTimeout(this.tmr);
			this.tmr = setTimeout(function () {
				reset();
				this.tmr = null;
			}, 2500);

		}
	}

	toggleMenu = () => {
		this.setState({
			menuVisible: !this.state.menuVisible,
		})
	};

	toggleMenuCategory = () => {
		this.setState({
			menuVisibleCategory: !this.state.menuVisibleCategory,
		})
	};

	onCheck = (e) => {
		const {checked} = this.state;
		const temp = JSON.parse(JSON.stringify(checked));
		if(e.target.checked === true){
			temp.push(e.target.id);
		}
		else{
			temp.splice(temp.indexOf(e.target.id), 1);
		}
		this.setState({checked: temp});
	};

	onCategoryCheck = (e) => {
		const {special_checked} = this.state;
		const temp = JSON.parse(JSON.stringify(special_checked));
		if(e.target.checked === true){
			temp.push(e.target.id);
		}
		else{
			temp.splice(temp.indexOf(e.target.id), 1);
		}
		this.setState({special_checked: temp});
	};

	handleCountryChange = (e) => {
		this.setState({
			country: e.target.value,
		});
	};

	handleProvinceChange = (e) => {
		this.setState({
			state_province: e.target.value,
		});
	};

	onChange = (e) => {
    	this.setState({
			[e.target.id]: e.target.value || ''
    	});
	};

	onGender = (e) => {
		this.setState({
			gender: e.target.value,
		});
	};

	onPhoneChange = (e) => {
		this.setState({[e.target.id]: parseFloat(e.target.value || 0)});
	};

	infoUpdate = () => {
		const data = {
			id: this.state.account._id,
			name: this.state.name ? this.state.name : this.state.account.name,
			email: this.state.email ? this.state.email : this.state.account.email,
			phone: this.state.phone ? this.state.phone : this.state.account.phone,
			gender: this.state.gender,
			age: this.state.age? new Date().getFullYear() - this.state.age: (this.state.account.age? this.state.account.age: ''),

			updated_date: this.state.updated_date ? this.state.updated_date : this.state.account.updated_date,
			photo: this.state.photo ? this.state.photo : this.state.account.photo,
			bgPhoto: this.state.bgPhoto ? this.state.bgPhoto : this.state.account.bgPhoto,
			_provider_id: localStorage.provider_id,
			role: 'provider',
		};

		const {
			providerInfoUpdate,
		} = this.props;

		providerInfoUpdate(data);
	};

	addressUpdates = async () => {
		const card = this.props.elements.getElement(CardElement);
		const result = await this.props.stripe.createToken(card);

		if(result.error){
			console.log("Invalid card:", result.error);
			toast(result.error.message.toString());
		}
		else{
			const {userAddressUpdate} = this.props;
			userAddressUpdate({
				id: this.state.account._id,
				email: localStorage.provider_email,
				address1: this.state.address1 ? this.state.address1 : this.state.account.address1,
				address2: this.state.address2 ? this.state.address2 : this.state.account.address2,
				city: this.state.city ? this.state.city : this.state.account.city,
				state_province: this.state.state_province ? this.state.state_province : this.state.account.state_province,
				zip_code: result.token.card.address_zip || (this.state.zip_code ? this.state.zip_code : this.state.account.zip_code),
				country: this.state.country,
				updated_date: this.state.updated_date ? this.state.updated_date : this.state.account.updated_date,
				role: 'provider',
				cardholder_name: this.state.cardholder_name,
				token: result.token.id,
			});
		}
	};

	setFileUploadUrl = (url, name) => {
		if(url === 'Format'){
			toast("Only .png, .jpeg and .jpg format allowed.");
		}
		else{
			this.setState({
				bgPhoto: url,
			})
		}
	};

	aboutUpdate = () => {
		const data = {
			id: this.state.account._id,
			about: this.state.about ? this.state.about : this.state.account.about,
			license_info: this.state.license_info ? this.state.license_info : this.state.account.license_info,
			cost: this.state.cost ? this.state.cost : this.state.account.cost,
			expertise: this.state.checked ? this.state.checked : [],
			category: this.state.special_checked ? this.state.special_checked : [],
			role: 'provider',
		};

		const {
			providerAboutUpdate
		} = this.props;

		providerAboutUpdate(data);
		this.setState({
			menuVisibleCategory: false,
		});
		if(this.state.menuVisible === true){
			this.toggleMenu();
		}
	};

	photoUpload = (e) => {
		const url = e.target.files[0];
		if(url){
			const reader = new FileReader();
			reader.onload = fileEvent => {
				this.cropImage(fileEvent.target.result, 120)
					.then(croppedImg => {
						this.setState({
							photo: croppedImg,
						})
					})
					.catch(err => {
						console.log(err);
					});

				this.cropImage(fileEvent.target.result, 150)
					.then(croppedImg => {
						this.setState({
							bigPhoto: croppedImg,
						})
					})
					.catch(err => {
						console.log(err);
					});
			};
			reader.readAsDataURL(url);
		}
	};

	cropImage = (url, size, key) => {
		return new Promise(resolve => {
			// this image will hold our source image data
			const inputImage = new Image();
			// we want to wait for our image to load
			inputImage.onload = () => {
				// let's store the width and height of our image
				const minLength = Math.min(inputImage.naturalWidth, inputImage.naturalHeight);
				// calculate the position to draw the image at
				const offsetX = (inputImage.naturalWidth - minLength) / 2;
				const offsetY = (inputImage.naturalHeight - minLength) / 2;
				// create a canvas that will present the output image
				const outputImage = document.createElement('canvas');
				// set it to the same size as the image
				outputImage.width = size;
				outputImage.height = size;
				// draw our image at position 0, 0 on the canvas
				const ctx = outputImage.getContext('2d');
				ctx.drawImage(inputImage, offsetX, offsetY, minLength, minLength, 0, 0, size, size);
				resolve(outputImage.toDataURL('image/png', 0.4));
			};
			// start cropping
			inputImage.src = url;
		})
	};

	render(){
		return (
			<>
				<div className="setting-body-p">
					<SettingsHeader/>

					<div>
						<ToastContainer/>
					</div>
					<div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
						<div className="lds-dual-ring"/>
					</div>

					<div className="btnBar-pt">
						<div className="profile-grid5">
							<div className="photo-box">
								<div
									className={this.state.showBgPhoto ? 'photo-upBg bg-position' : "photo-upBg linear-bg"}
									style={{backgroundImage: this.state.showBgPhoto ? 'url(' + this.state.showBgPhoto + ')' : ''}}
								>
									<img
										className="photo-virtual"
										src={
											this.state.showPhoto
												?
												this.state.showPhoto
												:
												require('../assets/img/virtual-uploadPhoto.svg')}
										alt=""
									/>
								</div>
								<div className="new-photo-pt align-center">
									<div
										className="pb-10 txt-24 col-darkBlue justify-center">{this.state.account.name}</div>
									<input
										type="file"
										id="owner_picture"
										accept="image/*"
										className="custom-file-input"
										onChange={(event) => this.photoUpload(event)}
										required
									/>
									<div className="document pt-20 pb-20">
										<StyledDropzone func={this.setFileUploadUrl} btnText="Upload Background Image"/>
									</div>

									<div className="txt-12 col-lightColor">
										{
											this.state.account.updated_date ? 'Updated at ' + this.state.account.updated_date : "Updated at September 10, 2020 12: 00 PM"
										}
									</div>
								</div>
							</div>

							<div className="info-box">
								<div className="txt-18 txt-medium col-darkBlue">User Info</div>
								<div className="pt-20 col-heavyDark">Name</div>
								<input
									id={'name'}
									type="text"
									className="userInfo"
									placeholder={this.state.account.name}
									value={this.state.name}
									onChange={this.onChange}
									required
								/>

								<div className="pt-20 col-heavyDark">Email</div>
								<input
									id={'email'}
									type="email"
									className="userInfo"
									placeholder={this.state.account.email}
									value={this.state.email}
									onChange={this.onChange}
									required
								/>

								<div className="flex-space">
									<div className='gender-age'>
										<div className="pt-20 col-heavyDark">Gender</div>
										<select
											className="col-black"
											defaultValue={this.state.gender && this.state.gender}
											onChange={this.onGender}
										>
											<option value="Male" selected={this.state.gender && this.state.gender === "Male" && true}>Male</option>
											<option value="Female" selected={this.state.gender && this.state.gender === "Female" && true}>Female</option>
										</select>
									</div>

									<div className='gender-age'>
										<div className="pt-20 col-heavyDark">Age</div>
										<input
											id={'age'}
											type="number"
											placeholder={this.state.account.age? new Date().getFullYear() - this.state.account.age: "Age"}
											value={this.state.age}
											onChange={this.onChange}
											required
										/>
									</div>
								</div>

								<div className="pt-20 col-heavyDark">Phone</div>
								<div className="flex-space">
									<input
										id={'phone'}
										type="tel"
										placeholder={this.state.account.phone ? this.state.account.phone : 12345678}
										value={this.state.phone}
										onChange={this.onPhoneChange}
										required
									/>
									<div className="btn-common userInfo mouse-cursor" onClick={this.infoUpdate}>Update
									</div>
								</div>
							</div>
						</div>

						<div className="pt-20">
							<div className="info-address">
								<div className="txt-18 col-darkBlue">Billing info &amp; address</div>
								<div className={"card-element-cont"}>
									<div className={"pt-20"}>
										<input
											id={'cardholder_name'}
											type="text"
											placeholder={"Cardholder's name"}
											value={this.state.cardholder_name}
											onChange={this.onChange}
											required
										/>
									</div>
									<div className={"pt-20"}>
										<div className={"stripe-element-cont"}>
											<CardElement
												options={CARD_OPTIONS}
											/>
										</div>
									</div>
								</div>

								<div className="txt-16 col-heavyDark pt-20">Address Line 1</div>
								<input
									id={'address1'}
									type="text"
									placeholder={this.state.account.address1? this.state.account.address1 : "Address Line 1"}
									value={this.state.address1}
									onChange={this.onChange}
									required
								/>

								<div className="txt-16 col-heavyDark pt-20">Address Line 2</div>
								<input
									id={'address2'}
									type="text"
									placeholder={this.state.account.address2? this.state.account.address2 : "Address Line 2"}
									value={this.state.address2}
									onChange={this.onChange}
									required
								/>

								<div className="country-state-city">
									<div>
										<div className="txt-16 col-heavyDark pt-20">City</div>
										<input
											id={'city'}
											type="text"
											placeholder={this.state.account.city? this.state.account.city : "City"}
											value={this.state.city}
											onChange={this.onChange}
											required
										/>
									</div>
									<div>
										<div className="txt-16 col-heavyDark pt-20">State / Province /
											Region
										</div>
										{this.state.country === "US" ? (
											<select value={this.state.state_province} onChange={this.handleProvinceChange}>
												<StateProvince/>
											</select>
										) : (
											<input
												id={'state_province'}
												type="text"
												placeholder={this.state.account.state_province? this.state.account.state_province : 'State / Province / Region'}
												value={this.state.state_province}
												onChange={this.onChange}
												required
											/>
										)}
									</div>

								</div>
								<div className="country-state-city">
									<div>
										<div className="txt-16 col-heavyDark pt-20">ZIP / Postal Code</div>
										<input
											id={'zip_code'}
											type="text"
											placeholder={this.state.account.zip_code? this.state.account.zip_code : "ZIP / Postal Code"}
											value={this.state.zip_code}
											onChange={this.onChange}
											required
										/>
									</div>

									<div>
										<div className="txt-16 col-heavyDark pt-20">Country</div>
										<select
											value={this.state.country}
											onChange={this.handleCountryChange}
										>
											<CountriesList/>
										</select>
									</div>
								</div>
								<div className="update-pt">
									<button className="btn-common address mouse-cursor"
											disabled={!this.props.stripe}
											onClick={this.addressUpdates}
									>
										Update
									</button>
								</div>
							</div>
						</div>

						<div className="pt-20 pb-60">
							<div className="info-address">
								<div className="txt-18 col-darkBlue">My Info</div>
								<div className="txt-16 col-heavyDark pt-10">About Provider</div>
								<textarea
									id={'about'}
									placeholder={this.state.account.about ? this.state.account.about :"About Provider"}
									value={this.state.about}
									onChange={this.onChange}
									required
								/>

								<div className="txt-16 col-heavyDark pt-10">License Info</div>
								<textarea
									id={'license_info'}
									placeholder={this.state.account.license_info? this.state.account.license_info : 'license_info'}
									value={this.state.license_info}
									onChange={this.onChange}
									required
								/>

								<div className="txt-16 col-heavyDark pt-10">Cost of Service</div>
								<input
									id={'cost'}
									type="Number"
									placeholder={this.state.account.cost? this.state.account.cost : "Cost"}
									value={this.state.cost}
									onChange={this.onChange}
									required
								/>

								<div className="general-flex filter-label mouse-cursor" onClick={this.toggleMenu}>
									<div className="txt-16 col-heavyDark">Specialty</div>
									<img className="down-up-pl" src={require('../assets/img/down-icon.svg')} alt=""/>
								</div>

								{
									this.state.menuVisible && (
										<div className="content">
											<div className="flex-grid4">
												{
													FILTER_LIST && Object.keys(FILTER_LIST).map((item, key) => {
														return (
															<label className="container-event align-l" key={key}>
																<div className="txt-14 text-nowrap">{FILTER_LIST[item]}</div>
																<input
																	id={item}
																	type="checkbox"
																	checked={this.state.checked.includes(item)}
																	onChange={this.onCheck}
																/>
																<span className="checkMark"/>
															</label>
														)
													})
												}
											</div>
										</div>
									)
								}

								<div className="pt-20 general-flex filter-label mouse-cursor" onClick={this.toggleMenuCategory}>
									<div className="txt-16 col-heavyDark">Specialist Category</div>
									<img className="down-up-pl" src={require('../assets/img/down-icon.svg')} alt=""/>
								</div>

								{
									this.state.menuVisibleCategory && (
										<div className="content">
											<div className="flex-grid4">
												{
													SPECIAL_CATEGORIES && Object.keys(SPECIAL_CATEGORIES).map((item, key) => {
														return (
															<label className="container-event align-l" key={key}>
																<div className="txt-14 text-nowrap">{SPECIAL_CATEGORIES[item]}</div>
																<input
																	id={item}
																	type="checkbox"
																	checked={this.state.special_checked.includes(item)}
																	onChange={this.onCategoryCheck}
																/>
																<span className="checkMark"/>
															</label>
														)
													})
												}
											</div>
										</div>
									)
								}

								<div className="update-pt">
									<div className="btn-common address mouse-cursor"
											 onClick={this.aboutUpdate}>Update
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

const InjectedSettingsProfile = (props) => {
	return (
		<ElementsConsumer>
			{({elements, stripe}) => (
				<SettingsProfile elements={elements} stripe={stripe} {...props}/>
			)}
		</ElementsConsumer>
	);
};

export default connect(
	state => {
		return {
			providerFullInfo: state.registers.providerFullInfo,
			account_link: state.registers.account_link,
			msg_profile_update: state.registers.msg_profile_update,
			spinning: state.registers.spinning,
		}
	},
	{
		getFullUserByIdRole,
		providerInfoUpdate,
		userAddressUpdate,
		providerAboutUpdate,
		reset,
	}
)(InjectedSettingsProfile);

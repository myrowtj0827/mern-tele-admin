import React, {Component} from 'react';
import '../assets/css/views.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CountriesList from "./country-list";
import StateProvince from "./state-province";
import {SPECIAL_CATEGORIES, FILTER_LIST} from "../config/therapist-config";
import {
    getFullUserByIdRole,
    getSimpleUsers,
    providerInfoUpdate,
    userAddressUpdate,
    providerAboutUpdate,
} from '../redux/actions/register/login-register';
import {connect} from "react-redux";
import DeleteUser from "./user-delete-modal";
import StyledDropzone from "./dropFile";
import PeopleAddProfile from "./people-add-profile";

class ProviderManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flag_initial: 0,
            user_account: '',
            menuVisible: false,
            checked: [],
            account: '',
            name: '',
            email: '',
            phone: '',
            photo: '',
            bgPhoto: '',
            address1: '',
            address2: '',
            city: '',
            state_province: '',
            zip_code: '',
            country: 'US',

            about: '',
            license_info: '',
            cost: '',

            menuVisibleCategory: false,
            special_checked: [],
            /**
             * provider table
             */
            provider_page_num: '',
            provider_current_page: 1,
            provider_page_neighbours: 2,
            provider_pagination: 6,
            providerList: '',
            selectedProvider_id: '',
            downUpSettings: false,
            flag_update: false,
            flag_focus: false,

            /**
             * Delete Modal
             */
            show: false,
            deleteId: '',

            /**
             * Add the provider
             */
            modalVisible: false,
            send_data: '',

            gender: '',
            age: '',
        };

        this.tmr = null;
    }

    componentDidMount() {
        this.initial(this.state.provider_page_num);

        this.setState({
            country: 'US',
            state_province: 'Alabama',
        });

        const {
            getFullUserByIdRole,
        } = this.props;

        if (getFullUserByIdRole) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };

            this.setState({
                flag_initial: 1,
            });
            getFullUserByIdRole(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userList && prevProps.userList !== this.props.userList) {
            this.setState({
                providerList: this.props.userList.list,
                provider_page_num: this.props.userList.page_num,
            })
        }

        if (this.props.providerFullInfo && prevProps.providerFullInfo !== this.props.providerFullInfo) {
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
            if ((this.state.country !== 'US') && (prevState.country !== this.state.country)) {
                this.setState({
                    state_province: '',
                });
            }
            if(this.state.flag_initial === 1) {
                this.setState({
                    user_account: this.props.providerFullInfo.main_provider_id,
                    flag_initial: 0,
                });
            }
        }



        if (this.state.photo && prevState.photo !== this.state.photo) {
            this.setState({
                showPhoto: this.state.photo,
            });
        }

        if (this.state.bgPhoto && prevState.bgPhoto !== this.state.bgPhoto) {
            this.setState({
                showBgPhoto: this.state.bgPhoto,
            });
        }

        if (this.props.msg_profile_update && ((prevState.flag_update !== this.state.flag_update) || (prevState.flag_update === true && this.state.flag_update === true && this.state.flag_focus === false))) {
            toast(this.props.msg_profile_update);
            this.setState({
                flag_focus: true,
            });
        }
    }

    notify = () => {
        toast("The personal information updated successfully.");
    };

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

    showAddProviderModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            send_data: {
                add_role: 'provider',
                provider_id: localStorage.provider_id,
            },
        })
    };

    hideAddProviderModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    showModal = (_id, main_role) => {
        this.setState({
            show: true,
            deleteId: _id,
        });
    };

    hideModal = () => {
        this.setState({show: false});
    };

    initial = (page) => {
        const {
            getSimpleUsers,
        } = this.props;

        if (getSimpleUsers) {
            const role = {
                id: localStorage.provider_id,
                role: 'provider',
                client_current_page: page,
                client_page_neighbours: this.state.provider_page_neighbours,
                client_pagination: this.state.provider_pagination,
            };
            getSimpleUsers(role);
        }
    };

    handleCountryChange = (e) => {
        this.setState({
            country: e.target.value,
            flag_focus: true,
        });
    };

    handleProvinceChange = (e) => {
        this.setState({
            state_province: e.target.value,
            flag_focus: true,
        });
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
            flag_focus: true,
        });
    };

    onCheck = e => {
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

    onCategoryCheck = e => {
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

    onGender = (e) => {
        this.setState({
            gender: e.target.value,
        });
    };

    onPhoneChange = (e) => {
        this.setState({
            [e.target.id]: parseFloat(e.target.value || 0),
            flag_focus: true,
        });
    };

    onProviderPageClick = (item) => {
        this.setState({
            provider_current_page: item,
            selectedProvider_id: '',
            downUpSettings: false,
        });

        const {
            getSimpleUsers
        } = this.props;

        const data = {
            id: localStorage.provider_id,
            role: "provider",
            client_current_page: item,
            client_page_neighbours: this.state.provider_page_neighbours,
            client_pagination: this.state.provider_pagination,
        };

        if (getSimpleUsers) {
            getSimpleUsers(data);
        }
    };

    onProviderDetail = (id, main_role) => {
        if (this.state.selectedProvider_id === id) {
            this.setState({
                selectedProvider_id: '',
                downUpSettings: true,
            });
        } else {
            this.setState({
                selectedProvider_id: id,
                downUpSettings: false,
            });
        }

        const {
            getFullUserByIdRole,
        } = this.props;

        if (getFullUserByIdRole) {
            const data = {
                id: id,
                role: 'provider',
            };
            getFullUserByIdRole(data);
        }
    };

    initialUser = () => {
        this.onProviderPageClick(this.state.provider_current_page);
        this.setState({
            account: '',
            name: '',
            email: '',
            phone: '',
            photo: '',

            address1: '',
            address2: '',
            city: '',
            state_province: '',
            zip_code: '',
            country: '',

            gender: '',
            age: '',
        });
    };

    infoUpdate = () => {
        if (this.state.email) {
            let temp = this.state.email.includes('@') && this.state.email.includes('.');
            if (temp === false) {
                toast("Please input the valid email.");
                return;
            }
        }

        this.setState({
            flag_update: !this.state.flag_update,
            flag_focus: false,
        });

        const data = {
            id: this.state.account._id,
            name: this.state.name ? this.state.name : this.state.account.name,
            email: this.state.email ? this.state.email : this.state.account.email,
            phone: this.state.phone ? this.state.phone : this.state.account.phone,
            gender: this.state.gender,
            age: this.state.age? new Date().getFullYear() - this.state.age: (this.state.account.age? this.state.account.age: ''),

            photo: this.state.photo ? this.state.photo : this.state.account.photo,
            bgPhoto: this.state.bgPhoto ? this.state.bgPhoto : this.state.account.bgPhoto,
            role: 'provider',
            localUpdate: false,
        };

        const {
            providerInfoUpdate
        } = this.props;

        providerInfoUpdate(data);

        this.initialUser();
    };

    addressUpdate = async () => {
        this.setState({
            flag_update: !this.state.flag_update,
            flag_focus: false,
        });

        const {
            userAddressUpdate
        } = this.props;
        const data = {
            id: this.state.account._id,
            address1: this.state.address1 ? this.state.address1 : this.state.account.address1,
            address2: this.state.address2 ? this.state.address2 : this.state.account.address2,
            city: this.state.city ? this.state.city : this.state.account.city,
            state_province: this.state.state_province ? this.state.state_province : this.state.account.state_province,
            zip_code: this.state.zip_code ? this.state.zip_code : this.state.account.zip_code,
            country: this.state.country,
            role: 'provider',
        };
        userAddressUpdate(data);
        this.initialUser();
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
        this.notify();
        if(this.state.menuVisible === true){
            this.toggleMenu();
            this.toggleMenuCategory();
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

    photoUpload = (e) => {
        this.setState({
            flag_focus: true,
        });

        const url = e.target.files[0];
        if (url) {
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

    toggleShow = () => {
        this.setState({
            downUpSettings: !this.state.downUpSettings,
        });
    };

    render() {
        const clientPageArray = [];
        if (this.state.provider_page_num) {
            for (let k = this.state.provider_page_num.start_page; k <= this.state.provider_page_num.end_page; k++) {
                clientPageArray.push(k);
            }
        }
        return (
            <>
                <ToastContainer/>
                {
                    this.state.user_account && this.state.user_account === 'false' && (
                        <div className="flex-space people-profile">
                            <div className="btn-common txt-16 justify-center col-white mouse-cursor" onClick={this.showAddProviderModal}>
                                <img className="mouse-cursor" style={{paddingRight: 20}}
                                     src={require('../assets/img/people-icon1.svg')} alt=""/>
                                Add New Provider
                            </div>
                        </div>
                    )
                }

                <div className="table-common">
                    <div className="patient-header justify-center col-white">
                        Provider List
                    </div>

                    <div className="table-p txt-14">
                        <div className="table-border">
                            <table id="tAppt">
                                <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.providerList && this.state.providerList.map((item, key) => {
                                        let display_phone = '';
                                        if(item.phone) {
                                            let phone = (item.phone).toString();
                                            for (let k = 0; k < phone.length; k ++) {
                                                let m = phone.slice(k,k + 1);
                                                if (k === 3 || k === 6) {
                                                    m = "-" + m;
                                                }
                                                display_phone += m;
                                            }
                                        }
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <img className="photo-list"
                                                         src={item.photo ? item.photo : require('../assets/img/people-icon0.svg')}
                                                         alt=""/>
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.phone && display_phone}</td>
                                                <td>
                                                    {
                                                        item.main_provider_id === localStorage.provider_id && (
                                                            <div className="justify-left">
                                                                <img className="mouse-cursor" style={{paddingRight: 20}}
                                                                     src={require('../assets/img/people-icon3.svg')}
                                                                     onClick={() => this.onProviderDetail(item._id, item.main_provider_id)} alt=""/>
                                                                <img className="mouse-cursor"
                                                                     src={require('../assets/img/people-icon2.svg')}
                                                                     onClick={() => this.showModal(item._id, item.main_provider_id)} alt=""/>
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-30 justify-center">
                            <div className="product-btn table justify-center" onClick={() => this.onProviderPageClick(1)}>
                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                        fill="black" fillOpacity="0.65"/>
                                </svg>
                            </div>

                            {
                                this.state.provider_page_num && clientPageArray && clientPageArray.map((item, key) => {
                                    return (
                                        <div
                                            className={this.state.provider_current_page && this.state.provider_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                            key={key}
                                            onClick={() => this.onProviderPageClick(item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                })
                            }

                            <div className="product-btn table justify-center"
                                 onClick={() => this.onProviderPageClick(this.state.provider_page_num.total_page)}>
                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                        fill="black" fillOpacity="0.65"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    this.state.selectedProvider_id !== '' && (
                        <div className="btnBar-pt">
                            <div className="profile-grid5 pb-30">
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
                                        <div className="pt-20 pb-20 txt-24 col-darkBlue justify-center">
                                            {this.state.account.name}
                                        </div>
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
                                        <div className="pt-30 txt-12 col-lightColor">
                                            {
                                                this.state.account.updated_date ? 'Updated at ' + this.state.account.updated_date : "Updated at September 10, 2020 12: 00 PM"
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="info-box">
                                    <div className="txt-18 txt-medium col-darkBlue">User Info</div>
                                    <div className="pt-30">
                                        <input
                                            id={'name'}
                                            type="text"
                                            className="userInfo"
                                            placeholder={this.state.account.name ? this.state.account.name : 'Name'}
                                            value={this.state.name}
                                            onChange={this.onChange}
                                            required
                                        />
                                    </div>

                                    <div className="pt-30">
                                        <input
                                            id={'email'}
                                            type="email"
                                            className="userInfo"
                                            placeholder={this.state.account.email ? this.state.account.email : 'Email'}
                                            value={this.state.email}
                                            onChange={this.onChange}
                                            required
                                        />
                                    </div>

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

                                    <div className="pt-30 col-heavyDark">
                                        <div className="flex-space client">
                                            <input
                                                id={'phone'}
                                                type="tel"
                                                placeholder={this.state.account.phone ? this.state.account.phone : 12345678}
                                                value={this.state.phone}
                                                onChange={this.onPhoneChange}
                                                required
                                            />
                                            <div className="btn-common userInfo mouse-cursor"
                                                 onClick={this.infoUpdate}>Update
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-30 justify-right mouse-cursor" onClick={this.toggleShow}>
                                        <div className="txt-14 more-click">Show more</div>
                                        {
                                            this.state.downUpSettings ?
                                                <div className="add-icon"><img
                                                    src={require('../assets/img/up-arrow.svg')}
                                                    alt=""/></div>
                                                :
                                                <div className="add-icon"><img
                                                    src={require('../assets/img/down-arrow.svg')}
                                                    alt=""/></div>
                                        }
                                    </div>
                                </div>
                            </div>

                            {
                                this.state.downUpSettings ? (
                                        <div className="pt-20 pb-30">
                                            <div className="info-address">
                                                <div className="txt-18 col-darkBlue">Address Info</div>

                                                <div className="txt-16 col-heavyDark pt-20">Address Line 1</div>
                                                <input
                                                    id={'address1'}
                                                    type="text"
                                                    placeholder={this.state.account.address1 ? this.state.account.address1 : 'Address Line 1'}
                                                    value={this.state.address1}
                                                    onChange={this.onChange}
                                                    required
                                                />

                                                <div className="txt-16 col-heavyDark pt-20">Address Line 2</div>
                                                <input
                                                    id={'address2'}
                                                    type="text"
                                                    placeholder={this.state.account.address2 ? this.state.account.address2 : 'Address Line 2'}
                                                    value={this.state.address2}
                                                    onChange={this.onChange}
                                                    required
                                                />

                                                <div className="country-state-city client">
                                                    <div>
                                                        <div className="txt-16 col-heavyDark pt-20">City</div>
                                                        <input
                                                            id={'city'}
                                                            type="text"
                                                            placeholder={this.state.account.city ? this.state.account.city : 'City'}
                                                            value={this.state.city}
                                                            onChange={this.onChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="txt-16 col-heavyDark pt-20">State / Province /
                                                            Region
                                                        </div>
                                                        {
                                                            this.state.country === "US" ?
                                                                <select value={this.state.state_province} onChange={this.handleProvinceChange}>
                                                                    <StateProvince/>
                                                                </select>
                                                                :
                                                                <input
                                                                    id={'state_province'}
                                                                    type="text"
                                                                    placeholder={this.state.account.state_province ? this.state.account.state_province : 'State / Province / Region'}
                                                                    value={this.state.state_province}
                                                                    onChange={this.onChange}
                                                                    required
                                                                />
                                                        }
                                                    </div>

                                                </div>
                                                <div className="country-state-city client">
                                                    <div>
                                                        <div className="txt-16 col-heavyDark pt-20">ZIP / Postal Code</div>
                                                        <input
                                                            id={'zip_code'}
                                                            type="text"
                                                            placeholder={this.state.account.zip_code ? this.state.account.zip_code : 'ZIP / Postal Code'}
                                                            value={this.state.zip_code}
                                                            onChange={this.onChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="txt-16 col-heavyDark pt-20">Country</div>
                                                        <select value={this.state.country} onChange={this.handleCountryChange}>
                                                            <CountriesList/>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="update-pt">
                                                    <div className="btn-common address mouse-cursor"
                                                         onClick={this.addressUpdate}>Update
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            {
                                this.state.downUpSettings?
                                    <div className="pt-20 pb-30">
                                        <div className="info-address">
                                            <div className="txt-18 col-darkBlue">About Info</div>
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
                                                type="text"
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
                                    :
                                    null
                            }
                        </div>
                    )
                }

                {/*  Modal  */}
                <DeleteUser show={this.state.show} deleteId={this.state.deleteId} role={"provider"}
                            handleClose={this.hideModal}/>

                <PeopleAddProfile show={this.state.modalVisible} data={this.state.send_data} handleClose={this.hideAddProviderModal} />
            </>
        )
    }
}

export default connect(
    state => {
        return {
            providerFullInfo: state.registers.providerFullInfo,
            userList: state.registers.userList,
            msg_profile_update: state.registers.msg_profile_update,
        }
    },
    {
        getFullUserByIdRole,
        providerInfoUpdate,
        getSimpleUsers,
        userAddressUpdate,
        providerAboutUpdate,
    }
)(ProviderManagement);
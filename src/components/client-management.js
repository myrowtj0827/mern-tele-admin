import React, {Component} from 'react';
import '../assets/css/views.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CountriesList from "./country-list";
import StateProvince from "./state-province";

import {
    resetMsg,
    getFullUserByIdRole,
    providerInfoUpdate,
    getSimpleUsers,
    userAddressUpdate,
} from '../redux/actions/register/login-register';
import {
    getAppointmentByIds,
} from "../redux/actions/register/create-appointment";
import {
    getMessageOne
} from "../redux/actions/register/messages";

import {
    getDocumentOne
} from "../redux/actions/register/documents";

import {
    postNotes,
    getNotes,
    getOneNote,
    updateNotes,
    deleteNotes,
    articleImageUpload,
    reset,
} from "../redux/actions/register/articles";

import {connect} from "react-redux";
import DeleteUser from "./user-delete-modal";
import PeopleAddProfile from "./people-add-profile";
import EditAppointment from "./appointment-edit";
import {Link} from "react-router-dom";

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    EditorState,
    ContentState,
    convertToRaw,
} from 'draft-js';

let current_page = 1;
let page_neighbours = 1;
let pagination = 6;
class ClientManagement extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            user_account: '',
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
            country: 'US',

            /**
             * client table
             */
            client_page_num: '',
            client_current_page: 1,
            client_page_neighbours: 2,
            client_pagination: 6,
            clientList: '',
            selectedClient_id: '',
            downUpSettings: false,
            flag_update: false,
            flag_focus: false,

            /**
             * Delete Modal
             */
            show: false,
            deleteId: '',

            /**
             * Create the appointment Modal
             */
            modalVisible: false,
            send_data: '',

            gender: '',
            age: '',

            selectedBtn: 0,
            menuVisible: false,

            appointmentList: '',
            messageList: '',
            documentList: '',

            /**
             * appointment list
             */
            flag: 1,
            arrayAppt: [],
            accept_flag: false,

            appointment_page_num: '',
            appointment_current_page: current_page,
            appointment_pagination: pagination,
            appointment_page_neighbours: page_neighbours,

            itemAppt: '',
            edit_show: '',
            clientArray: '',

            contentState: EditorState.createEmpty(),
            uploadedImages: [],

            provider_info: '',
            /**
             * Note
             */
            noteEditVisible: true,
            notesList: '',
            notes_page_num: '',
            edit_id: '',
            /**
             * repeat_reminder_value
             */
            repeat_reminders: 0,
            repeat_select: 0,
            temp_reminders: [],
        };
        this._uploadImageCallBack = this._uploadImageCallBack.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.onChangeNote = this.onChangeNote.bind(this);
        this.onDelete= this.onDelete.bind(this);
        this.onClientDetail = this.onClientDetail.bind(this);
    }

    componentDidMount() {
        let current_page = this.state.client_current_page;
        let array = [];
        if(this.props.match.params.slug) {
            console.log(this.props.match.params.slug);
            let slug = this.props.match.params.slug;

            array = slug.split("-");
            current_page = array[0];
            console.log(array);
            this.setState({
                client_current_page: Number(current_page),
            });
        }

        this.initial(current_page);

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
            getFullUserByIdRole(data);
        }

        /**
         * Moving from dashboard
         */
        if (array.length > 1) {
            this.onClientDetail(array[1]);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_postNote && this.props.msg_postNote !== prevProps.msg_postNote) {
            toast(this.props.msg_postNote);
            this.onGetNoteList(this.state.appointment_current_page);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }
        if(this.props.oneNote && this.props.oneNote !== prevProps.oneNote) {
            this.setState({
                contentState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(this.props.oneNote.notes))),
            });
        }

        if(this.props.msg_updateNote && this.props.msg_updateNote !== prevProps.msg_updateNote) {
            toast(this.props.msg_updateNote);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }
        if(this.props.msg_deleteNote && this.props.msg_deleteNote !== prevProps.msg_deleteNote) {
            toast(this.props.msg_deleteNote);
            this.setState({
                contentState: EditorState.createEmpty(),
            });
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);

            this.onGetNoteList(this.state.appointment_current_page);
        }

        if (this.props.userList && prevProps.userList !== this.props.userList) {
            this.setState({
                clientList: this.props.userList.list,
                client_page_num: this.props.userList.page_num,
            })
        }

        if (this.props.providerFullInfo && prevProps.providerFullInfo !== this.props.providerFullInfo) {
            if(!this.props.providerFullInfo.main_provider_id) {
                this.setState({
                    account: this.props.providerFullInfo,
                    showPhoto: this.props.providerFullInfo.photo,
                    showBgPhoto: this.props.providerFullInfo.bgPhoto,
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
                if(this.props.providerFullInfo.email === localStorage.provider_email) {
                    this.setState({
                        provider_info: this.props.providerFullInfo,
                    });
                }
            }

            if (this.props.providerFullInfo.main_provider_id) {
                this.setState({
                    user_account: this.props.providerFullInfo.main_provider_id,
                });
            }

            if(this.state.selectedClient_id !== '') {
                this.state.temp_reminders && this.state.temp_reminders.map((item, key) => {
                    if(item.repeat_id === this.state.selectedClient_id) {
                        let s = item.value;
                        let n;

                        if(s === 0.5) {
                            n = 1;
                        } else if(s === 1) {
                            n = 2;
                        } else if(s === 1.5){
                            n = 3;
                        } else {
                            n = s + 2;
                        }

                        this.setState({
                            repeat_reminders: item.value,
                            repeat_select: n,
                        })
                    }
                    return null
                });
            }

            /**
             * repeat Reminders
             */
            if(this.props.providerFullInfo.repeat_reminders && this.props.providerFullInfo.repeat_reminders.length > 0) {
                this.setState({
                    temp_reminders: this.props.providerFullInfo.repeat_reminders,
                })
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
            const {
                resetMsg
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                resetMsg();
                this.tmr = null;
            }, 3000);
        }

        if(this.state.selectedBtn !== prevState.selectedBtn) {
            if(this.state.selectedBtn === 1 || this.state.selectedBtn === 2 || this.state.selectedBtn === 3) {
                this.getAppointmentList(this.state.flag, this.state.appointment_current_page, this.state.selectedBtn);
            }
            if(this.state.selectedBtn === 4) {
                const temp = {
                    provider_id: localStorage.provider_id,
                    client_id: this.state.selectedClient_id,
                };
                const {
                    getMessageOne
                } = this.props;

                if(getMessageOne) {
                    getMessageOne(temp);
                }
            }

            if(this.state.selectedBtn === 5) {
                const temp = {
                    provider_id: localStorage.provider_id,
                    client_id: this.state.selectedClient_id,
                };
                const {
                    getDocumentOne
                } = this.props;
                if(getDocumentOne) {
                    getDocumentOne(temp);
                }
            }
            if(this.state.selectedBtn === 6) {
                this.onGetNoteList(this.state.appointment_current_page);
            }
        }

        if(this.props.appointmentOneToOne && this.props.appointmentOneToOne !== prevProps.appointmentOneToOne) {
            this.setState({
                appointmentList: this.props.appointmentOneToOne.list,
                appointment_page_num: this.props.appointmentOneToOne.page_num,
            });
        }
        if(this.props.lastMessagesList && this.props.lastMessagesList !== prevProps.lastMessagesList) {
            this.setState({
                messageList: this.props.lastMessagesList,
            });
        }
        if(this.props.recipientList && this.props.recipientList !== prevProps.recipientList) {
            this.setState({
                documentList: this.props.recipientList
            })
        }
        if(this.props.getNote && this.props.getNote !== prevProps.getNote) {
            this.setState({
                notesList: this.props.getNote.list,
                notes_page_num: this.props.getNote.page_num,
            });
        }
    }

    onContentStateChange = (contentState) => {
        this.setState({
            contentState,
        })
    };
    _uploadImageCallBack = async (file) => {
        if(file.size > 2 * 1024 * 1024) {
            toast("The file size have to be smaller than 2MB. Please choose the file again.");
            return 0;
        } else {
            const formData = new FormData();
            formData.append('selectedFile', file);

            let str = await articleImageUpload(formData)
                .then((res) => {
                    return res.data.results;
                }).catch((err) => {
                    return err.response.data.msg;
                });

            let uploadedImages = this.state.uploadedImages;

            const imageObject = {
                file: file,
                localSrc: str,
            };

            uploadedImages.push(imageObject);

            this.setState({ uploadedImages: uploadedImages });
            return new Promise(
                (resolve, reject) => {
                    resolve({ data: { link: imageObject.localSrc } });
                }
            );
        }
    };

    showAddClientModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            send_data: {
                add_role: 'client',
                provider_id: localStorage.provider_id,
                provider_name: localStorage.provider_name,
                provider_email: localStorage.provider_email,
            },
        })
    };

    hideAddClientModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    showModal = (_id) => {
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
                role: 'client',
                client_current_page: page,
                client_page_neighbours: this.state.client_page_neighbours,
                client_pagination: this.state.client_pagination,
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

    onGender = (e) => {
        this.setState({
            gender: e.target.value,
        });
    };
    onRepeat = (e) => {
        let n;
        if(Number(e.target.value) === 0) {
            n = 0;
        } else if(Number(e.target.value) === 1) {
            n = 0.5;
        } else if(Number(e.target.value) === 2){
          n = 1;
        } else if(Number(e.target.value) === 3) {
            n = 1.5;
        } else {
            n = e.target.value - 2;
        }
        this.setState({
            repeat_reminders: n,
            repeat_select: e.target.value,
        });
    };
    onPhoneChange = (e) => {
        this.setState({
            [e.target.id]: parseFloat(e.target.value || 0),
            flag_focus: true,
        });
    };

    onClientPageClick = (item) => {
        this.setState({
            client_current_page: item,
            selectedClient_id: '',
            downUpSettings: false,
        });

        const {
            getSimpleUsers
        } = this.props;

        const data = {
            id: localStorage.provider_id,
            role: "client",
            client_current_page: item,
            client_page_neighbours: this.state.client_page_neighbours,
            client_pagination: this.state.client_pagination,
        };

        if (getSimpleUsers) {
            getSimpleUsers(data);
        }

        if(this.props.match.params.slug) {
            this.props.history.push("/client-management");
        }
    };

    onClientDetail = (id) => {
        if (this.state.selectedClient_id === id) {
            this.setState({
                selectedClient_id: '',
                downUpSettings: true,
            });
        } else {
            this.setState({
                selectedClient_id: id,
                downUpSettings: false,
            });
        }

        this.state.temp_reminders && this.state.temp_reminders.map((item, key) => {
            if(item.repeat_id === id) {
                let s = item.value;
                let n;

                if(s === 0.5) {
                    n = 1;
                } else if(s === 1) {
                    n = 2;
                } else if(s === 1.5){
                    n = 3;
                } else {
                    n = s + 2;
                }

                this.setState({
                    repeat_reminders: item.value,
                    repeat_select: n,
                })
            }
            return null
        });

        const {
            getFullUserByIdRole,
        } = this.props;

        if (getFullUserByIdRole) {
            const data = {
                id: id,
                role: 'client',
            };
            getFullUserByIdRole(data);
        }
    };

    initialUser = () => {
        this.onClientPageClick(this.state.client_current_page);
        this.setState({
            temp_id: '',
            account: '',
            name: '',
            email: '',
            phone: '',
            photo: '',
            repeat_reminders: 0,
            repeat_select: 0,

            address1: '',
            address2: '',
            city: '',
            state_province: '',
            zip_code: '',
            country: '',

            age: '',
            gender: '',
            noteEditVisible: false,





            user_account: '',
            /**
             * Delete Modal
             */
            show: false,
            deleteId: '',
            /**
             * Create the appointment Modal
             */
            modalVisible: false,
            send_data: '',
            selectedBtn: 0,
            menuVisible: false,
            appointmentList: '',
            messageList: '',
            documentList: '',

            /**
             * appointment list
             */
            flag: 1,
            arrayAppt: [],
            accept_flag: false,

            appointment_page_num: '',
            appointment_current_page: current_page,
            appointment_pagination: pagination,
            appointment_page_neighbours: page_neighbours,

            itemAppt: '',
            edit_show: '',
            clientArray: '',

            contentState: EditorState.createEmpty(),
            uploadedImages: [],

            provider_info: '',
            /**
             * Note
             */
            notesList: '',
            notes_page_num: '',
            edit_id: '',
            temp_reminders: [],
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
            photo: this.state.photo ? this.state.photo : this.state.account.photo,
            gender: this.state.gender,
            age: this.state.age? new Date().getFullYear() - this.state.age: (this.state.account.age? this.state.account.age: ''),
            repeat_reminders: this.state.repeat_reminders,//? this.state.repeat_reminders: this.state.account.repeat_reminders

            _provider_id: localStorage.provider_id,

            bgPhoto: this.state.bgPhoto ? this.state.bgPhoto : this.state.account.bgPhoto,
            role: 'client',
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

        const {userAddressUpdate} = this.props;
        userAddressUpdate({
            id: this.state.account._id,
            address1: this.state.address1 ? this.state.address1 : this.state.account.address1,
            address2: this.state.address2 ? this.state.address2 : this.state.account.address2,
            city: this.state.city ? this.state.city : this.state.account.city,
            state_province: this.state.state_province ? this.state.state_province : this.state.account.state_province,
            zip_code: this.state.zip_code ? this.state.zip_code : this.state.account.zip_code,
            country: this.state.country,
            role: 'client',
        });

        this.initialUser();
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

    profileToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible,
        })
    };

    getAppointmentList = (flag, page, btn_state) => {
        const {
            getAppointmentByIds,
        } = this.props;

        let temp = {
            provider_id: localStorage.provider_id,
            client_id: this.state.selectedClient_id,
            /**
             * day(1) or week(2) or month(3) or requested(5)
             */
            flag: flag,

            /**
             * appointment if btn_state = 1, session if btn_state = 2, payment if btn_state = 3,
             */
            btn_state:btn_state,

            appointment_current_page: page,
            appointment_pagination: this.state.appointment_pagination,
            appointment_page_neighbours: this.state.appointment_page_neighbours,
        };
        if(getAppointmentByIds) {
            getAppointmentByIds(temp);
        }
    };

    onAppointmentPageClick = (item) => {
        this.setState({
            appointment_current_page: item,
        });

        this.getAppointmentList(this.state.flag, item, this.state.selectedBtn);
    };

    onDay = () => {
        this.setState({
            appointment_current_page: 1,
            flag: 1,
        });

        this.getAppointmentList(1, 1, 1);
    };
    onWeek = () => {
        this.setState({
            appointment_current_page: 1,
            flag: 2,
        });
        this.getAppointmentList(2, 1, 1);
    };
    onMonth = () => {
        this.setState({
            appointment_current_page: 1,
            flag: 3,
        });
        this.getAppointmentList(3, 1, 1);
    };
    onRequested = () => {
        this.setState({
            appointment_current_page: 1,
            flag: 5,
        });
        this.getAppointmentList(5, 1, 1);
    };
    onClickBtn = (n) => {
        if(n === 6) {
            if(this.state.provider_info) {
                if(this.state.provider_info.plan_string === undefined) {
                    toast("Firstly, please upgrade your account.");
                    return null;
                } else {
                    if(!(this.state.provider_info.plan_string === "month_individual_ultimate" || this.state.provider_info.plan_string === "year_individual_ultimate")) {
                        toast("You can not have any private note now. Please upgrade your account and try again.");
                        return null;
                    }
                }
            }
        }
        this.setState({
            selectedBtn: n,
            menuVisible: !this.state.menuVisible,
            appointment_current_page: 1,
            noteEditVisible: true,
        });
    };

    showEditModal = (item, client_list) => {
        if (localStorage.getItem('provider') === 'true') {
            this.setState({
                edit_show: true,
                itemAppt: item,
                clientArray: client_list,
            });
        }
    };

    hideEditModal = () => {
        this.setState({
            edit_show: false,
            itemAppt: '',
            clientArray: '',
        });
    };

    join = (sTime, eTime, url) => {
        window.location.href = "/room/" + url;
    };

    /**
     * Notes
     */
    onPublish = () => {
        const {
            postNotes
        } = this.props;
        const data = {
            provider_id: localStorage.provider_id,
            client_id: this.state.selectedClient_id,
            content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent())),
        };
        postNotes(data);
        this.setState({
            noteEditVisible: !this.state.noteEditVisible,
            contentState: '',
        })
    };

    onGetNoteList = (s) => {
        const {
            getNotes
        } = this.props;
        const temp = {
            provider_id: localStorage.provider_id,
            client_id: this.state.selectedClient_id,

            appointment_current_page: s,
            appointment_pagination: this.state.appointment_pagination,
            appointment_page_neighbours: this.state.appointment_page_neighbours,
        };
        if(getNotes) {
            getNotes(temp);
        }
    };

    onGetOneNote = (_id) => {
        const {
            getOneNote,
        } = this.props;
        const data = {
            _id: _id,
        };
        getOneNote(data);

        this.setState({
            edit_id: _id,
            noteEditVisible: !this.state.noteEditVisible,
        })
    };

    onChangeNote = () => {
        const {
            updateNotes,
        } = this.props;
        const data = {
            _id: this.state.edit_id,
            content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent())),
        };
        updateNotes(data);
        this.setState({
            edit_id: '',
            content: '',
            noteEditVisible: false,
        })
    };

    onDelete = (_id) => {
        const {
            deleteNotes
        } = this.props;
        const data = {
            _id: _id,
        };
        deleteNotes(data);
        this.setState({
            noteEditVisible: false,
            edit_id: '',
        });
    };

    onNotesPageClick = (item) => {
        this.setState({
            appointment_current_page: item,
        });
        this.onGetNoteList(item);
    };

    noteToggleMenu = () => {
        this.setState({
            noteEditVisible: !this.state.noteEditVisible,
        })
    };

    render() {
        const { contentState } = this.state;
        const clientPageArray = [];
        const appointmentPageArray = [];
        const notesArray = [];
        const reminderArray = [
            {0: 'None'},
            {1: "30 Mins"},
            {2: "1 Hour"},
            {3: "1 Hour 30 Mins"},
            {4: "2 Hours"},
            {5: "3 Hour"},
            {6: "4 Hours"},
            {7: "5 Hours"},
            {8: "6 Hours"},
            {9: "7 Hours"},
            {10: "8 Hours"},
            {11: "9 Hours"},
            {12: "10 Hours"},
            {13: "11 Hours"},
            {14: "12 Hours"},
        ];

        if (this.state.client_page_num) {
            for (let k = this.state.client_page_num.start_page; k <= this.state.client_page_num.end_page; k++) {
                clientPageArray.push(k);
            }
        }

        if (this.state.appointment_page_num) {
            for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k++) {
                appointmentPageArray.push(k);
            }
        }

        if (this.state.notes_page_num) {
            for (let k = this.state.notes_page_num.start_page; k <= this.state.notes_page_num.end_page; k++) {
                notesArray.push(k);
            }
        }

        return (
            <>
                <ToastContainer/>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>

                <div className="flex-space people-profile">
                    <div className="btn-common txt-16 justify-center col-white mouse-cursor"
                         onClick={this.showAddClientModal}>
                        <img className="mouse-cursor" style={{paddingRight: 20}}
                             src={require('../assets/img/people-icon1.svg')} alt=""/>
                        Add New Client
                    </div>
                </div>

                <div className="table-common">
                    <div className="patient-header justify-center col-white">
                        Client List
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
                                    this.state.clientList && this.state.clientList.map((item, key) => {
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
                                                    <div className="justify-left">
                                                        {
                                                            (
                                                                (item.provider_ids.includes(localStorage.provider_id) === true)
                                                                 ||
                                                                 (this.state.user_account && this.state.user_account === 'false') // super account
                                                            )
                                                            &&
                                                            (
                                                                <>
                                                                    <img className="mouse-cursor"
                                                                         style={{paddingRight: 20}}
                                                                         src={require('../assets/img/people-icon3.svg')}
                                                                         onClick={() => this.onClientDetail(item._id)}
                                                                         alt=""/>
                                                                    <img className="mouse-cursor"
                                                                         src={require('../assets/img/people-icon2.svg')}
                                                                         onClick={() => this.showModal(item._id)}
                                                                         alt=""/>
                                                                </>
                                                            )
                                                        }

                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-30 justify-center">
                            <div className="product-btn table justify-center" onClick={() => this.onClientPageClick(1)}>
                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                        fill="black" fillOpacity="0.65"/>
                                </svg>
                            </div>

                            {
                                this.state.client_page_num && clientPageArray && clientPageArray.map((item, key) => {
                                    return (
                                        <div
                                            className={this.state.client_current_page && this.state.client_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                            key={key}
                                            onClick={() => this.onClientPageClick(item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                })
                            }

                            <div className="product-btn table justify-center"
                                 onClick={() => this.onClientPageClick(this.state.client_page_num.total_page)}>
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
                    this.state.selectedClient_id !== '' && (
                        <div className="btnBar-pt">
                            <div className="pt-30 pb-20">
                                <div className="flex-header justify-center">
                                    <div
                                        className={this.state.selectedBtn === 0 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(0)}
                                    >
                                        User Info
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(1)}
                                    >
                                        Appointments
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(2)}
                                    >
                                        Sessions
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(3)}
                                    >
                                        Payments
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 4 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(4)}
                                    >
                                        Messages
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 5 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(5)}
                                    >
                                        Documents
                                    </div>
                                    <div
                                        className={this.state.selectedBtn === 6 ? "btnSelected btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor" : "btn-navbar txt-16 txt-medium btnClient-rl mouse-cursor"}
                                        onClick={(e) => this.onClickBtn(6)}
                                    >
                                        Private Notes
                                    </div>
                                </div>

                                <div className="menu-right" onClick={this.profileToggleMenu}>
                                    <img className="practice-mobile-menu mouse-cursor"
                                         src={require('../assets/img/practice-menu.svg')} alt=""/>
                                </div>

                                {
                                    this.state.menuVisible && (
                                        <div className="menu-container client trans-menu">
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(0)}
                                            >
                                                User Info
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(1)}
                                            >
                                                Appointments
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(2)}
                                            >
                                                Sessions
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(3)}
                                            >
                                                Payments
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(4)}
                                            >
                                                Messages
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(5)}
                                            >
                                                Documents
                                            </div>
                                            <div
                                                className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl client mouse-cursor"
                                                onClick={(e) => this.onClickBtn(6)}
                                            >
                                                Private Notes
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="profile-grid5 client" style={{marginBottom: 50}}>
                                <div className="photo-box">
                                    <div className="photo-upBg linear-bg">
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
                                        <div className="name-ptb txt-24 col-darkBlue justify-center">
                                            {this.state.account.name}
                                        </div>
                                        <input
                                            type="file"
                                            id="owner_picture"
                                            accept="image/*"
                                            className="custom-file-input upload-photo"
                                            onChange={(event) => this.photoUpload(event)}
                                            required
                                        />

                                        <div className="pt-30 txt-12 col-lightColor">
                                            {
                                                this.state.account.updated_date ? 'Updated at ' + this.state.account.updated_date : "Updated at September 10, 2020 12: 00 PM"
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="info-box client">
                                     {/*User Info*/}
                                    {
                                        this.state.selectedBtn === 0 && (
                                            <>
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
                                                        <div className="pt-10 col-heavyDark txt-14">Gender</div>
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
                                                        <div className="pt-10 col-heavyDark txt-14">Age</div>
                                                        <input
                                                            id={'age'}
                                                            type="number"
                                                            placeholder={this.state.account.age? new Date().getFullYear() - this.state.account.age: "Age"}
                                                            value={this.state.age}
                                                            min={0}
                                                            max={120}
                                                            onChange={this.onChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-heavyDark">
                                                    <div className="flex-space client">
                                                        <div className="gender-age">
                                                            <div className="pt-10 col-heavyDark txt-14">Phone</div>
                                                            <input
                                                                id={'phone'}
                                                                type="tel"
                                                                placeholder={this.state.account.phone ? this.state.account.phone : 12345678}
                                                                value={this.state.phone}
                                                                onChange={this.onPhoneChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="gender-age">
                                                            <div className="pt-10 col-heavyDark txt-14">Repeat Reminders(hours)</div>
                                                            <select
                                                                className="col-black mouse-cursor"

                                                                defaultValue={this.state.repeat_select && this.state.repeat_select}
                                                                onChange={this.onRepeat}
                                                            >

                                                                {
                                                                    reminderArray.map((sItem, index) => (
                                                                        <option key={index} className="" value={index} selected={this.state.repeat_select === index && true}>{sItem[index]}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-space">
                                                    <div className="pt-30">
                                                        <div className="btn-common client col-white mouse-cursor"
                                                             onClick={this.infoUpdate}>Update
                                                        </div>
                                                    </div>

                                                    <div className="pt-30 justify-right client mouse-cursor" onClick={this.toggleShow}>
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
                                            </>
                                        )
                                    }
                                    {/* Appointments */}
                                    {
                                        this.state.selectedBtn === 1 && (
                                            <>
                                                {
                                                    this.state.appointmentList?
                                                        <div>
                                                            <div className="pb-20 justify-left appointment col-white txt-14">
                                                                <div
                                                                    className={this.state.flag === 1 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                                    onClick={this.onDay}>Day
                                                                </div>
                                                                <div
                                                                    className={this.state.flag === 2 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                                    onClick={this.onWeek}>Week
                                                                </div>
                                                                <div
                                                                    className={this.state.flag === 3 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                                    onClick={this.onMonth}>Month
                                                                </div>
                                                                <div
                                                                    className={this.state.flag === 5 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"}
                                                                    onClick={this.onRequested}>Requested
                                                                </div>
                                                            </div>
                                                            <div className="table-dash client txt-14">
                                                                <div className="appointment-list client">
                                                                    {
                                                                        this.state.appointmentList && this.state.appointmentList.length === 0 && (
                                                                            <div className="pb-20 txt-14"
                                                                                 style={{paddingTop: 10, paddingLeft: 20}}>You do not have any appointment requests.
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <table id="tAppt">
                                                                        <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Date Requested</th>
                                                                            <th>Time Length</th>
                                                                            <th>Amount</th>
                                                                            <th>Client Name</th>
                                                                            <th>Type</th>
                                                                            <th>State</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.appointmentList && this.state.appointmentList.map((item, key) => {
                                                                                const path = item._id;
                                                                                const pathRoom = item._id;
                                                                                let client_list = '';
                                                                                for (let k = 0; k < item.clientInfo.length; k++) {
                                                                                    if(item.clientInfo[k] && item.clientInfo[k].name)
                                                                                        client_list += item.clientInfo[k].name + ", ";
                                                                                }
                                                                                client_list = client_list.slice(0, client_list.length - 2);
                                                                                return (
                                                                                    <tr key={key}
                                                                                        className="article-table col-heavyDark mouse-cursor"
                                                                                    >
                                                                                        <td className="time-p justify-center" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                item.state === 1 && (
                                                                                                    <img
                                                                                                        src={require('../assets/img/appointment-creating.svg')}
                                                                                                        alt=""/>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 2 && (
                                                                                                    <img
                                                                                                        src={require('../assets/img/appointment-accepting.svg')}
                                                                                                        alt=""/>
                                                                                                )
                                                                                            }

                                                                                            {
                                                                                                (item.state === 3 || item.state === 31 || item.state === 32 || item.state === 4) && (
                                                                                                    <img
                                                                                                        src={require('../assets/img/appointment-paying.svg')}
                                                                                                        alt=""/>
                                                                                                )
                                                                                            }

                                                                                            {
                                                                                                item.state === 5 && (
                                                                                                    <img
                                                                                                        src={require('../assets/img/appointment-finishing.svg')}
                                                                                                        alt=""/>
                                                                                                )
                                                                                            }

                                                                                            {
                                                                                                item.state === 6 && (
                                                                                                    <img
                                                                                                        src={require('../assets/img/appointment-expiration.svg')}
                                                                                                        alt=""/>
                                                                                                )
                                                                                            }
                                                                                        </td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                new Date(item.start_time).toLocaleDateString([], {
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: '2-digit',
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit',
                                                                                                })
                                                                                            },
                                                                                        </td>
                                                                                        <td className="time-p col-disabled" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                Number(item.time_distance) === 0
                                                                                                    ?
                                                                                                    'All Day'
                                                                                                    :
                                                                                                    (Number(item.time_distance) >= 60
                                                                                                            ?
                                                                                                            Math.floor(Number(item.time_distance) / 60) + ' hours ' + Number(item.time_distance) % 60
                                                                                                            :
                                                                                                            Number(item.time_distance) % 60
                                                                                                    ) + ' minutes'
                                                                                            }
                                                                                            {
                                                                                                item.online ? ", online" : ""
                                                                                            }
                                                                                        </td>
                                                                                        <td className="time-p" onClick={() => this.showEditModal(item, client_list)}>{item.payment} USD
                                                                                        </td>
                                                                                        <td className="col-blue" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                client_list
                                                                                            }
                                                                                        </td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            <div>
                                                                                                {
                                                                                                    item.invite_client === true && "Requested"
                                                                                                }
                                                                                            </div>
                                                                                            <div>
                                                                                                {
                                                                                                    item.appointment_type && item.appointment_type
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                item.state === 1 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Created
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 2 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Accepted
                                                                                                    </div>
                                                                                                )
                                                                                            }

                                                                                            {
                                                                                                item.state === 31 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Join
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 32 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Start
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 3 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                        Wait
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 4 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                        Progressing
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 5 && (
                                                                                                    <div
                                                                                                        className="btn-expiration">Finished</div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 6 && (
                                                                                                    <div
                                                                                                        className="btn-expiration">Expiration</div>
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
                                                            </div>

                                                            <div className="pt-30 justify-center">
                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(1)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>

                                                                {
                                                                    this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
                                                                        return (
                                                                            <div
                                                                                className={this.state.appointment_current_page && this.state.appointment_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                                key={key}
                                                                                onClick={() => this.onAppointmentPageClick(item)}
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="col-disabled" style={{paddingLeft: 20}}>
                                                            There is no appointment made with this client, yet.
                                                        </div>
                                                }
                                            </>
                                        )
                                    }
                                    {/* Sessions */}
                                    {
                                        this.state.selectedBtn === 2 && (
                                            <>
                                                {
                                                    this.state.appointmentList?
                                                        <div>
                                                            <div className="table-dash client txt-14">
                                                                <div className="appointment-list client">
                                                                    {
                                                                        this.state.appointmentList && this.state.appointmentList.length === 0 && (
                                                                            <div className="pb-20 txt-14"
                                                                                 style={{paddingTop: 10, paddingLeft: 20}}>There is no session with {this.state.account.name}
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <table id="tAppt">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>Client Name</th>
                                                                            <th>Start Time</th>
                                                                            <th>Time Length</th>
                                                                            <th>Amount</th>
                                                                            <th>Type</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.appointmentList && this.state.appointmentList.map((item, key) => {
                                                                                const path = item._id;
                                                                                const pathRoom = item._id;
                                                                                let client_list = '';
                                                                                for (let k = 0; k < item.clientInfo.length; k++) {
                                                                                    if(item.clientInfo[k] && item.clientInfo[k].name)
                                                                                        client_list += item.clientInfo[k].name + ", ";
                                                                                }
                                                                                client_list = client_list.slice(0, client_list.length - 2);
                                                                                return (
                                                                                    <tr key={key}
                                                                                        className="article-table col-heavyDark mouse-cursor"
                                                                                    >
                                                                                        <td className="col-blue" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                client_list
                                                                                            }
                                                                                        </td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                new Date(item.start_time).toLocaleDateString([], {
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: '2-digit',
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit',
                                                                                                })
                                                                                            }
                                                                                        </td>
                                                                                        <td className="time-p col-disabled" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                Number(item.time_distance) === 0
                                                                                                    ?
                                                                                                    'All Day'
                                                                                                    :
                                                                                                    (Number(item.time_distance) >= 60
                                                                                                            ?
                                                                                                            Math.floor(Number(item.time_distance) / 60) + ' hours ' + Number(item.time_distance) % 60
                                                                                                            :
                                                                                                            Number(item.time_distance) % 60
                                                                                                    ) + ' minutes'
                                                                                            }
                                                                                            {
                                                                                                item.online ? ", online" : ""
                                                                                            }
                                                                                        </td>
                                                                                        <td className="time-p" onClick={() => this.showEditModal(item, client_list)}>{item.payment} USD</td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            <div>
                                                                                                {
                                                                                                    item.invite_client === true && "Requested"
                                                                                                }
                                                                                            </div>
                                                                                            <div>
                                                                                                {
                                                                                                    item.appointment_type && item.appointment_type
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                item.state === 1 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Created
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 2 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Accepted
                                                                                                    </div>
                                                                                                )
                                                                                            }

                                                                                            {
                                                                                                item.state === 31 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Join
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 32 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, path)}>
                                                                                                        Start
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 3 && (
                                                                                                    <div
                                                                                                        className="hover-wait btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                        Wait
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 4 && (
                                                                                                    <div
                                                                                                        className="btn-join col-white align-center mouse-cursor"
                                                                                                        onClick={() => this.join(item.start_time, item.end_time, pathRoom)}>
                                                                                                        Progressing
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 5 && (
                                                                                                    <div
                                                                                                        className="btn-expiration">Finished</div>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                item.state === 6 && (
                                                                                                    <div
                                                                                                        className="btn-expiration">Expiration</div>
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
                                                            </div>

                                                            <div className="pt-30 justify-center">
                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(1)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>

                                                                {
                                                                    this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
                                                                        return (
                                                                            <div
                                                                                className={this.state.appointment_current_page && this.state.appointment_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                                key={key}
                                                                                onClick={() => this.onAppointmentPageClick(item)}
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="col-disabled" style={{paddingLeft: 20}}>
                                                            There is no appointment made with this client, yet.
                                                        </div>
                                                }
                                            </>
                                        )
                                    }
                                    {/* Payments */}
                                    {
                                        this.state.selectedBtn === 3 && (
                                            <>
                                                {
                                                    this.state.appointmentList?
                                                        <div>
                                                            <div className="table-dash client txt-14">
                                                                <div className="appointment-list client">
                                                                    {
                                                                        this.state.appointmentList && this.state.appointmentList.length === 0 && (
                                                                            <div className="pb-20 txt-14"
                                                                                 style={{paddingTop: 10, paddingLeft: 20}}>You do not have any session.
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <table id="tAppt">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>Payer Name</th>
                                                                            <th>Paid To</th>
                                                                            <th>Amount</th>
                                                                            <th>Date Paid</th>
                                                                            <th>Type</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.appointmentList && this.state.appointmentList.map((item, key) => {
                                                                                let client_list = '';
                                                                                for (let k = 0; k < item.clientInfo.length; k++) {
                                                                                    if(item.clientInfo[k] && item.clientInfo[k].name)
                                                                                        client_list += item.clientInfo[k].name + ", ";
                                                                                }
                                                                                client_list = client_list.slice(0, client_list.length - 2);
                                                                                return (
                                                                                    <tr key={key}
                                                                                        className="article-table col-heavyDark mouse-cursor"
                                                                                    >
                                                                                        <td className="col-blue" onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                client_list
                                                                                            }
                                                                                        </td>
                                                                                        <td className="col-blue">{localStorage.provider_name}</td>
                                                                                        <td className="time-p" onClick={() => this.showEditModal(item, client_list)}>{item.payment} USD</td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            {
                                                                                                item.payment === 0?
                                                                                                    new Date(item.requested_date).toLocaleDateString([], {
                                                                                                        year: 'numeric',
                                                                                                        month: 'long',
                                                                                                        day: '2-digit',
                                                                                                        hour: '2-digit',
                                                                                                        minute: '2-digit',
                                                                                                    })
                                                                                                    :
                                                                                                    new Date(item.paid_date).toLocaleDateString([], {
                                                                                                        year: 'numeric',
                                                                                                        month: 'long',
                                                                                                        day: '2-digit',
                                                                                                        hour: '2-digit',
                                                                                                        minute: '2-digit',
                                                                                                    })

                                                                                            }
                                                                                        </td>
                                                                                        <td onClick={() => this.showEditModal(item, client_list)}>
                                                                                            <div>
                                                                                                {
                                                                                                    item.invite_client === true && "Requested"
                                                                                                }
                                                                                            </div>
                                                                                            <div>
                                                                                                {
                                                                                                    item.appointment_type && item.appointment_type
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <div className="pt-30 justify-center">
                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(1)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>

                                                                {
                                                                    this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
                                                                        return (
                                                                            <div
                                                                                className={this.state.appointment_current_page && this.state.appointment_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                                key={key}
                                                                                onClick={() => this.onAppointmentPageClick(item)}
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                                <div className="product-btn table justify-center"
                                                                     onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
                                                                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                            fill="black" fillOpacity="0.65"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="col-disabled" style={{paddingLeft: 20}}>
                                                            There is no appointment made with this client, yet.
                                                        </div>
                                                }
                                            </>
                                        )
                                    }

                                    {
                                        this.state.selectedBtn === 4 && (
                                            this.state.messageList.length > 0?
                                                this.state.messageList && this.state.messageList.map((sItem, key) => {
                                                    const path = "/view-messages/" + this.state.account._id;
                                                    return (
                                                        <div className="table-dash client message-scroll txt-14" key={key}>
                                                            <div className="table-list"
                                                                 style={{padding: 10}}>
                                                                <Link to={path}
                                                                      className="messaging flex-space messages mouse-cursor"
                                                                      key={key}>
                                                                    <div className="justify-left">
                                                                        <img className="message-photo"
                                                                             src={this.state.account.photo ? this.state.account.photo : require('../assets/img/account.svg')}
                                                                             alt=""/>
                                                                        <div className="name-pl">{this.state.account.name}</div>
                                                                    </div>

                                                                    <div className="">
                                                                        <div
                                                                            className="col-disabled">{sItem.messageDate}</div>
                                                                        <div>{sItem.message}</div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                "There is no the message with " + this.state.account.name
                                        )
                                    }
                                    {
                                        this.state.selectedBtn === 5 && (
                                            this.state.documentList.length > 0?
                                                this.state.documentList && this.state.documentList.map((item, Key) => {
                                                    return (
                                                        <div key={Key}>
                                                            <div className="flex-space">
                                                                <div>
                                                                    <div className="pt-5 col-heavyDark">
                                                                        {item.filename}
                                                                    </div>
                                                                </div>
                                                                <a className="btn-upload col-white mouse-cursor download-item" href={item.path}>
                                                                    <img className="attached-icon" src={require('../assets/img/download-solid.svg')} alt=""/> Download
                                                                </a>
                                                            </div>

                                                            <hr/>
                                                        </div>
                                                    )
                                                })
                                                :
                                                "There is no document shared with " + this.state.account.name
                                        )
                                    }
                                    {
                                        this.state.selectedBtn === 6 && (
                                            <>
                                                <div className="flex-document documentMenu txt-14 col-disabled-shown">
                                                    <div
                                                        className={this.state.noteEditVisible === true ? "menuSelected menu-payment client" : "menu-payment client"}
                                                        onClick={this.noteToggleMenu}
                                                    >
                                                        New Note
                                                    </div>

                                                    <div
                                                        className={this.state.noteEditVisible === false ? "menuSelected menu-payment client" : "menu-payment client"}
                                                        onClick={this.noteToggleMenu}
                                                    >
                                                        Previous Notes
                                                    </div>
                                                </div>

                                                {
                                                    this.state.noteEditVisible?
                                                        <>
                                                            <div className="draft-box client">
                                                                <Editor
                                                                    editorState={contentState}
                                                                    toolbarClassName="toolbarClassName"
                                                                    wrapperClassName="wrapperClassName"
                                                                    editorClassName="editorClassName"
                                                                    onEditorStateChange={this.onContentStateChange}
                                                                    placeholder="Please input the content."
                                                                    toolbar={{
                                                                        inline: { inDropdown: true },
                                                                        list: { inDropdown: true },
                                                                        textAlign: { inDropdown: true },
                                                                        link: { inDropdown: false},
                                                                        history: { inDropdown: false},
                                                                        image: {
                                                                            uploadCallback: this._uploadImageCallBack,
                                                                            previewImage: true,
                                                                        },
                                                                        remove: { className: undefined, component: undefined },
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="pt-20">
                                                                {
                                                                    this.state.edit_id && this.state.edit_id !== ''?
                                                                        <div className="justify-rl">
                                                                            <div className="btn-article txt-16 col-white mouse-cursor" onClick={() => this.onDelete(this.state.edit_id)}>Delete</div>
                                                                            <div className="btn-article txt-16 col-white mouse-cursor" onClick={this.onChangeNote}>Update</div>
                                                                        </div>
                                                                        :
                                                                        <div className="flex-right">
                                                                            <div className="btn-article txt-16 col-white align-right mouse-cursor" onClick={this.onPublish}>Publish</div>
                                                                        </div>
                                                                }
                                                            </div>
                                                        </>
                                                    :
                                                        <div className="">
                                                            {
                                                                this.state.notesList && this.state.notesList.length > 0?
                                                                    <div>
                                                                        <div className="draft-box client">
                                                                        {
                                                                            <div className="table-list" style={{padding: 10}}>
                                                                            {
                                                                                this.state.notesList.map((item, key) => {
                                                                                    return (
                                                                                        <div className="messaging flex-space client-note mouse-cursor" key={key}>
                                                                                            <div className="content-width">
                                                                                                <div className="name-pl">{item.notes}</div>
                                                                                                <div className="col-disabled txt-12">
                                                                                                    {
                                                                                                        new Date(item.updated_date).toLocaleTimeString([], {
                                                                                                            year: 'numeric',
                                                                                                            month: 'long',
                                                                                                            day: '2-digit',
                                                                                                            hour: '2-digit',
                                                                                                            minute: '2-digit'
                                                                                                        })
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="btn-arrange">
                                                                                                <div className="btn-deleting client justify-center col-paragraphBg txt-12 mouse-cursor" style={{marginBottom: 10}} onClick={() => this.onDelete(item._id)}>Delete</div>
                                                                                                <div className="btn-join client col-white align-center txt-12 mouse-cursor" onClick={() => this.onGetOneNote(item._id)}>Edit</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                            </div>
                                                                        }
                                                                        </div>

                                                                        <div className="pt-30 justify-center">
                                                                            <div className="product-btn table justify-center"
                                                                                 onClick={() => this.onNotesPageClick(1)}>
                                                                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                                    <path
                                                                                        d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                                                                        fill="black" fillOpacity="0.65"/>
                                                                                </svg>
                                                                            </div>

                                                                            {
                                                                                this.state.notes_page_num && notesArray && notesArray.map((item, key) => {
                                                                                    return (
                                                                                        <div
                                                                                            className={this.state.appointment_current_page && this.state.appointment_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
                                                                                            key={key}
                                                                                            onClick={() => this.onNotesPageClick(item)}
                                                                                        >
                                                                                            {item}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }

                                                                            <div className="product-btn table justify-center"
                                                                                 onClick={() => this.onNotesPageClick(this.state.notes_page_num.total_page)}>
                                                                                <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                                    <path
                                                                                        d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                                                                        fill="black" fillOpacity="0.65"/>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className="draft-box client col-disabled" style={{paddingLeft: 20}}>
                                                                        There is no notes made with this client, yet.
                                                                    </div>
                                                            }
                                                        </div>
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                this.state.selectedBtn === 0 && this.state.downUpSettings ? (
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
                                                                <select value={this.state.state_province}
                                                                        onChange={this.handleProvinceChange}>
                                                                    <StateProvince/>
                                                                </select>
                                                                :
                                                                <input
                                                                    id={'state_province'}
                                                                    type="text"
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
                                                        <select value={this.state.country}
                                                                onChange={this.handleCountryChange}>
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
                        </div>
                    )
                }

                {/*  Modal  */}
                <DeleteUser
                    show={this.state.show}
                    deleteId={this.state.deleteId}
                    role={"client"}
                    handleClose={this.hideModal}
                />

                <PeopleAddProfile
                    show={this.state.modalVisible}
                    data={this.state.send_data}
                    handleClose={this.hideAddClientModal}
                />

                <EditAppointment
                    itemAppt={this.state.itemAppt}
                    edit_show={this.state.edit_show}
                    client_list={this.state.clientArray}
                    handleClose={this.hideEditModal}
                />
            </>
        )
    }
}

export default connect(
    state => {
        return {
            spinning: state.registers.spinning,
            providerFullInfo: state.registers.providerFullInfo,
            userList: state.registers.userList,
            msg_profile_update: state.registers.msg_profile_update,

            appointmentOneToOne: state.registers.appointmentOneToOne,
            lastMessagesList: state.registers.lastMessagesList,
            recipientList: state.registers.recipientList,

            msg_postNote: state.registers.msg_postNote,
            getNote: state.registers.getNote,
            msg_updateNote: state.registers.msg_updateNote,
            msg_deleteNote: state.registers.msg_deleteNote,
            oneNote: state.registers.oneNote,
        }
    },
    {
        getFullUserByIdRole,
        providerInfoUpdate,
        getSimpleUsers,
        userAddressUpdate,

        getAppointmentByIds,
        getMessageOne,
        getDocumentOne,

        postNotes,
        articleImageUpload,
        getNotes,
        getOneNote,
        updateNotes,
        deleteNotes,
        reset,
        resetMsg,
    }
)(ClientManagement);
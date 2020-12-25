import React, {Component} from "react";
import {connect} from "react-redux";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";

import {
    reset,
    addChatbot,
    getData,
} from "../redux/actions/register/chatbot";
import ShowChatbotData from "./chatbot-modal";

class AddChatbotData extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            answer: '',
            question: '',
            oneData: '',
            id: '',

            page_num: '',
            current_page: 1,
            page_neighbours: 4,
            pagination: 10,

            list: [],

            showModal: false,
            itemInfo: '',
        }
    }

    componentDidMount() {
        this.getDataList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.chatbot_list && this.props.chatbot_list !== prevProps.chatbot_list) {
            this.setState({
                list: this.props.chatbot_list.list,
                page_num: this.props.chatbot_list.page_num,
            });
        }
        if(this.props.get_one_chatbot && this.props.get_one_chatbot !== prevProps.get_one_chatbot) {
            this.setState({
                oneData: this.props.get_one_chatbot,
                id: this.props.get_one_chatbot._id,
            })
        }

        if(this.props.msg_add_chatbot && this.props.msg_add_chatbot !== prevProps.msg_add_chatbot) {
            toast(this.props.msg_add_chatbot);
            this.setState({
                answer: '',
                question: '',
            });

            this.getDataList();

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }

        if(this.props.msg_error_chatbot && this.props.msg_error_chatbot !== prevProps.msg_error_chatbot) {
            toast(this.props.msg_error_chatbot);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }

        if(this.props.msg_delete_chatbot && this.props.msg_delete_chatbot !== prevProps.msg_delete_chatbot) {
            toast(this.props.msg_delete_chatbot);
            this.setState({
                answer: '',
                question: '',
            });

            this.getDataList();

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    onAdd = () => {
        const data = {
            question: this.state.question,
            answer: this.state.answer,
        };

        const {
            addChatbot
        } = this.props;

        if(addChatbot) {
            addChatbot(data);
        }
    };

    getDataList = () => {
        const {
            getData,
        } = this.props;

        let temp = {
            current_page: this.state.current_page,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };
        if(getData) {
            getData(temp);
        }
    };

    onPageClick = (item) => {
        this.setState({
            current_page: item,
        });

        const {
            getData
        } = this.props;

        const data = {
            current_page: item,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };

        if(getData) {
            getData(data)
        }
        window.scrollTo(0, 0);
    };

    onShowModal = (item) => {
        this.setState({
            showModal: true,
            itemInfo: item
        })
    };

    onHideModal = () => {
        this.setState({
            showModal: false,
            itemInfo: '',
        });
    };

    render() {
        const pageArray = [];
        if(this.state.page_num) {
            for (let k = this.state.page_num.start_page; k <= this.state.page_num.end_page; k ++) {
                pageArray.push(k);
            }
        }
        return (
            <div>
                <div className="spinning-curtain" style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <ToastContainer />
                <div className="edit-bg category">
                    <div className="pt-20">
                        <div className="pb-30 txt-26 col-blue">Add the question and answer</div>
                        <div>
                            <input
                                id={'question'}
                                className="article-input"
                                value={this.state.question}
                                onChange={this.onChange}
                                placeholder="Please input the question." />
                        </div>

                        <div>
                            <input
                                id={'answer'}
                                className="article-input"
                                value={this.state.answer}
                                onChange={this.onChange}
                                placeholder="Please input the answer." />
                        </div>

                        <div className="justify-right">
                            <div
                                className="btn-article category txt-16 col-white align-right mouse-cursor"
                                style={{padding: '9px 32px'}}
                                onClick={this.onAdd}
                            >
                                Add
                            </div>
                        </div>
                    </div>
                </div>

                <div className="edit-bg category chatbot">
                    <div className="table-border">
                        <table id="t02" className="txt-14">
                            <thead>
                            <tr className="article-table chatbot-table">
                                <th>No</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Date added</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.list && this.state.list.map((item, key) => {
                                    return (
                                        <tr className="article-table chatbot-table mouse-cursor" key={key} onClick={() => this.onShowModal(item)}>
                                            <td>
                                                <Link to={'/article-details/' + item._id} style={{color: '#000', cursor: 'pointer', minWidth: '150px'}}>
                                                    {key + 1}
                                                </Link>
                                            </td>
                                            <td className="col-heavyDark txt-break">
                                                {
                                                    item.origin_question.length > 80?
                                                        item.origin_question.slice(0, 80) + "..."
                                                        :
                                                        item.origin_question
                                                }
                                            </td>
                                            <td className="col-heavyDark txt-break">
                                                {
                                                    item.answer.length > 120?
                                                        item.answer.slice(0, 120) + "..."
                                                        :
                                                        item.answer
                                                }
                                            </td>
                                            <td>
                                                <div style={{borderBottom: '1px dashed #aaa'}}>
                                                    {
                                                        new Date(item.add_date).toLocaleDateString([], {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td style={{textAlign: 'center'}} className="justify-left">
                                                <div className="col-buttonAndLink view-delete mouse-cursor">Edit</div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="help-center-align">
                        <div className="product-btn justify-center" onClick={() => this.onPageClick(1)}>
                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
                            </svg>
                        </div>

                        {
                            this.state.page_num && pageArray && pageArray.map((item, key) => {
                                return (
                                    <div
                                        className={this.state.current_page && this.state.current_page === item? "product-btn justify-center btn-search": "product-btn justify-center col-darkBlue"}
                                        key={key}
                                        onClick={() => this.onPageClick(item)}
                                    >
                                        {item}
                                    </div>
                                )
                            })
                        }

                        <div className="product-btn justify-center" onClick={() => this.onPageClick(this.state.page_num.total_page)}>
                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
                            </svg>
                        </div>
                    </div>
                </div>

            {/*    Modal*/}
                <ShowChatbotData
                    show={this.state.showModal}
                    item={this.state.itemInfo}
                    handleClose={this.onHideModal}
                />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        get_one_chatbot: state.registers.get_one_chatbot,
        msg_add_chatbot: state.registers.msg_add_chatbot,
        msg_error_chatbot: state.registers.msg_error_chatbot,
        msg_delete_chatbot: state.registers.msg_delete_chatbot,
        chatbot_list: state.registers.chatbot_list,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        addChatbot,
        getData,
    }
)(AddChatbotData);
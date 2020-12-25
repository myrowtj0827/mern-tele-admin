import React, {Component} from 'react';
import '../assets/css/views.css';
import ArticlesHeader from "./articles-header";
import {
    reset,
    getPublishedArticle,
    deleteArticle,
    getListCategory
} from "../redux/actions/register/articles";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteArticle from "./article-modal";

class Published extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            user_id: localStorage.provider_id,
            listByMe: '',
            category_id: '0',
            list: '',
            show: false,
            deleteId: '',

            page_num: '',
            current_page: 1,
            page_neighbours: 4,
            pagination: 9,
        }
    }

    componentDidMount() {
        const {
            getPublishedArticle,
            getListCategory,
        } = this.props;

        getListCategory();
        const data = {
            user_id: this.state.user_id,
            category_id: this.state.category_id,
            current_page: 1,
            page_neighbours: 4,
            pagination: 9,
        };

        getPublishedArticle(data);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.category_id !== this.state.category_id) {
            const {
                getPublishedArticle
            } = this.props;

            this.setState({
                current_page: 1,
            });

            const data = {
                user_id: this.state.user_id,
                category_id: this.state.category_id,
                current_page: 1,
                page_neighbours: this.state.page_neighbours,
                pagination: this.state.pagination,
            };

            getPublishedArticle(data);
        }

        if(this.props.publishedList && prevProps.publishedList !== this.props.publishedList) {
            this.setState({
                listByMe: this.props.publishedList.list,
                page_num: this.props.publishedList.page_num,
            });

            window.scrollTo(0, 0);
        }

        if(this.props.categoryList && prevProps.categoryList !== this.props.categoryList) {
            this.setState({
                list: this.props.categoryList[0].cate,
            })
        }

        if(this.props.msg_deleteArticle && prevProps.msg_deleteArticle !== this.props.msg_deleteArticle) {
            toast(this.props.msg_deleteArticle);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2000);
        }
    }

    categoryChange = (e) => {
        this.setState({
            category_id: e.target.value,
        });
    };

    showModal = (_id) => {
        if(localStorage.getItem('provider') === 'true') {
            this.setState({
                show: true,
                deleteId: _id,
            });
        }
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    onPageClick = (item) => {
        this.setState({
            current_page: item,
        });

        const {
            getPublishedArticle
        } = this.props;

        const data = {
            user_id: this.state.user_id,
            category_id: this.state.category_id,
            current_page: item,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
        };

        if(getPublishedArticle) {
            getPublishedArticle(data)
        }
        window.scrollTo(0, 0);
    };

    render() {
        const pageArray = [];
        if(this.state.page_num) {
            for (let k = this.state.page_num.start_page; k <= this.state.page_num.end_page; k ++) {
                pageArray.push(k);
            }
        }

        return (
            <>
                <ToastContainer />
                <ArticlesHeader />
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>

                <div className="articles-title flex-space">
                    <div className="flex-space articles col-heavyDark">
                        Categories
                        <select className="category-sel" onChange={this.categoryChange}>
                            <option value={'0'}>All</option>
                            {Object.keys(this.state.list).map((item, key) => (
                                <option key={key} value={item}>{this.state.list[item]}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-black txt-14 pb-20">
                    {
                        this.state.listByMe && this.state.listByMe.length + " articles found"
                    }
                </div>

                <div className="table-border">
                    <table id="t02" className="txt-14">
                        <thead>
                        <tr className="article-table">
                            <th>Title</th>
                            <th>Author</th>
                            <th>Categories</th>
                            <th>Date</th>
                            <th>Comments</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.listByMe && this.state.listByMe.map((item, key) => {
                                return (
                                    <tr className="article-table" key={key}>
                                        <td>
                                            <Link to={'/article-details/' + item._id} style={{color: '#000', cursor: 'pointer', minWidth: '150px'}}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="col-heavyDark">{localStorage.provider_name}</td>
                                        <td className="col-heavyDark">
                                            {this.state.list[item.category_id]}
                                        </td>
                                        <td>
                                            <div>Published</div>
                                            <div style={{borderBottom: '1px dashed #aaa'}}>{item.writtenDate}</div>
                                        </td>
                                        <td>{item.nComment}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <Link className="col-heavyDark view-delete" to={'/article-details/' + item._id}>View</Link>  |
                                            <Link className="col-buttonAndLink view-delete" to={'/new-article/' + item._id}>  Edit</Link>  |
                                            <span className="col-paragraphBg view-delete mouse-cursor" onClick={() => this.showModal(item._id)}>  Delete</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                            {
                                this.state.listByMe.length > 7 && (
                                    <tr className="article-table">
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Categories</th>
                                        <th>Date</th>
                                        <th>Comments</th>
                                        <th></th>
                                    </tr>
                                )
                            }
                        </tfoot>
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

                {/*  Modal  */}
                <DeleteArticle show={this.state.show} deleteId = {this.state.deleteId} handleClose={this.hideModal} />
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        publishedList: state.registers.publishedList,
        categoryList: state.registers.categoryList,
        msg_deleteArticle:state.registers.msg_deleteArticle,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        getPublishedArticle,
        getListCategory,
        deleteArticle,
    }
)(Published);
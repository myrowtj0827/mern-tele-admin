import React, {Component} from 'react';
import {connect} from "react-redux";
import HelpHeader from "./help-header";

import '../assets/css/views.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    EditorState,
    ContentState,
    convertToRaw,
} from 'draft-js';

import {
    reset,
    postArticle,
    updateArticle,
    getArticleDetails,
    getListCategory,
    addCategory,
    articleImageUpload,
} from "../redux/actions/register/help-articles"

class HelpNew extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            article_id: '',
            articleInfo: '',
            category_id: '',
            user_id: localStorage.provider_id,
            title: '',
            content: '',
            articleVisible: false,

            list: '',
            contentState: EditorState.createEmpty(),
            uploadedImages: [],
            msg_toast: '',
            category: '',
        };

        this._uploadImageCallBack = this._uploadImageCallBack.bind(this);
        this.categoryChange = this.categoryChange.bind(this);
    };

    componentDidMount() {
        const {
            getListCategory
        } = this.props;
        getListCategory();

        if(this.props.match.params.id) {
            this.setState({
                article_id: this.props.match.params.id,
            });

            const {
                getArticleDetails
            } = this.props;

            const data = {
                _id: this.props.match.params.id,
            };

            getArticleDetails(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_article && prevProps.msg_article !== this.props.msg_article) {
            toast(this.props.msg_article);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2000);
        }

        if(this.props.msg_updateArticle && prevProps.msg_updateArticle !== this.props.msg_updateArticle) {
            toast(this.props.msg_updateArticle);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2000);
        }

        if(this.props.msg_addCategory && prevProps.msg_addCategory !== this.props.msg_addCategory) {
            toast(this.props.msg_addCategory);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 2000);
        }

        if(this.props.categoryList && prevProps.categoryList !== this.props.categoryList) {
            this.setState({
                list: this.props.categoryList[0].cate,
            })
        }

        if(this.props.articleDetails && prevProps.articleDetails !== this.props.articleDetails) {
            this.setState({
                articleInfo: this.props.articleDetails,
            });
            if(this.state.contentState) {

                this.setState({
                    contentState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(this.props.articleDetails[0].content))),
                })
            }
            if(this.state.title === '') {
                this.setState({
                    title: this.props.articleDetails[0].title,
                })
            }
        }
    }

    categoryChange = (e) => {
        this.setState({
            category_id: e.target.value,
        });
    };

    publish = () => {
        const {
            postArticle
        } = this.props;

        const data = {
            category_id: this.state.category_id,
            user_id: this.state.user_id,
            title: this.state.title,
            content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent())),
        };
        postArticle(data);
    };

    update = () => {
        const {
            updateArticle
        } = this.props;
        const data = {
            _id: this.props.match.params.id,
            category_id: (this.state.category_id === '' && this.state.articleInfo[0].category_id)?
                this.state.articleInfo[0].category_id
                :
                this.state.category_id,
            user_id: this.state.user_id,
            title: this.state.title,
            content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent())),
        };
        updateArticle(data);
    };

    onContentStateChange = (contentState) => {
        this.setState({
            contentState,
        })
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        });
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

    addCategory = () => {
        const {
            addCategory
        } = this.props;

        if(addCategory) {
            const data = {
                category: this.state.category,
            };
            addCategory(data);
        }
    };

    render() {
        const { contentState } = this.state;
        return (
            <>
                <HelpHeader />
                <ToastContainer />
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="articles-title flex-space publish">
                    <div className="flex-space articles col-heavyDark">
                        <select className="category-sel publish" onChange={this.categoryChange}>
                            <option style={{color: '#ccc'}}>Select a category</option>

                            {Object.keys(this.state.list).map((item, key) => (
                                this.state.articleInfo && this.state.articleInfo[0].category_id === item ?
                                    <option key={key} value={item} selected>{this.state.list[item]}</option>
                                    :
                                    <option key={key} value={item}>{this.state.list[item]}</option>
                            ))}
                        </select>
                    </div>
                    {
                        this.state.article_id ?
                            <div className="justify-center">
                                <div className="btn-article back txt-16 col-white align-right mouse-cursor" onClick={this.props.history.goBack}>Back</div>
                                <div className="btn-article txt-16 col-white align-right mouse-cursor" onClick={this.update}>Update</div>
                            </div>
                            :
                            <div className="btn-article txt-16 col-white align-right mouse-cursor" onClick={this.publish}>Publish</div>
                    }
                </div>
                <div className="edit-bg">
                    <div className="pb-10 txt-16 col-heavyDark">Title</div>
                    <input
                        id={'title'}
                        className="article-input"
                        value={this.state.title}
                        onChange={this.onChange}
                        placeholder="Please input the title." />

                    <div className="pb-10 txt-16 col-heavyDark">Content</div>
                    <div className="draft-box">
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
                                history: { inDropdown: true },
                                image: {
                                    uploadCallback: this._uploadImageCallBack,
                                    previewImage: true,
                                },
                                remove: { className: undefined, component: undefined },
                            }}
                        />
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        msg_article: state.registers.msg_article,
        categoryList: state.registers.categoryList,
        msg_addCategory: state.registers.msg_addCategory,
        articleDetails: state.registers.articleDetails,
        msg_updateArticle: state.registers.msg_updateArticle,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        postArticle,
        updateArticle,
        getListCategory,
        getArticleDetails,
        addCategory,
        articleImageUpload,
    }
)(HelpNew);
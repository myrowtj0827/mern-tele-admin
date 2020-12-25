import React, {Component} from 'react';
import '../assets/css/views.css';

import {connect} from "react-redux";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import bgImage from "../assets/img/markus-winkler-cover.svg"
import {
    getArticleDetailsById,
    getArticleCommentById,
} from "../redux/actions/register/help-articles"

class HelpDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articleInfo: '',
            commentsInfo: '',
            list: '',
            visible: false,

            article_id: this.props.match.params.id,
        };
    };

    componentDidMount() {
        let navigator_info = window.navigator;
        let screen_info = window.screen;
        let uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';

        const {
            getArticleDetailsById,
            getArticleCommentById,
        } = this.props;

        const datas = {
            _id: this.props.match.params.id,
            uid: uid,
        };
        const data = {
            _id: this.props.match.params.id,
        };

        if(getArticleDetailsById) {
            getArticleDetailsById(datas);
        }

        if(getArticleCommentById) {
            getArticleCommentById(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.articleDetailById && prevProps.articleDetailById !== this.props.articleDetailById) {
            this.setState({
                articleInfo: this.props.articleDetailById,
            })
        }

        if(this.props.articleCommentById && prevProps.articleCommentById !== this.props.articleCommentById) {
            this.setState({
                commentsInfo: this.props.articleCommentById,
            })
        }
    }

    onContentStateChange = (e) => {
        this.setState({[e.target.id]: e.target.value || ''});
    };

    EditArticle = () => {
        window.location.href = '/help-new/' + this.props.match.params.id;
    };

    toggleChange = () => {
        this.setState({
            visible: !this.state.visible,
        })
    };
    render() {
        return (
            <>
                <div className="articles-title publish">

                    <div className="online-therapy">
                        <div className="pt-20 align-l">
                            <div className="txt-26 col-txt-title align-l txt-break">
                                {
                                    this.state.articleInfo[0] && this.state.articleInfo[0].title
                                }
                            </div>
                            <div className="pt-20 flex-space details">
                                <div className="pt-20 pb-20 txt-16 col-date general-nataly">
                                <img className="photo-article"
                                     src={
                                         this.state.articleInfo[0] && this.state.articleInfo[0]['users'][0]['photo']
                                             ?
                                             this.state.articleInfo[0]['users'][0]['photo']
                                             :
                                             require('../assets/img/account.svg')}
                                     alt=""
                                />

                                {
                                    this.state.articleInfo[0] && this.state.articleInfo[0].writtenDate
                                }
                                <span className="col-blue date-rl">
                                    {
                                        this.state.articleInfo[0] && this.state.list && this.state.list[this.state.articleInfo[0].category_id]
                                    }
                                </span>
                                by
                                <span className="col-blue date-rl">
                                    {
                                        this.state.articleInfo[0] && this.state.articleInfo[0]['users'][0]['name']
                                    }
                                </span>
                            </div>

                                <div className="col-heavyDark pt-10 txt-bold readers-likes" style={{ color: '#0004'}}>
                                    <div className="justify-center">
                                        <img style={{marginRight: 10}} src={require('../assets/img/view.svg')} alt="" />
                                        <span>
                                            {
                                                this.state.articleInfo[0] && this.state.articleInfo[0].readers
                                            }
                                        </span>
                                    </div>
                                    <div className="pt-10">
                                        <img className="" src={require('../assets/img/yes-icon.svg')} alt="" />
                                        <span style={{paddingLeft: 20}}>{this.state.articleInfo[0] && this.state.articleInfo[0].likes > 0? this.state.articleInfo[0].likes : 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="blog-bg"
                                style={{backgroundImage: this.state.articleInfo[0] && this.state.articleInfo[0].src ? 'url(' + this.state.articleInfo[0].src + ')' : 'url(' + bgImage + ')'}}
                            />

                            <div className="txt-lorem-pt txt-16 col-desc txt-break">
                                {
                                    this.state.articleInfo[0] && this.state.articleInfo[0].content
                                }
                            </div>
                        </div>
                        {
                            this.state.articleInfo[0] && localStorage.provider_id === this.state.articleInfo[0].user_id ?
                            <div className="pt-45 flex-edit">
                                <div className="btn-common txt-16 col-white align-center mouse-cursor margin-r" onClick={this.props.history.goBack}>Back</div>
                                <div className="btn-common txt-16 col-white align-center mouse-cursor" onClick={this.EditArticle}>Edit</div>
                            </div>
                                :
                            <div className="pt-45 flex-edit">
                                <div className="btn-common txt-16 col-white align-center mouse-cursor margin-r" onClick={this.props.history.goBack}>Back</div>
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        articleDetailById: state.registers.articleDetailById,
        articleCommentById: state.registers.articleCommentById,
    }
};

export default connect(
    mapStateToProps,
    {
        getArticleDetailsById,
        getArticleCommentById,
    }
)(HelpDetails);
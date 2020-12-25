import React, { Component } from 'react';
import SettingsHeader from "./settings-header";

import '../assets/css/settings.css';
import {connect} from "react-redux";
import { updateDragDrop, getDragList } from "../redux/actions/register/login-register";
import Task from './task';
import { DragDropContext } from 'react-beautiful-dnd';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let arrayList = [
    {'title': 'Client List', 'color': '#743ba2'},
    {'title': 'Message Center', 'color': '#2f4f81'},
    {'title': 'Appointment List', 'color': '#80b540'},
    {'title': 'Invoice List', 'color': '#5680e9'},
    {'title': 'Payment List', 'color': '#5ab9ea'},
    {'title': 'Client Request List', 'color': '#84ceeb'},
    {'title': 'Document List', 'color': '#2faf81'},
];

let toDo = [{
    'id': '1',
    'title': 'Dashboard Customizing',
    'list': arrayList,
}];

class SettingsDrag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragList: '',
            flag_update: false,
            flag: 0,
        }
    }

    componentDidMount() {
        this.initial();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.getDragLists && this.props.getDragLists !== prevProps.getDragLists && this.props.getDragLists.length === 7) {
            this.setState({
                dragList: this.props.getDragLists,
            });

            toDo[0]['list'] = this.props.getDragLists;
        }

        if(this.props.msg_dragUpdate && ((this.state.flag === 0 && this.props.msg_dragUpdate !== prevProps.msg_dragUpdate) || prevState.flag_update !== this.state.flag_update)) {
            toast(this.props.msg_dragUpdate);
            this.setState({
                flag: 1,
            })
        }
    }

    initial = () => {
        const {
            getDragList,
        } = this.props;

        if(getDragList) {
            const data = {
                id: localStorage.provider_id,
                role: 'provider',
            };

            getDragList(data);
        }
    };

    onDragEnd = (result) => {
        console.log(result);
        if (!result.destination) {
            return;
        }
        let sourceIdx = parseInt(result.source.index);
        let destIdx = parseInt(result.destination.index);
        let draggedLink = toDo[0]['list'][sourceIdx];
        let newList = toDo[0]['list'].slice();
        newList.splice(sourceIdx, 1);
        newList.splice(destIdx, 0, draggedLink);
        toDo[0]['list'] = newList;
        console.log(toDo[0]['list'])
    };

    onDragUpdate = () => {
        const {
            updateDragDrop
        } = this.props;

        this.setState({
            flag_update: !this.state.flag_update,
        });

        if(updateDragDrop) {
            const data = {
                id: localStorage.provider_id,
                role: "provider",
                list: toDo[0]['list'],
            };
            updateDragDrop(data);
        }
    };

    render() {
        return (
            <>
                <ToastContainer />
                <div className="setting-body-p">
                    <SettingsHeader/>

                    <div className="change-password-position drag">
                        <div className="card-common drag txt-16 txt-medium">
                            <DragDropContext onDragEnd = {(e) => this.onDragEnd(e)}>
                                <Task toDo = {toDo[0]}/>
                            </DragDropContext>
                        </div>

                        <div className="pt-30 justify-right">
                            <div className="btn-drag mouse-cursor" onClick={this.onDragUpdate}>
                                Update
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        msg_dragUpdate: state.registers.msg_dragUpdate,
        getDragLists: state.registers.getDragLists,
    }
};

export default connect(
    mapStateToProps,
    {
        updateDragDrop, getDragList,
    }
)(SettingsDrag);
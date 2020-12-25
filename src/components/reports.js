import React, {Component} from 'react';
import '../assets/css/views.css';
import {
    appointmentClients,
    appointmentGrouping,
} from "../redux/actions/register/create-appointment";
import {connect} from "react-redux";
import {
    Bar,
    //Line,
} from 'react-chartjs-2';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayAppt: [],
            arrayGrouping: [],
            /**
             * Appointment List
             */
            flag: 1,
            appointment_page_num: '',
            appointment_current_page: 1,
            appointment_page_neighbours: 1,
            appointment_pagination: 10,

            labels: [],
            datasets: [],

            prev_state: '',
            nCount: 0,

        }
    }

    componentDidMount() {
        this.initial(this.state.appointment_pagination);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.appointmentClientList !== this.props.appointmentClientList || this.state.flag !== prevState.flag) {
            this.setState({
                arrayAppt: this.props.appointmentClientList.list,
                appointment_page_num: this.props.appointmentClientList.page_num,
            })
        }
        if(this.props.appointmentGroupingList && prevProps.appointmentGroupingList !== this.props.appointmentGroupingList) {
            this.setState({
                arrayGrouping: this.props.appointmentGroupingList,
            });

            this.setState({
                labels: this.props.appointmentGroupingList.date,
                datasets: [
                    {
                        label: 'Number of Sessions',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: this.props.appointmentGroupingList.session_num,
                    }
                ]
            });

            console.log("++++++++++", this.props.appointmentGroupingList.session_num)
        }
    }

    initial = (pagination) => {
        const {
            appointmentClients,
            appointmentGrouping,
        } = this.props;

        if (appointmentClients) {
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
                flag: 0,
                appointment_current_page: 1,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: pagination,
            };
            appointmentClients(data);
        }

        if(appointmentGrouping) {
            const data = {
                role: 'provider',
                id: localStorage.provider_id,
            };
            appointmentGrouping(data);
        }
    };
    onAppointmentPageClick = (item) => {
        this.setState({
            appointment_current_page: item,
        });

        const {
            appointmentClients
        } = this.props;

        const data = {
            role: 'provider',
            id: localStorage.provider_id,
            flag: 0,
            appointment_current_page: item,
            appointment_page_neighbours: this.state.appointment_page_neighbours,
            appointment_pagination: this.state.appointment_pagination,
        };

        if (appointmentClients) {
            appointmentClients(data);
        }
    };
    handleChange = (e) => {
        this.setState({
            appointment_pagination: e.target.value,
            appointment_current_page: 1,
        });
        this.initial(e.target.value);
    };

    onFlagChange = (e) => {
        let flag;
        if(this.state.prev_state !== e) {
            flag = 1;
            this.setState({
                prev_state: e,
                nCount: 0,
            })
        } else {
            this.setState({
                nCount: this.state.nCount + 1,
            });

            if(this.state.nCount % 2 === 0) {
                flag = 1;
            } else {
                flag = -1;
            }
        }
        const {
            appointmentClients
        } = this.props;

        const data = {
            role: 'provider',
            id: localStorage.provider_id,
            flag: 0,
            appointment_current_page: 1,
            appointment_page_neighbours: this.state.appointment_page_neighbours,
            appointment_pagination: this.state.appointment_pagination,
            filter_string: {
                [e]: flag,
            }
        };
        this.setState({
            appointment_current_page: 1,
        });

        if (appointmentClients) {
            appointmentClients(data);
        }
    };
    exportTableToCSV = (filename) => {
        let csv = [];
        let rows = document.querySelectorAll("table tr");

        console.log(rows);


        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");

            for (let j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    };
    downloadCSV = (csv, filename) => {
        let csvFile;
        let downloadLink;

        // CSV file
        csvFile = new Blob([csv], {type: "text/csv"});

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    };
    render() {
        const appointmentPageArray = [];
        if (this.state.appointment_page_num) {
            for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k++) {
                appointmentPageArray.push(k);
            }
        }

        let txt_appt;
        if (this.state.appointment_page_num) {
            let m = this.state.appointment_page_num.num_total;
            let nStart = this.state.appointment_pagination * (this.state.appointment_page_num.start_page - 1) + 1;
            let nEnd = Number(this.state.appointment_pagination) + nStart - 1;
            if (nEnd > m) {
                nEnd = m;
            }
            txt_appt = "Showing " + nStart + " to " + nEnd + " of " + m + " entries";
        }

        const paginationArray = [10, 25, 50, 100];
        return (
            <>
                <div>
                    <Bar
                        data={this.state}
                        options={{
                            title:{
                                display:true,
                                text:'Number of Sessions - ' + new Date().toLocaleString([], {
                                    year: 'numeric',
                                    month: 'long',
                                }),
                                fontSize:20
                            },
                            legend:{
                                display:true,
                                position:'bottom'
                            },
                        }}
                    />
                </div>

                {/*<div>*/}
                {/*    <Line*/}
                {/*        data={this.state}*/}
                {/*        options={{*/}
                {/*            title:{*/}
                {/*                display:true,*/}
                {/*                text:'Number of Sessions - ' + new Date().toLocaleString([], {*/}
                {/*                    year: 'numeric',*/}
                {/*                    month: 'long',*/}
                {/*                }),*/}
                {/*                fontSize:20*/}
                {/*            },*/}
                {/*            legend:{*/}
                {/*                display:true,*/}
                {/*                position:'bottom'*/}
                {/*            }*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="pt-45 report1 flex-space">
                    <div className="flex-space report col-disabled">
                        Show
                        <select className="mouse-cursor" style={{marginLeft: 20, marginRight: 20}} onChange={this.handleChange}>
                            {
                                paginationArray.map((item, key) => {
                                    return (
                                        <option key={key} value={item}>{item}</option>
                                    )
                                })
                            }

                        </select>
                        entries
                    </div>

                    <div className="right-position report col-disabled justify-center">
                        {/*Search*/}
                        {/*<input style={{marginLeft: 20}}/>*/}
                        {/*<span className="report mouse-cursor">Copy</span>*/}
                        <span className="report mouse-cursor" onClick={() => this.exportTableToCSV('members.csv')}>CSV</span>
                        <span className="report mouse-cursor" onClick={() => window.print("")}>Print</span>
                    </div>
                </div>

                <div className="pt-20 col-disabled">
                    {
                        txt_appt
                    }
                </div>

                <div className="report-list table-border">
                    <table id={'report'} className="report col-black align-center">
                        <thead>
                        <tr className="report txt-14 txt-medium">
                            <th>No</th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("attendees")}>
                                <div className="flex-space filter-hover">
                                    Attendees
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("online")}>
                                <div className="flex-space filter-hover">
                                    Online
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("start_time")}>
                                <div className="flex-space filter-hover">
                                    Scheduled Start
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("end_time")}>
                                <div className="flex-space filter-hover">
                                    Scheduled End
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("actual_start")}>
                                <div className="flex-space filter-hover">
                                    Actual Start
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th className="mouse-cursor" onClick={() => this.onFlagChange("actual_end")}>
                                <div className="flex-space filter-hover">
                                    Actual End
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th id="number_attendees" className="">
                                <div className="flex-space filter-hover">
                                    Number of Attendees
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                            <th>Type</th>

                            <th id="created_date" className="mouse-cursor" onClick={() => this.onFlagChange("requested_date")}>
                                <div className="flex-space filter-hover">
                                    {/*<span>Revenue</span>*/}
                                    Created Date
                                    <span><img className="download-icon-size"
                                               src={require('../assets/img/download-icon.svg')} alt=""/></span>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="report txt-12">
                            {
                                this.state.arrayAppt && this.state.arrayAppt.length === 0 && (
                                    <td>No data available in table</td>
                                )
                            }

                        </tr>
                        {
                            this.state.arrayAppt && this.state.arrayAppt.length !== 0 && this.state.arrayAppt.map((item, key) => {
                                let client_list = '';
                                for (let k = 0; k < item.clientInfo.length; k++) {
                                    if(item.clientInfo[k] && item.clientInfo[k].name)
                                        client_list += item.clientInfo[k].name + ", ";
                                }

                                client_list.slice(client_list.length - 1, 1);
                                let nAttendees = item.clientInfo.length + 1;

                                return (
                                    <tr className="report txt-12" key={key}>
                                        <td>{ key + 1 }</td>
                                        <td>
                                            {localStorage.provider_name && localStorage.provider_name + ", "}
                                            {client_list}
                                        </td>
                                        <td>
                                            {
                                                item.online.toString().toUpperCase()
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.start_time && new Date(item.start_time).toLocaleString().toString()
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.end_time && new Date(item.end_time).toLocaleString().toString()
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.actual_start && new Date(item.actual_start).toLocaleString().toString()
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.actual_end && new Date(item.actual_end).toLocaleString().toString()
                                            }
                                        </td>
                                        <td>
                                            { nAttendees }
                                        </td>
                                        <td>
                                            {
                                                item.appointment_type && item.appointment_type
                                            }
                                            {
                                                item.invite_client === true && 'Requested'
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.requested_date && new Date(item.requested_date).toLocaleString().toString()
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                    {/*<div className="right-position">*/}
                    {/*    <div className="previous-next">Previous</div>*/}
                    {/*    <div className="previous-next">Next</div>*/}
                    {/*</div>*/}
                </div>
                <div className="pt-30 justify-center pb-20">
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appointmentClientList: state.registers.appointmentClientList,
        appointmentGroupingList: state.registers.appointmentGroupingList,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        appointmentClients,
        appointmentGrouping,
    }
)(Reports);
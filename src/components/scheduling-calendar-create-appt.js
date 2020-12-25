import React from 'react';
import '../assets/css/scheduling.css';

const SchedulingCalendarCreateAppt = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <>
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div className="create-header txt-18 justify-left col-white">Create Appointment</div>

                    <div className="modal-body txt-16 txt-medium col-darkBlue">
                        <div className="flex-space">
                            <div>
                                <label className="container-event align-l">
                                    <span className="">ALL DAY</span>
                                    <input type="checkbox"/>
                                    <span className="checkMark"/>
                                </label>
                            </div>

                            <div>
                                <label className="container-event align-l">
                                    <span className="">RECURRING</span>
                                    <input type="checkbox" defaultChecked={true}/>
                                    <span className="checkMark"/>
                                </label>
                            </div>

                            <div>
                                <label className="container-event align-l">
                                    <span className="">ONLINE</span>
                                    <input type="checkbox" defaultChecked={true}/>
                                    <span className="checkMark"/>
                                </label>
                            </div>
                        </div>

                        <div className="modal-txt-p">TITLE</div>
                        <input placeholder="Appointment"/>

                        <div className="modal-txt-p">TIME</div>
                        <div className="flex-space">
                            <input placeholder="August 21, 2020 6:00 PM"/>
                            <div><img src={require('../assets/img/line-icon.svg')} alt="" /></div>
                            <input placeholder="August 21, 2020 7:00 PM"/>
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps">
                            <div>
                                <div className="modal-txt-p">Provider</div>
                                <input className="provider" placeholder="Davy"/>
                            </div>

                            <div>
                                <div className="modal-txt-p">REPEAT UNTIL</div>
                                <input className="until" placeholder="August 21, 2020 7:00 PM"/>
                            </div>

                            <div>
                                <div className="modal-txt-p">INVITEES</div>
                                <input className="until" placeholder=""/>
                            </div>

                            <div>
                                <div className="modal-txt-p">RECURRENCE FREQUENCY (DAYS)</div>
                                <input className="until" placeholder="7"/>
                            </div>
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps cancel-create-p">
                            <div className="btn-common mouse-cursor cancel justify-center" onClick={handleClose}>Cancel</div>
                            <div className="btn-common mouse-cursor create justify-center col-white">Create</div>
                        </div>
                    </div>

                </section>
            </div>
        </>
    )
}
export default SchedulingCalendarCreateAppt;
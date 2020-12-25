import React, {Component} from 'react';
import '../assets/css/practice.css';
import PracticesHeader from "./practice-header";

class PracticeBranding extends Component{
    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
        };
    }

    interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    interpolateColors(color1, color2, steps) {
        let stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);

        for(let i = 0; i < steps; i++) {
            interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
        }
        return interpolatedColorArray;
    }

    colors = () => {
        let colorArray = this.interpolateColors("rgb(94, 79, 162)", "rgb(247, 148, 89)", 7);
        console.log(colorArray);
    };

    pressEntre(e) {
        let key = e.charCode || e.keyCode || 0;
        if(key === 13) {
            console.log(key);
        }
    };

    render() {
        return (
            <>
                <PracticesHeader/>
                <div className="payment-body">
                    <div className="payment-card txt-14 col-heavyDark">
                        <div className="flex-space">
                            <div className="txt-18 col-darkBlue" onClick={this.colors}>Custom Branding</div>
                            <span className="">
                                <label className="switchBtn">
                                    <input type="checkbox" />
                                    <div className="slide round"></div>
                                </label>
                             </span>
                        </div>

                        <div className="flex-space warning-message invoice">
                            <div className="flex-warning txt-14 col-darkBlue">
                                <img className="warning-icon" src={require('../assets/img/warning-circle.svg')} alt="" />
                                <div className="payment-pl-5">
                                    Custom branding allows you to apply your company name, colors and logo across the application. This includes the sidebar, Scheduler, emails to your clients, login page, and more.
                                </div>
                            </div>
                        </div>

                        <div className="txt-16">URL Options</div>

                        <div className="flex-space warning-message invoice">
                            <div className="flex-warning txt-14 col-darkBlue">
                                <img className="warning-icon" src={require('../assets/img/warning-circle.svg')} alt="" />
                                <div className="payment-pl-5">
                                    In order to present your clients with a branded login page, they must access the login page using a unique URL. You may customize the URL "slug" — the part of the URL that makes it unique. PROVIDE THIS URL TO YOUR CLIENTS. Set your URL slug to generate a URL.                                </div>
                            </div>
                        </div>

                        <input placeholder="URL SLUG"/>

                        <div className="flex-common updated">
                            <div className="btn-common btn-update add-office col-white align-center mouse-cursor">Update</div>
                        </div>

                        <div className="txt-16">Color Options</div>

                        <div className="flex-space warning-message invoice">
                            <div className="flex-warning txt-14 col-darkBlue">
                                <img className="warning-icon" src={require('../assets/img/warning-circle.svg')} alt="" />
                                <div className="payment-pl-5">
                                    You may specify custom colors for each of the color categories across the application.
                                    Each color category contains a scale of lighter and darker color shades to be used throughout the application. Shades are generated automatically for each scale based on a base color that you provide.
                                    Make sure that the text displayed on top of each shade below are legible for each shade. If your base color is too dark or light, some fonts will be illegible. We recommend that base colors be near a 50% luminance.
                                    Colors may be specified in any web color format such as hex, RGB, or HSL.
                                </div>
                            </div>
                        </div>

                        <div className="pt-30">
                            <div className="flex-grid8">
                                <div className="color-txt justify-center" style={{backgroundColor: "#7EFF00"}}>
                                    <div className="txt-22 txt-bold">Primary</div>
                                    <div className="color-input">
                                        <input  placeholder="#354332"
                                               style={{backgroundColor: "blue"}}
                                               value={this.state.inputValue} onChange={e => this.pressEntre(e.target.value)} onKeyPress={this.pressEntre} required/>
                                    </div>
                                </div>
                                <div style={{backgroundColor: "#00FDFF"}}></div>
                                <div style={{backgroundColor: "#00FF41"}}></div>
                                <div style={{backgroundColor: "#21FF00"}}></div>
                                <div style={{backgroundColor: "#7EFF00"}}></div>
                                <div style={{backgroundColor: "#E0FF00"}}></div>
                                <div style={{backgroundColor: "#FFC000"}}></div>
                                <div  className="end-rad" style={{backgroundColor: "#FF0000"}}></div>
                            </div>
                            <div className="flex-grid8">
                                <div className="color-txt justify-center" style={{backgroundColor: "#7EFF00"}}>
                                    <div className="txt-22 txt-bold">Primary</div>
                                    <div className="color-input">
                                        <input  placeholder="#354332"
                                                style={{backgroundColor: "blue"}}
                                                value={this.state.inputValue} onChange={e => this.pressEntre(e.target.value)} onKeyPress={this.pressEntre} required/>
                                    </div>
                                </div>
                                <div style={{backgroundColor: "#00FDFF"}}></div>
                                <div style={{backgroundColor: "#00FF41"}}></div>
                                <div style={{backgroundColor: "#21FF00"}}></div>
                                <div style={{backgroundColor: "#7EFF00"}}></div>
                                <div style={{backgroundColor: "#E0FF00"}}></div>
                                <div style={{backgroundColor: "#FFC000"}}></div>
                                <div  className="end-rad" style={{backgroundColor: "#FF0000"}}></div>
                            </div>
                            <div className="flex-grid8">
                                <div className="color-txt justify-center" style={{backgroundColor: "#7EFF00"}}>
                                    <div className="txt-22 txt-bold">Primary</div>
                                    <div className="color-input">
                                        <input  placeholder="#354332"
                                                style={{backgroundColor: "blue"}}
                                                value={this.state.inputValue} onChange={e => this.pressEntre(e.target.value)} onKeyPress={this.pressEntre} required/>
                                    </div>
                                </div>
                                <div style={{backgroundColor: "#00FDFF"}}></div>
                                <div style={{backgroundColor: "#00FF41"}}></div>
                                <div style={{backgroundColor: "#21FF00"}}></div>
                                <div style={{backgroundColor: "#7EFF00"}}></div>
                                <div style={{backgroundColor: "#E0FF00"}}></div>
                                <div style={{backgroundColor: "#FFC000"}}></div>
                                <div  className="end-rad" style={{backgroundColor: "#FF0000"}}></div>
                            </div>
                            <div className="flex-grid8">
                                <div className="color-txt justify-center" style={{backgroundColor: "#7EFF00"}}>
                                    <div className="txt-22 txt-bold">Primary</div>
                                    <div className="color-input">
                                        <input  placeholder="#354332"
                                                style={{backgroundColor: "blue"}}
                                                value={this.state.inputValue} onChange={e => this.pressEntre(e.target.value)} onKeyPress={this.pressEntre} required/>
                                    </div>
                                </div>
                                <div style={{backgroundColor: "#00FDFF"}}></div>
                                <div style={{backgroundColor: "#00FF41"}}></div>
                                <div style={{backgroundColor: "#21FF00"}}></div>
                                <div style={{backgroundColor: "#7EFF00"}}></div>
                                <div style={{backgroundColor: "#E0FF00"}}></div>
                                <div style={{backgroundColor: "#FFC000"}}></div>
                                <div  className="end-rad" style={{backgroundColor: "#FF0000"}}></div>
                            </div>
                            <div className="flex-grid8">
                                <div className="color-txt justify-center" style={{backgroundColor: "#7EFF00"}}>
                                    <div className="txt-22 txt-bold">Primary</div>
                                    <div className="color-input">
                                        <input  placeholder="#354332"
                                                style={{backgroundColor: "blue"}}
                                                value={this.state.inputValue} onChange={e => this.pressEntre(e.target.value)} onKeyPress={this.pressEntre} required/>
                                    </div>
                                </div>
                                <div style={{backgroundColor: "#00FDFF"}}></div>
                                <div style={{backgroundColor: "#00FF41"}}></div>
                                <div style={{backgroundColor: "#21FF00"}}></div>
                                <div style={{backgroundColor: "#7EFF00"}}></div>
                                <div style={{backgroundColor: "#E0FF00"}}></div>
                                <div style={{backgroundColor: "#FFC000"}}></div>
                                <div  className="end-rad" style={{backgroundColor: "#FF0000"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default PracticeBranding;
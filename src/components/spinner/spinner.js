import React from 'react';
import './spinner.scss';

class Spinner extends React.Component {
    render() {
        return (
            <div className="spinner">
                <div className="spinnerCube cube1">
                    <span>.</span>
                </div>
                <div className="spinnerCube cube2">
                    <span>..</span>
                </div>
                <div className="spinnerCube cube4">
                    <span>::</span>
                </div>
                <div className="spinnerCube cube3">
                    <span>...</span>
                </div>
            </div>
        );
    }
}

export default Spinner;

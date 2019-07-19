import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './button.scss';

class Button extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        animateOnHover: PropTypes.bool,
        isPrimary: PropTypes.bool,
        isUppercase: PropTypes.bool,
        shadowed: PropTypes.bool,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        text: '',
        animateOnHover: false,
        isPrimary: false,
        isUppercase: false,
        shadowed: false,
        onClick: () => { },
    };

    render() {
        const { isPrimary, isUppercase, onClick, text } = this.props;
        return (
            <div className={classNames({
                button: true,
                default: !isPrimary,
                primary: isPrimary,
                uppercase: isUppercase,
                unselectableText: true,
            })}
                onClick={onClick}>
                <span className="buttonLabel">{text}</span>
                <span className="somethingElse"></span>
            </ div>
        );
    }
}

export default Button;

import PropTypes from 'prop-types'
import { useLocation } from "react-router-dom";
import Button from './Button'


const Header = ({ title, onToggleShowTask, shouldShow }) => {
    const location = useLocation();
    return (
        <header className="header">
            <h1>{title}</h1>
            {location.pathname === '/' &&
                <Button color={shouldShow ? 'red' : 'green'} text={shouldShow ? "Close" : "Add"}
                    onClick={onToggleShowTask}
                />
            }
        </header>
    );
}

Header.prototype = {
    title: PropTypes.string
}

export default Header

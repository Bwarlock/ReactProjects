import styles from '../styles/modules/button.module.scss';
import { getClasses } from '../utils/getClasses.js';
import PropTypes from 'prop-types';

const buttonTypes = {
  primary: 'primary',
  secondary: 'secondary',
};

function Button({ type, variant = 'primary', children, ...rest }) {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={getClasses([
        styles.button,
        styles[`button--${buttonTypes[variant]}`],
      ])}
      {...rest}
    >
      {children}
    </button>
  );
}
Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  variant: PropTypes.string,
};

function SelectButton({ children, id, ...rest }) {
  return (
    <select
      id={id}
      className={getClasses([styles.button, styles.button__select])}
      {...rest}
    >
      {children}
    </select>
  );
}
SelectButton.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

export { SelectButton };
export default Button;

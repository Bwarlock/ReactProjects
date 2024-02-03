import PropTypes from 'prop-types';
import styles from '../styles/modules/title.module.scss';

function PageTitle({children , ...rest}) {
  return (
    <h1 className={styles.title} {...rest}>
      {children}
    </h1>
  );
}
PageTitle.propTypes = {
  children: PropTypes.string
};

export default PageTitle


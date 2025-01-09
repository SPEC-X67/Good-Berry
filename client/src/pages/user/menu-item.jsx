import PropTypes from 'prop-types';

const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };  


const MenuItem = ({ icon: Icon, text, active, onClick }) => (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
        "transition-colors duration-200",
        "hover:bg-gray-100 hover:text-gray-900",
        active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
  
  MenuItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
  };

  export default MenuItem;
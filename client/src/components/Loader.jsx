import './Loader.css';

const Loader = ({ visible }) => (
  <div className={`loader ${visible ? '' : 'loader--hidden'}`} aria-hidden={!visible}>
    <span className="loader__mark">PS</span>
  </div>
);

export default Loader;

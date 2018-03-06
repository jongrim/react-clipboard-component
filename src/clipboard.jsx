import React from 'react';
import PropTypes from 'prop-types';

import clipboard from 'clipboard-polyfill';

const Clipboard = ({ children, component, data, dataType, onCopy, render, text, ...other }) => {
  const callOnCopy = () => {
    if (onCopy && typeof onCopy === 'function') {
      return onCopy();
    }
  };

  const copyText = text => clipboard.writeText(text);

  const copyData = (dataType, data) => {
    const dt = new clipboard.DT();
    dt.setData(dataType, data);
    return clipboard.write(dt);
  };

  const handleClick = () => {
    if (text) {
      return copyText(text).then(callOnCopy);
    }

    if (data && dataType) {
      return copyData(dataType, data).then(callOnCopy);
    }

    throw new Error(
      'No text prop or data and dataType prop specified. ' +
        'You must provide the text, or data and dataType to be copied on click.'
    );
  };

  if (render) {
    return render({ copyText, copyData, ...other });
  }

  if (component) {
    const Component = component;
    return <Component copyText={copyText} copyData={copyData} {...other} />;
  }

  return (
    <div onClick={handleClick} {...other}>
      {children}
    </div>
  );
};

Clipboard.propTypes = {
  children: PropTypes.node,
  component: PropTypes.func,
  data: PropTypes.string,
  dataType: PropTypes.string,
  onCopy: PropTypes.func,
  render: PropTypes.func,
  text: PropTypes.string
};

export default Clipboard;

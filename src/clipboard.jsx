import React from 'react';
import PropTypes from 'prop-types';

import clipboard from 'clipboard-polyfill';

const Clipboard = ({
  children,
  component,
  data,
  dataType,
  render,
  text,
  ...other
}) => {
  const copyText = text => clipboard.writeText(text);

  const copyData = (dataType, data) => {
    const dt = new clipboard.DT();
    dt.setData(dataType, data);
    return clipboard.write(dt);
  };

  function handleClick() {
    if (text) {
      return copyText(text);
    }

    if (data && dataType) {
      return copyData(dataType, data);
    }

    throw new Error(
      'No text prop or data and dataType prop specified. ' +
      'You must provide the text, or data and dataType to be copied on click.'
    );
  }

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
  render: PropTypes.func,
  text: PropTypes.string
};

export default Clipboard;

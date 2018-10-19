import React from 'react';
import PropTypes from 'prop-types';

import clipboard from 'clipboard-polyfill';

const Clipboard = ({
  children,
  component,
  data,
  dataType,
  multidata,
  onCopy,
  render,
  text,
  ...other
}) => {
  const callOnCopy = () => {
    if (onCopy && typeof onCopy === 'function') {
      return onCopy();
    }
  };

  const innerClipboard = new clipboard.DT();

  const copyText = text => clipboard.writeText(text);

  const copyData = () => {
    return clipboard.write(innerClipboard);
  };

  const handleClick = () => {
    if (!(data && dataType) && multidata.length === 0 && !text) {
      throw new Error(
        'No text prop or data and dataType prop specified. ' +
          'You must provide the text, or data and dataType to be copied on click.'
      );
    }

    if (text) {
      return copyText(text).then(callOnCopy);
    }

    if (multidata.length > 0) {
      multidata.forEach(i => {
        setData(i.dataType, i.data);
      });
    }

    if (data && dataType) {
      setData(dataType, data);
    }

    return copyData().then(callOnCopy);
  };

  const setData = (dataType, data) => {
    innerClipboard.setData(dataType, data);
  };

  if (render) {
    return render({ clipboard: innerClipboard, copyText, copyData, ...other });
  }

  if (component) {
    const Component = component;
    return (
      <Component clipboard={innerClipboard} copyText={copyText} copyData={copyData} {...other} />
    );
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
  multidata: PropTypes.arrayOf(
    PropTypes.shape({
      dataType: PropTypes.string,
      data: PropTypes.string,
    })
  ),
  onCopy: PropTypes.func,
  render: PropTypes.func,
  text: PropTypes.string,
};

Clipboard.defaultProps = {
  multidata: [],
};

export default Clipboard;

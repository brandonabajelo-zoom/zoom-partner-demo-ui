import React from 'react';
import PropTypes from 'prop-types';
import { Result } from 'antd';

export default function Error({ error }) {
  const { status = '', data = {} } = ((error || {}).response || {});

  return <Result title={status} subTitle={data.msg} />
}

Error.propTypes = {
  error: PropTypes.objectOf(PropTypes.any).isRequired,
};

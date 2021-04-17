import React from 'react';
import PropTypes from 'prop-types';
import { Result, Button } from 'antd';
import axios from 'axios';

export default function Error({ error, refetch }) {
  const { status = '', data: { msg } } = (error || {}).response;
  const refreshToken = async () => await axios.post('/api/login').then(() => refetch());

  return (
    <Result
      title={status}
      subTitle={msg}
      extra={status === 401 && refetch
        ? [<Button key="refresh" type="primary" onClick={refreshToken}>Refresh Token</Button>]
        : undefined}
    />
  );
}

Error.propTypes = {
  error: PropTypes.objectOf(PropTypes.any).isRequired,
  refetch: PropTypes.func.isRequired,
};

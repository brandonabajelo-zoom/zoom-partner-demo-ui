import React from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import qs from 'query-string';
import { Spin } from 'antd';
import ReactJson from 'react-json-view'

import Error from '../error';

/**
 * View quality of service metrics for specific webinar participant
 */
export default function QoS({ webinarId, participantId }) {
  const [
    { data = {}, loading, error },
  ] = useAxios(`/api/dashboard/metrics/webinars/${webinarId}/participants/${participantId}/qos?${qs.stringify({
    type: 'past',
  })}`)

  if (error) {
    return <Error error={error} />
  }

  if (loading) {
    return (
      <div className="qos-loading">
        <Spin />
      </div>
    );
  }

  const jsonProps = {
    displayDataTypes: false,
    displayObjectSize: false,
    theme: 'bright:inverted',
    collapsed: 1,
    quotesOnKeys: false,
    displayArrayKey: false,
  }

  return <ReactJson src={data} {...jsonProps} />
}

QoS.propTypes = {
  webinarId: PropTypes.string.isRequired,
  participantId: PropTypes.string.isRequired,
};


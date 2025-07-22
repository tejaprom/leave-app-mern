// components/LoadingWrapper.jsx
import { Spin } from 'antd'; // or any other spinner you like
import React from 'react';

const LoadingWrapper = ({ isLoading, children, height = '60vh' }) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height,
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;

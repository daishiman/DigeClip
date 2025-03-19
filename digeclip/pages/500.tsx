import React from 'react';
import { NextPage } from 'next';

const Custom500: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>サーバーエラーが発生しました</h1>
        <p style={{ marginTop: '1rem' }}>
          サーバーでエラーが発生しました。お手数ですが、再度お試しください。
        </p>
        <button
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.25rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => window.location.reload()}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
};

export default Custom500;

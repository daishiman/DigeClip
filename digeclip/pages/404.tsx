import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>404 - ページが見つかりません</h1>
        <p style={{ marginTop: '1rem' }}>
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.25rem',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

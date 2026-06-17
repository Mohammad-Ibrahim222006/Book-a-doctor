const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f8fafc',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div className="pulse-loader" />
      <p style={{ marginTop: 16, color: '#64748b', fontSize: 14 }}>Loading...</p>
    </div>
  </div>
);

export default PageLoader;
import React from 'react'

function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '24px',
      minWidth: '200px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
          {title}
        </p>
        {Icon && (
          <div style={{ 
            color: '#000', 
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Icon />
          </div>
        )}
      </div>
      <h2 style={{margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: '#111'}}>
        {value}
      </h2>
    </div>
  )
}

export default DashboardCard

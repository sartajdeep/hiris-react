import { useState } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../components/ToastContext';

export default function Settings() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    calendlyAutoSend: true,
    aiScreening: true,
    darkMode: document.documentElement.classList.contains('dark'),
    orgName: 'Plaksha University',
    notificationEmail: 'smriti@plaksha.edu.in',
    calendlyUrl: 'calendly.com/hiris-plaksha',
  });

  function toggle(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }));
    if (key === 'darkMode') document.documentElement.classList.toggle('dark');
    toast('Setting updated', 'success');
  }

  const toggleRow = (label, key, desc) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <div className={`toggle-track ${settings[key] ? 'on' : ''}`} onClick={() => toggle(key)} style={{ cursor: 'pointer', flexShrink: 0 }}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );

  return (
    <Layout variant="chro">
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>
        <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Settings</h1>

        {/* Profile */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 15, color: 'var(--navy)', marginBottom: 16 }}>Profile & Organisation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label className="label">Organisation Name</label>
              <input className="field" value={settings.orgName} onChange={e => setSettings(s => ({ ...s, orgName: e.target.value }))} /></div>
            <div><label className="label">Notification Email</label>
              <input className="field" type="email" value={settings.notificationEmail} onChange={e => setSettings(s => ({ ...s, notificationEmail: e.target.value }))} /></div>
            <div><label className="label">Calendly URL</label>
              <input className="field" value={settings.calendlyUrl} onChange={e => setSettings(s => ({ ...s, calendlyUrl: e.target.value }))} /></div>
            <button className="btn btn-teal btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => toast('Profile saved', 'success')}>Save Changes</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>Preferences</div>
          {toggleRow('Email Notifications', 'emailNotifications', 'Receive email alerts for approvals, interviews, and offers')}
          {toggleRow('Calendly Auto-Send', 'calendlyAutoSend', 'Automatically send Calendly links when a candidate moves to Interview stage')}
          {toggleRow('AI Screening', 'aiScreening', 'Enable AI to auto-score and rank candidates using your rubrics')}
          {toggleRow('Dark Mode', 'darkMode', 'Toggle the interface between light and dark themes')}
        </div>

        {/* Danger zone */}
        <div className="card" style={{ padding: 24, border: '1px solid #FECACA' }}>
          <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 15, color: 'var(--error)', marginBottom: 12 }}>Danger Zone</div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>These actions are irreversible. Please proceed with caution.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: '#FECACA' }} onClick={() => toast('Export started — you\'ll receive an email', 'info')}>Export All Data</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: '#FECACA' }} onClick={() => toast('Contact support to delete your account', 'warning')}>Delete Account</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

"use client";

import { useEffect, useState } from "react";
import "@/styles/forum.css";

import EmailGate from "./EmailGate";

type PostItem = {
  id: number;
  title: string;
  tag: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
};

export default function ForumPage() {
  const [checked, setChecked] = useState<null | boolean>(null);
  const [view, setView] = useState<'overview' | 'list'>('overview');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);

  // on mount, check localStorage for saved login
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexus_forum_email');
      if (saved) setChecked(true);
    } catch (e) {
      // ignore
    }
  }, []);

  const tabs = [
    { id: 'general', title: 'General', description: 'For general discussions, community topics, introductions, and non-technical conversations.', navigateUrl: '/forum/general' },
    { id: 'account', title: 'Account Issues', description: 'Need help with your account? Report login problems, password resets, profile issues.', navigateUrl: '/forum/account-issues' },
    { id: 'pep', title: 'PEP Issues', description: 'Dedicated space for PEP discussions and enquiries.', navigateUrl: '/forum/pep-issues' },
  ];

  useEffect(() => {
    if (!checked || view !== 'list') return;
    let mounted = true;
    setLoading(true);
    fetch(`/forum/posts?category=${encodeURIComponent(activeTab)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setPosts(data.posts || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [checked, view, activeTab]);

  const adminPosts = posts.filter((p) => p.isAdmin);
  const userPosts = posts.filter((p) => !p.isAdmin);

  function truncate(s: string, n = 20) {
    return s.length > n ? s.slice(0, n) + '...' : s;
  }

  // Not yet authorized: show email gate
  if (!checked) {
    return (
      <main className="forum-container">
        <section className="forum-section">
          <div className="forum-wrap" style={{ maxWidth: 720 }}>
            <div className="forum-header">
              <h1 className="forum-title">Enter your email to access the forum</h1>
              <p className="forum-subtitle">Provide your registered email to continue.</p>
            </div>
            <EmailGate onSuccess={() => setChecked(true)} />
          </div>
        </section>
      </main>
    );
  }

  // Overview: show description cards
  if (view === 'overview') {
    return (
      <main className="forum-container">
        <section className="forum-section">
          <div className="forum-wrap">
            <div className="forum-header">
              <h1 className="forum-title">Forum</h1>
              <p className="forum-subtitle">Choose a category to get started with your discussion</p>
            </div>

            <div className="forum-content">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className="forum-card"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setView('list');
                  }}
                >
                  <h3 className="forum-card-title">{tab.title}</h3>
                  <p className="forum-card-description">{tab.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // List view: categories left, content right
  return (
    <main className="forum-container">
      <section className="forum-section">
        <div className="forum-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
            <aside>
              <div style={{ marginBottom: 12 }}>
                <a href="/forum/new" className="forum-tab" style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}>New Thread</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`forum-tab ${activeTab === t.id ? 'active' : ''}`}
                    style={{ textAlign: 'left' }}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <button onClick={() => setView('overview')} className="forum-tab" style={{ padding: '6px 10px' }}>Back to categories</button>
                <div style={{ flex: 1 }}>
                  <input placeholder="Search threads..." disabled style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {adminPosts.length > 0 && (
                  <div className="forum-card no-hover">
                    <h4 style={{ marginTop: 0 }}>Admins' recent posts</h4>
                    <div style={{ marginTop: 12 }}>
                      {adminPosts.map((p) => (
                        <div key={p.id} style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{truncate(p.title)}</div>
                            <div style={{ fontSize: 12, color: 'var(--nx-muted)' }}>{p.tag} • {p.username} <span style={{ marginLeft: 8, padding: '2px 6px', background: '#8a2be2', borderRadius: 6, fontSize: 11, color: 'white' }}>ADMIN</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userPosts.length > 0 && (
                  <div className="forum-card no-hover">
                    <h4 style={{ marginTop: 0 }}>Community posts</h4>
                    <div style={{ marginTop: 12 }}>
                      {userPosts.map((p) => (
                        <div key={p.id} style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{truncate(p.title)}</div>
                            <div style={{ fontSize: 12, color: 'var(--nx-muted)' }}>{p.tag} • {p.username}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminPosts.length === 0 && userPosts.length === 0 && (
                  <div className="forum-card no-hover">
                    <div style={{ padding: 12 }}>Create the first post</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  pagesCount: number;
}

interface Comic {
  id: string;
  title: string;
  description: string;
  publisher: string;
  coverUrl: string;
  writer: string;
  artist: string;
  chapters: Chapter[];
}

interface Log {
  id: string;
  user: { email: string };
  chapter: {
    title: string;
    chapterNumber: number;
    comic: { title: string };
  };
  status: string;
  timestamp: string;
}

@customElement('app-root')
export class AppRoot extends LitElement {
  static override styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    header {
      background-color: #1e293b;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-user span {
      background-color: #334155;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
    }

    button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #2563eb;
    }

    button.secondary {
      background-color: #64748b;
    }

    button.secondary:hover {
      background-color: #475569;
    }

    button.danger {
      background-color: #ef4444;
    }

    button.danger:hover {
      background-color: #dc2626;
    }

    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    /* Auth Screens */
    .auth-box {
      max-width: 400px;
      margin: 5rem auto;
      background: white;
      padding: 2.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .auth-box h2 {
      margin-bottom: 1.5rem;
      text-align: center;
      color: #1e293b;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #475569;
    }

    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 1rem;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .auth-toggle {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #64748b;
    }

    .auth-toggle span {
      color: #3b82f6;
      cursor: pointer;
      font-weight: 600;
    }

    /* Main Dashboard Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
    }

    .card h3 {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
      color: #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Comics Listing */
    .comic-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .comic-list {
        grid-template-columns: 1fr 1fr;
      }
    }

    .comic-card {
      display: flex;
      gap: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      padding: 1rem;
      background: #f8fafc;
      transition: box-shadow 0.2s;
    }

    .comic-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .comic-cover {
      width: 100px;
      height: 140px;
      object-fit: cover;
      border-radius: 0.25rem;
      background-color: #cbd5e1;
    }

    .comic-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .comic-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: #0f172a;
      margin: 0;
    }

    .comic-meta {
      font-size: 0.825rem;
      color: #64748b;
      margin: 0.25rem 0;
    }

    /* Comic Detail & Chapters */
    .comic-detail-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 640px) {
      .comic-detail-header {
        flex-direction: column;
        align-items: center;
      }
    }

    .comic-detail-cover {
      width: 200px;
      height: 280px;
      object-fit: cover;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .chapter-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .chapter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
    }

    .chapter-info {
      display: flex;
      flex-direction: column;
    }

    .chapter-name {
      font-weight: 600;
      color: #1e293b;
    }

    .chapter-pages {
      font-size: 0.825rem;
      color: #64748b;
    }

    .status-select {
      padding: 0.35rem 0.75rem;
      border-radius: 0.25rem;
      border: 1px solid #cbd5e1;
      background-color: white;
      font-weight: 500;
    }

    /* Logs view */
    .log-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.875rem;
    }

    .log-item:last-child {
      border-bottom: none;
    }

    .log-status {
      display: inline-block;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .log-status.unread { background: #e2e8f0; color: #475569; }
    .log-status.in_progress { background: #dbeafe; color: #1e40af; }
    .log-status.completed { background: #dcfce7; color: #166534; }

    .nav-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }

    .nav-tab {
      background: none;
      color: #64748b;
      font-weight: 600;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    .nav-tab.active {
      color: #3b82f6;
      border-bottom: 2px solid #3b82f6;
      border-radius: 0;
    }

    .error-msg {
      background-color: #fef2f2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      border: 1px solid #fee2e2;
    }
  `;

  @state() token = localStorage.getItem('token') || '';
  @state() user: { email: string; role: string } | null = null;
  @state() authMode: 'login' | 'register' = 'login';
  @state() currentTab: 'library' | 'logs' | 'admin' = 'library';

  // Form states
  @state() email = '';
  @state() password = '';
  @state() registerRole = 'USER';
  @state() errorMsg = '';

  // Data states
  @state() comics: Comic[] = [];
  @state() activeComic: Comic | null = null;
  @state() progress: Record<string, 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED'> = {};
  @state() logs: Log[] = [];

  // Admin Create states
  @state() newComicTitle = '';
  @state() newComicDesc = '';
  @state() newComicPublisher = '';
  @state() newComicCoverUrl = '';
  @state() newComicWriter = '';
  @state() newComicArtist = '';

  @state() newChapterTitle = '';
  @state() newChapterNum = '';
  @state() newChapterPages = '';

  override connectedCallback() {
    super.connectedCallback();
    if (this.token) {
      this.fetchProfile();
    } else {
      this.fetchComics();
    }
  }

  async fetchProfile() {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        this.user = await res.json() as any;
        this.fetchComics();
        this.fetchProgress();
        this.fetchLogs();
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  async fetchComics() {
    try {
      const res = await fetch('/api/comics');
      if (res.ok) {
        this.comics = await res.json() as any;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async fetchProgress() {
    if (!this.token) return;
    try {
      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        const list: { chapterId: string; status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED' }[] = await res.json() as any;
        const map: Record<string, 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED'> = {};
        for (const item of list) {
          map[item.chapterId] = item.status;
        }
        this.progress = map;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async fetchLogs() {
    if (!this.token) return;
    try {
      const endpoint = this.user?.role === 'ADMIN' ? '/api/progress/logs/all' : '/api/progress/logs';
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        this.logs = await res.json() as any;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleAuth(e: Event) {
    e.preventDefault();
    this.errorMsg = '';
    const endpoint = this.authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = this.authMode === 'login'
      ? { email: this.email, password: this.password }
      : { email: this.email, password: this.password, role: this.registerRole };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as any;
      if (res.ok) {
        if (this.authMode === 'login') {
          this.token = data.access_token;
          localStorage.setItem('token', this.token);
          await this.fetchProfile();
        } else {
          this.authMode = 'login';
          this.errorMsg = 'Registration successful! Please login.';
        }
        this.email = '';
        this.password = '';
      } else {
        this.errorMsg = data.message || 'Authentication failed';
      }
    } catch {
      this.errorMsg = 'Server connection error';
    }
  }

  logout() {
    this.token = '';
    this.user = null;
    this.progress = {};
    this.activeComic = null;
    this.currentTab = 'library';
    localStorage.removeItem('token');
  }

  async handleStatusChange(chapterId: string, status: 'UNREAD' | 'IN_PROGRESS' | 'COMPLETED') {
    if (!this.token) {
      window.alert('You must be logged in to update your progress.');
      return;
    }
    try {
      const res = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ chapterId, status }),
      });
      if (res.ok) {
        this.progress = { ...this.progress, [chapterId]: status };
        this.fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleCreateComic(e: Event) {
    e.preventDefault();
    try {
      const res = await fetch('/api/comics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          title: this.newComicTitle,
          description: this.newComicDesc || undefined,
          publisher: this.newComicPublisher || undefined,
          coverUrl: this.newComicCoverUrl || undefined,
          writer: this.newComicWriter || undefined,
          artist: this.newComicArtist || undefined,
        }),
      });
      if (res.ok) {
        await this.fetchComics();
        this.newComicTitle = '';
        this.newComicDesc = '';
        this.newComicPublisher = '';
        this.newComicCoverUrl = '';
        this.newComicWriter = '';
        this.newComicArtist = '';
        window.alert('Comic created successfully!');
      } else {
        const d = await res.json() as any;
        window.alert(d.message || 'Failed to create comic');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleAddChapter(e: Event) {
    e.preventDefault();
    if (!this.activeComic) return;
    try {
      const res = await fetch(`/api/comics/${this.activeComic.id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          title: this.newChapterTitle,
          chapterNumber: parseFloat(this.newChapterNum),
          pagesCount: parseInt(this.newChapterPages, 10),
        }),
      });
      if (res.ok) {
        // Refresh active comic to include the new chapter
        const updated = await fetch(`/api/comics/${this.activeComic.id}`);
        if (updated.ok) {
          this.activeComic = await updated.json() as any;
        }
        await this.fetchComics();
        this.newChapterTitle = '';
        this.newChapterNum = '';
        this.newChapterPages = '';
        window.alert('Chapter added successfully!');
      } else {
        const d = await res.json() as any;
        window.alert(d.message || 'Failed to add chapter');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleDeleteComic(id: string) {
    if (!window.confirm('Are you sure you want to delete this comic and all of its chapters?')) return;
    try {
      const res = await fetch(`/api/comics/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        if (this.activeComic?.id === id) {
          this.activeComic = null;
        }
        await this.fetchComics();
        window.alert('Comic deleted successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  }

  renderAuth() {
    return html`
      <div class="auth-box">
        <h2>${this.authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        ${this.errorMsg ? html`<div class="error-msg">${this.errorMsg}</div>` : ''}
        <form @submit=${this.handleAuth}>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" required .value=${this.email} @input=${(e: any) => this.email = e.target.value}>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" required .value=${this.password} @input=${(e: any) => this.password = e.target.value}>
          </div>
          ${this.authMode === 'register' ? html`
            <div class="form-group">
              <label>Role</label>
              <select .value=${this.registerRole} @change=${(e: any) => this.registerRole = e.target.value}>
                <option value="USER">Standard User</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          ` : ''}
          <button type="submit" style="width: 100%; padding: 0.75rem;">
            ${this.authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div class="auth-toggle">
          ${this.authMode === 'login' ? html`
            New here? <span @click=${() => { this.authMode = 'register'; this.errorMsg = ''; }}>Create an account</span>
          ` : html`
            Already have an account? <span @click=${() => { this.authMode = 'login'; this.errorMsg = ''; }}>Sign In</span>
          `}
        </div>
      </div>
    `;
  }

  renderLibraryTab() {
    if (this.activeComic) {
      const isProgressOwner = !!this.user;
      return html`
        <div>
          <button class="secondary" style="margin-bottom: 1.5rem;" @click=${() => this.activeComic = null}>
            ← Back to Library
          </button>

          <div class="card">
            <div class="comic-detail-header">
              <img class="comic-detail-cover" src=${this.activeComic.coverUrl || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop'} alt=${this.activeComic.title}>
              <div>
                <h2 style="margin-bottom: 0.5rem; color: #1e293b;">${this.activeComic.title}</h2>
                <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1rem;">${this.activeComic.description || 'No description provided.'}</p>
                <div style="font-size: 0.875rem; color: #475569; display: flex; flex-direction: column; gap: 0.25rem;">
                  <div><strong>Publisher:</strong> ${this.activeComic.publisher || 'N/A'}</div>
                  <div><strong>Writer:</strong> ${this.activeComic.writer || 'N/A'}</div>
                  <div><strong>Artist:</strong> ${this.activeComic.artist || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Chapters</h3>
            <div class="chapter-list">
              ${this.activeComic.chapters.length === 0 ? html`
                <p style="color: #64748b; font-style: italic;">No chapters added yet.</p>
              ` : this.activeComic.chapters.map(ch => {
                const currentStatus = this.progress[ch.id] || 'UNREAD';
                return html`
                  <div class="chapter-row">
                    <div class="chapter-info">
                      <span class="chapter-name">Ch. ${ch.chapterNumber}: ${ch.title}</span>
                      <span class="chapter-pages">${ch.pagesCount} pages</span>
                    </div>
                    <div>
                      ${isProgressOwner ? html`
                        <select class="status-select" .value=${currentStatus} @change=${(e: any) => this.handleStatusChange(ch.id, e.target.value)}>
                          <option value="UNREAD">Unread</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      ` : html`
                        <span class="log-status unread">Login to track</span>
                      `}
                    </div>
                  </div>
                `;
              })}
            </div>
          </div>

          ${this.user?.role === 'ADMIN' ? html`
            <div class="card">
              <h3>Admin: Add Chapter</h3>
              <form @submit=${this.handleAddChapter}>
                <div class="form-group">
                  <label>Chapter Title</label>
                  <input type="text" required .value=${this.newChapterTitle} @input=${(e: any) => this.newChapterTitle = e.target.value}>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div class="form-group" style="margin-bottom: 0;">
                    <label>Chapter Number</label>
                    <input type="number" step="0.1" required .value=${this.newChapterNum} @input=${(e: any) => this.newChapterNum = e.target.value}>
                  </div>
                  <div class="form-group" style="margin-bottom: 0;">
                    <label>Pages Count</label>
                    <input type="number" required .value=${this.newChapterPages} @input=${(e: any) => this.newChapterPages = e.target.value}>
                  </div>
                </div>
                <button type="submit">Add Chapter</button>
              </form>
            </div>
          ` : ''}
        </div>
      `;
    }

    return html`
      <div>
        <h2 style="color: #1e293b; margin-bottom: 1.5rem;">All Comics</h2>
        <div class="comic-list">
          ${this.comics.map(c => html`
            <div class="comic-card">
              <img class="comic-cover" src=${c.coverUrl || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop'} alt=${c.title}>
              <div class="comic-info">
                <div>
                  <h4 class="comic-title">${c.title}</h4>
                  <p class="comic-meta">By ${c.writer || 'Unknown'}</p>
                  <p class="comic-meta" style="font-style: italic;">${c.chapters?.length || 0} Chapters</p>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button @click=${() => this.activeComic = c}>View Details</button>
                  ${this.user?.role === 'ADMIN' ? html`
                    <button class="danger" @click=${() => this.handleDeleteComic(c.id)}>Delete</button>
                  ` : ''}
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  renderLogsTab() {
    return html`
      <div class="card">
        <h3>${this.user?.role === 'ADMIN' ? 'Global Activity History' : 'My Reading Progress Logs'}</h3>
        <div style="margin-top: 1rem;">
          ${this.logs.length === 0 ? html`
            <p style="color: #64748b; font-style: italic;">No activities logged yet.</p>
          ` : this.logs.map(log => html`
            <div class="log-item">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                <strong>${log.chapter.comic.title}</strong>
                <span class="log-status ${log.status.toLowerCase()}">${log.status}</span>
              </div>
              <div style="color: #475569; font-size: 0.825rem; margin-bottom: 0.25rem;">
                Chapter ${log.chapter.chapterNumber}: "${log.chapter.title}"
              </div>
              <div style="color: #94a3b8; font-size: 0.75rem; display: flex; justify-content: space-between;">
                <span>User: ${log.user?.email || 'Unknown'}</span>
                <span>${new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  renderAdminTab() {
    return html`
      <div class="card">
        <h3>Admin: Add New Comic Series</h3>
        <form @submit=${this.handleCreateComic} style="margin-top: 1.5rem;">
          <div class="form-group">
            <label>Title</label>
            <input type="text" required .value=${this.newComicTitle} @input=${(e: any) => this.newComicTitle = e.target.value}>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea rows="3" .value=${this.newComicDesc} @input=${(e: any) => this.newComicDesc = e.target.value}></textarea>
          </div>
          <div class="form-group">
            <label>Publisher</label>
            <input type="text" .value=${this.newComicPublisher} @input=${(e: any) => this.newComicPublisher = e.target.value}>
          </div>
          <div class="form-group">
            <label>Cover Image URL</label>
            <input type="url" .value=${this.newComicCoverUrl} @input=${(e: any) => this.newComicCoverUrl = e.target.value}>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label>Writer</label>
              <input type="text" .value=${this.newComicWriter} @input=${(e: any) => this.newComicWriter = e.target.value}>
            </div>
            <div class="form-group">
              <label>Artist</label>
              <input type="text" .value=${this.newComicArtist} @input=${(e: any) => this.newComicArtist = e.target.value}>
            </div>
          </div>
          <button type="submit" style="margin-top: 1rem;">Create Comic Series</button>
        </form>
      </div>
    `;
  }

  override render() {
    if (!this.user && this.authMode === 'register') {
      return this.renderAuth();
    }
    if (!this.user && this.authMode === 'login' && this.comics.length === 0) {
      // Show login only if we want to log in
      return this.renderAuth();
    }

    return html`
      <header>
        <h1>Comics Reading Tracker</h1>
        <div class="header-user">
          ${this.user ? html`
            <span>${this.user.email} (${this.user.role})</span>
            <button class="danger" @click=${this.logout}>Logout</button>
          ` : html`
            <button @click=${() => { this.authMode = 'login'; this.errorMsg = ''; }}>Sign In</button>
          `}
        </div>
      </header>

      <div class="container">
        ${this.user ? html`
          <div class="nav-tabs">
            <button class="nav-tab ${this.currentTab === 'library' ? 'active' : ''}" @click=${() => this.currentTab = 'library'}>
              Library
            </button>
            <button class="nav-tab ${this.currentTab === 'logs' ? 'active' : ''}" @click=${() => this.currentTab = 'logs'}>
              Activity Logs
            </button>
            ${this.user.role === 'ADMIN' ? html`
              <button class="nav-tab ${this.currentTab === 'admin' ? 'active' : ''}" @click=${() => this.currentTab = 'admin'}>
                Admin Panel
              </button>
            ` : ''}
          </div>
        ` : ''}

        <div class="dashboard-grid">
          <div style="grid-column: span 1;">
            ${this.currentTab === 'library' ? this.renderLibraryTab() : ''}
            ${this.currentTab === 'logs' ? this.renderLogsTab() : ''}
            ${this.currentTab === 'admin' ? this.renderAdminTab() : ''}
          </div>

          ${this.currentTab === 'library' ? html`
            <div style="grid-column: span 1;">
              ${this.user ? html`
                ${this.renderLogsTab()}
              ` : html`
                <div class="card">
                  <h3>Get Started</h3>
                  <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">
                    Sign in to track your individual chapter progress, view complete reading logs, and gain access to advanced options.
                  </p>
                  <button style="width: 100%; margin-top: 1rem;" @click=${() => { this.authMode = 'login'; this.errorMsg = ''; }}>
                    Sign In / Register
                  </button>
                </div>
              `}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

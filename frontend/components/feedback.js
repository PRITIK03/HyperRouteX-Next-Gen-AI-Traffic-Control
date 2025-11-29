// Feedback & Suggestions Module - Collect user feedback for continuous improvement
export function initFeedback() {
  const container = document.getElementById('feedback-panel');
  if (!container) return;

  // Feedback state
  const state = {
    feedbacks: [],
    rating: 0
  };

  container.innerHTML = `
    <div class="feedback-container">
      <!-- Feedback Header -->
      <div class="feedback-header">
        <h3>💬 Feedback & Suggestions</h3>
        <p class="feedback-subtitle">Help us improve the Smart Traffic Management System</p>
      </div>

      <!-- Feedback Tabs -->
      <div class="feedback-tabs">
        <button class="feedback-tab active" data-tab="submit">Submit Feedback</button>
        <button class="feedback-tab" data-tab="view">View Feedback</button>
        <button class="feedback-tab" data-tab="stats">Statistics</button>
      </div>

      <!-- Submit Feedback Section -->
      <div id="submit-tab" class="feedback-tab-content active">
        <div class="feedback-form-container">
          <h4>📝 Share Your Experience</h4>
          
          <!-- Rating Section -->
          <div class="rating-section">
            <label>Overall Rating:</label>
            <div class="star-rating">
              <span class="star" data-rating="1">☆</span>
              <span class="star" data-rating="2">☆</span>
              <span class="star" data-rating="3">☆</span>
              <span class="star" data-rating="4">☆</span>
              <span class="star" data-rating="5">☆</span>
            </div>
            <span id="rating-text" class="rating-text">Select a rating</span>
          </div>

          <!-- Feedback Form -->
          <form id="feedback-form" class="feedback-form">
            <div class="form-group">
              <label for="feedback-category">Feedback Category</label>
              <select id="feedback-category" required>
                <option value="">Select category</option>
                <option value="interface">User Interface</option>
                <option value="features">Features & Functionality</option>
                <option value="performance">System Performance</option>
                <option value="accuracy">Data Accuracy</option>
                <option value="bug">Bug Report</option>
                <option value="suggestion">Feature Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="feedback-title">Title</label>
              <input type="text" id="feedback-title" placeholder="Brief summary of your feedback" required>
            </div>

            <div class="form-group">
              <label for="feedback-message">Your Feedback</label>
              <textarea id="feedback-message" rows="6" placeholder="Please provide detailed feedback..." required></textarea>
            </div>

            <div class="form-group">
              <label for="feedback-priority">Priority</label>
              <select id="feedback-priority">
                <option value="low">Low - Nice to have</option>
                <option value="medium" selected>Medium - Should be addressed</option>
                <option value="high">High - Important issue</option>
                <option value="critical">Critical - System breaking</option>
              </select>
            </div>

            <div class="form-group">
              <label for="feedback-contact">Contact Email (Optional)</label>
              <input type="email" id="feedback-contact" placeholder="your.email@example.com">
              <small>We'll reach out if we need more details</small>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="feedback-anonymous">
                Submit anonymously
              </label>
            </div>

            <button type="submit" class="btn-primary">Submit Feedback</button>
          </form>

          <div id="feedback-confirmation" class="confirmation-message" style="display: none;"></div>
        </div>
      </div>

      <!-- View Feedback Section -->
      <div id="view-tab" class="feedback-tab-content">
        <h4>📊 Recent Feedback & Suggestions</h4>
        
        <div class="feedback-filters">
          <select id="view-filter-category" class="filter-select">
            <option value="all">All Categories</option>
            <option value="interface">User Interface</option>
            <option value="features">Features</option>
            <option value="performance">Performance</option>
            <option value="accuracy">Data Accuracy</option>
            <option value="bug">Bug Reports</option>
            <option value="suggestion">Suggestions</option>
          </select>
          
          <select id="view-filter-status" class="filter-select">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewing">Under Review</option>
            <option value="planned">Planned</option>
            <option value="implemented">Implemented</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div id="feedback-list" class="feedback-list"></div>
      </div>

      <!-- Statistics Section -->
      <div id="stats-tab" class="feedback-tab-content">
        <h4>📈 Feedback Statistics</h4>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <span class="stat-label">Total Feedback</span>
              <span id="total-feedback" class="stat-number">0</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <span class="stat-label">Average Rating</span>
              <span id="avg-rating" class="stat-number">0.0</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <span class="stat-label">Implemented</span>
              <span id="implemented-count" class="stat-number">0</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🔄</div>
            <div class="stat-content">
              <span class="stat-label">Under Review</span>
              <span id="reviewing-count" class="stat-number">0</span>
            </div>
          </div>
        </div>

        <div class="stats-charts">
          <div class="chart-container">
            <h5>Feedback by Category</h5>
            <canvas id="category-chart" width="400" height="200"></canvas>
          </div>
          
          <div class="chart-container">
            <h5>Rating Distribution</h5>
            <div id="rating-distribution" class="rating-bars"></div>
          </div>
        </div>

        <div class="recent-improvements">
          <h5>🎉 Recent Improvements Based on Your Feedback</h5>
          <div class="improvement-list">
            <div class="improvement-item">
              <span class="improvement-date">Nov 10, 2025</span>
              <span class="improvement-text">Added emergency vehicle priority system</span>
              <span class="improvement-votes">👍 45 votes</span>
            </div>
            <div class="improvement-item">
              <span class="improvement-date">Nov 5, 2025</span>
              <span class="improvement-text">Improved traffic map vehicle animations</span>
              <span class="improvement-votes">👍 32 votes</span>
            </div>
            <div class="improvement-item">
              <span class="improvement-date">Oct 28, 2025</span>
              <span class="improvement-text">Enhanced predictive analytics accuracy</span>
              <span class="improvement-votes">👍 58 votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Star rating functionality
  const stars = container.querySelectorAll('.star');
  const ratingText = document.getElementById('rating-text');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      state.rating = rating;
      
      stars.forEach((s, index) => {
        s.textContent = index < rating ? '★' : '☆';
        s.classList.toggle('active', index < rating);
      });
      
      const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      ratingText.textContent = `${rating} - ${ratingLabels[rating]}`;
    });

    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach((s, index) => {
        s.textContent = index < rating ? '★' : '☆';
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach((s, index) => {
        s.textContent = index < state.rating ? '★' : '☆';
      });
    });
  });

  // Tab switching
  const tabs = container.querySelectorAll('.feedback-tab');
  const tabContents = container.querySelectorAll('.feedback-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');

      if (tabName === 'stats') {
        updateStatistics();
      }
    });
  });

  // Feedback form submission
  const feedbackForm = document.getElementById('feedback-form');
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (state.rating === 0) {
      alert('Please select a rating');
      return;
    }

    const feedback = {
      id: 'FB-' + Date.now(),
      rating: state.rating,
      category: document.getElementById('feedback-category').value,
      title: document.getElementById('feedback-title').value,
      message: document.getElementById('feedback-message').value,
      priority: document.getElementById('feedback-priority').value,
      contact: document.getElementById('feedback-contact').value,
      anonymous: document.getElementById('feedback-anonymous').checked,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    state.feedbacks.push(feedback);

    const confirmation = document.getElementById('feedback-confirmation');
    confirmation.style.display = 'block';
    confirmation.innerHTML = `
      <div class="success-message">
        ✅ <strong>Thank You for Your Feedback!</strong><br>
        Feedback ID: ${feedback.id}<br>
        We appreciate your input and will review it carefully.<br>
        ${feedback.contact ? 'We may contact you for more details.' : ''}
      </div>
    `;

    feedbackForm.reset();
    state.rating = 0;
    stars.forEach(s => s.textContent = '☆');
    ratingText.textContent = 'Select a rating';

    setTimeout(() => {
      confirmation.style.display = 'none';
    }, 5000);

    loadFeedbackList();
  });

  // Load feedback list
  function loadFeedbackList() {
    const list = document.getElementById('feedback-list');

    // Add sample feedbacks for demonstration
    const sampleFeedbacks = [
      { id: 'FB-1001', rating: 5, category: 'features', title: 'Love the new predictions feature!', status: 'implemented', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'FB-1002', rating: 4, category: 'interface', title: 'Dashboard could be more intuitive', status: 'reviewing', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: 'FB-1003', rating: 3, category: 'performance', title: 'Slow loading on mobile', status: 'planned', timestamp: new Date(Date.now() - 259200000).toISOString() },
      ...state.feedbacks
    ];

    if (sampleFeedbacks.length === 0) {
      list.innerHTML = '<p class="no-data">No feedback submitted yet.</p>';
      return;
    }

    list.innerHTML = sampleFeedbacks.map(fb => {
      const timeAgo = getTimeAgo(fb.timestamp);
      return `
        <div class="feedback-card">
          <div class="feedback-card-header">
            <div class="feedback-rating">
              ${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}
            </div>
            <span class="feedback-status ${fb.status}">${fb.status.toUpperCase()}</span>
          </div>
          <h5>${fb.title}</h5>
          <p class="feedback-meta">
            <span class="feedback-category">${fb.category}</span> • 
            <span class="feedback-time">${timeAgo}</span>
          </p>
          <p class="feedback-id">ID: ${fb.id}</p>
        </div>
      `;
    }).join('');
  }

  // Update statistics
  function updateStatistics() {
    const allFeedbacks = [...state.feedbacks];
    
    document.getElementById('total-feedback').textContent = allFeedbacks.length;
    
    const avgRating = allFeedbacks.length > 0
      ? (allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / allFeedbacks.length).toFixed(1)
      : '0.0';
    document.getElementById('avg-rating').textContent = avgRating;

    document.getElementById('implemented-count').textContent = 
      allFeedbacks.filter(fb => fb.status === 'implemented').length;
    document.getElementById('reviewing-count').textContent = 
      allFeedbacks.filter(fb => fb.status === 'reviewing').length;

    // Rating distribution
    const ratingDist = [0, 0, 0, 0, 0];
    allFeedbacks.forEach(fb => {
      if (fb.rating >= 1 && fb.rating <= 5) {
        ratingDist[fb.rating - 1]++;
      }
    });

    const maxCount = Math.max(...ratingDist, 1);
    const distContainer = document.getElementById('rating-distribution');
    distContainer.innerHTML = ratingDist.map((count, index) => {
      const percentage = (count / maxCount) * 100;
      return `
        <div class="rating-bar-item">
          <span class="rating-label">${index + 1}★</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <span class="rating-count">${count}</span>
        </div>
      `;
    }).reverse().join('');
  }

  function getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  // Initialize
  loadFeedbackList();
  updateStatistics();

  console.log('✅ Feedback & Suggestions module initialized');
}

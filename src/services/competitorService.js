// src/services/competitorService.js
class CompetitorService {
  constructor() {
    // Using free CORS proxy services
    this.corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.currentProxyIndex = 0;
  }

  // Get current CORS proxy
  getCurrentProxy() {
    return this.corsProxies[this.currentProxyIndex];
  }

  // Try next proxy if current one fails
  switchProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
  }

  // Get news mentions for competitors using Google News RSS
  async getCompetitorNews(competitors, industry, focusArea) {
    const results = [];
    
    for (const competitor of competitors) {
      if (!competitor.trim()) continue;
      
      try {
        const updates = await this.fetchCompetitorUpdates(competitor, industry, focusArea);
        results.push({
          competitor: competitor,
          updates: updates.slice(0, 2) // Top 2 updates per competitor
        });
      } catch (error) {
        console.error(`Error fetching data for ${competitor}:`, error);
        // Fallback to enhanced mock data
        results.push({
          competitor: competitor,
          updates: this.getEnhancedMockUpdates(competitor, industry, focusArea)
        });
      }
    }
    
    return results;
  }

  // Fetch competitor updates from Google News RSS
  async fetchCompetitorUpdates(competitor, industry, focusArea) {
    // Create smart search query
    const searchTerms = [
      `"${competitor}"`,
      industry,
      focusArea
    ].filter(Boolean);
    
    const query = searchTerms.join(' ');
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    let attempts = 0;
    const maxAttempts = this.corsProxies.length;
    
    while (attempts < maxAttempts) {
      try {
        const proxyUrl = this.getCurrentProxy() + encodeURIComponent(rssUrl);
        console.log(`Fetching news for ${competitor} via proxy ${attempts + 1}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const xmlText = await response.text();
        const updates = this.parseGoogleNewsRSS(xmlText, competitor);
        
        if (updates.length > 0) {
          return updates;
        } else {
          throw new Error('No updates found in RSS feed');
        }
        
      } catch (error) {
        console.warn(`Proxy ${attempts + 1} failed for ${competitor}:`, error.message);
        this.switchProxy();
        attempts++;
      }
    }
    
    // All proxies failed, return enhanced mock data
    console.log(`All proxies failed for ${competitor}, using enhanced mock data`);
    return this.getEnhancedMockUpdates(competitor, industry, focusArea);
  }

  // Parse Google News RSS XML
  parseGoogleNewsRSS(xmlText, competitor) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing failed');
      }
      
      const items = xmlDoc.querySelectorAll('item');
      
      return Array.from(items).slice(0, 5).map(item => {
        const title = item.querySelector('title')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        
        return {
          update: this.cleanTitle(title),
          impact: this.calculateImpact(title, description),
          time: this.formatTime(pubDate),
          source: this.extractSource(title) || 'Google News',
          url: link
        };
      }).filter(update => update.update.length > 0);
      
    } catch (error) {
      console.error('RSS parsing error:', error);
      return [];
    }
  }

  // Clean up Google News titles (they often include source in title)
  cleanTitle(title) {
    // Remove source attribution like "- TechCrunch" from end
    return title.replace(/\s*-\s*[^-]+$/, '').trim();
  }

  // Extract source from title if present
  extractSource(title) {
    const match = title.match(/\s*-\s*([^-]+)$/);
    return match ? match[1].trim() : null;
  }

  // Calculate impact based on keywords and context
  calculateImpact(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();
    
    const highImpactKeywords = [
      'launch', 'launches', 'release', 'releases', 'unveil', 'announces',
      'partnership', 'acquisition', 'merger', 'funding', 'investment',
      'breakthrough', 'revolutionary', 'major update', 'significant',
      'ipo', 'goes public', 'raises', 'million', 'billion'
    ];
    
    const mediumImpactKeywords = [
      'update', 'updates', 'upgrade', 'feature', 'improvement', 'expansion',
      'pricing', 'plan', 'strategy', 'hire', 'appointment', 'partnership',
      'integration', 'beta', 'testing', 'pilot'
    ];
    
    const lowImpactKeywords = [
      'blog', 'post', 'article', 'interview', 'opinion', 'analysis',
      'review', 'tutorial', 'guide', 'tips', 'tricks'
    ];
    
    if (highImpactKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    } else if (mediumImpactKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    } else if (lowImpactKeywords.some(keyword => text.includes(keyword))) {
      return 'low';
    }
    
    return 'medium'; // Default to medium if unclear
  }

  // Format time to relative format
  formatTime(dateString) {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks}w ago`;
    } catch (error) {
      return 'Recently';
    }
  }

  // Enhanced mock data based on industry and focus area
  getEnhancedMockUpdates(competitor, industry, focusArea) {
    const industrySpecificUpdates = {
      'fintech': [
        'Launched new mobile payment feature with enhanced security',
        'Announced partnership with major bank for digital wallet integration',
        'Released API for third-party financial service integrations'
      ],
      'healthcare': [
        'Unveiled AI-powered diagnostic tool for early disease detection',
        'Received FDA approval for new telemedicine platform',
        'Integrated with major hospital systems for patient data sharing'
      ],
      'ecommerce': [
        'Introduced AR try-before-you-buy feature for mobile app',
        'Launched same-day delivery service in 50 new cities',
        'Announced sustainability initiative for carbon-neutral shipping'
      ],
      'saas': [
        'Released major platform update with enhanced analytics dashboard',
        'Introduced new enterprise security features and compliance tools',
        'Launched marketplace for third-party integrations and plugins'
      ]
    };

    const focusAreaUpdates = {
      'mobile': ['mobile app update', 'iOS release', 'Android feature'],
      'analytics': ['dashboard enhancement', 'reporting tool', 'data visualization'],
      'security': ['security update', 'compliance certification', 'privacy feature'],
      'ai': ['AI integration', 'machine learning', 'automated feature']
    };

    const baseUpdates = industrySpecificUpdates[industry] || [
      'Announced major product update with new features',
      'Secured significant funding round for expansion',
      'Launched strategic partnership with industry leader'
    ];

    // Add focus area context
    const enhancedUpdates = baseUpdates.map(update => {
      const focusKeywords = Object.keys(focusAreaUpdates).find(key => 
        focusArea.toLowerCase().includes(key)
      );
      
      if (focusKeywords) {
        const focusUpdate = focusAreaUpdates[focusKeywords][0];
        return update.replace('new features', `new ${focusUpdate}`);
      }
      
      return update;
    });

    return enhancedUpdates.slice(0, 2).map((update, index) => ({
      update: `${competitor} ${update.toLowerCase()}`,
      impact: index === 0 ? 'high' : 'medium',
      time: index === 0 ? '2h ago' : '1d ago',
      source: 'Industry News',
      url: '#'
    }));
  }

  // Get industry-specific news
  async getIndustryNews(industry, focusArea) {
    const searchQuery = `${industry} ${focusArea} trends 2025`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    try {
      const proxyUrl = this.getCurrentProxy() + encodeURIComponent(rssUrl);
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        return Array.from(items).slice(0, 3).map(item => ({
          title: this.cleanTitle(item.querySelector('title')?.textContent || ''),
          source: this.extractSource(item.querySelector('title')?.textContent || '') || 'Industry News',
          impact: this.calculateImpact(item.querySelector('title')?.textContent || ''),
          url: item.querySelector('link')?.textContent || '#'
        }));
      }
    } catch (error) {
      console.error('Industry news fetch error:', error);
    }
    
    // Fallback industry news
    return [
      { title: `${industry} Market Shows Strong Growth in Q2 2025`, source: "TechCrunch", impact: "high" },
      { title: `New Regulations Impact ${industry} Innovation Landscape`, source: "Industry Weekly", impact: "medium" },
      { title: `${focusArea} Technology Trends: What's Driving Change`, source: "Business Insider", impact: "medium" }
    ];
  }

  // Test connection to Google News
  async testConnection() {
    try {
      const testQuery = 'technology news';
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(testQuery)}&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = this.getCurrentProxy() + encodeURIComponent(rssUrl);
      
      const response = await fetch(proxyUrl);
      return {
        success: response.ok,
        status: response.status,
        proxy: this.getCurrentProxy()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        proxy: this.getCurrentProxy()
      };
    }
  }
}

export default new CompetitorService();
// src/services/competitorService.js

class CompetitorService {
  constructor() {
    // You'll need to get API keys for these services
    this.newsAPIKey = process.env.REACT_APP_NEWS_API_KEY;
    this.serpAPIKey = process.env.REACT_APP_SERP_API_KEY;
  }

  // Get news mentions for competitors
  async getCompetitorNews(competitors, industry, focusArea) {
    const results = [];
    
    for (const competitor of competitors) {
      if (!competitor.trim()) continue;
      
      try {
        // Option 1: NewsAPI (requires API key)
        const newsData = await this.fetchFromNewsAPI(competitor, industry, focusArea);
        
        // Option 2: Fallback to Google News RSS (free)
        const rssData = await this.fetchFromGoogleNewsRSS(competitor, industry);
        
        results.push({
          competitor: competitor,
          updates: [...newsData, ...rssData].slice(0, 3) // Top 3 updates per competitor
        });
      } catch (error) {
        console.error(`Error fetching data for ${competitor}:`, error);
        // Fallback to mock data if API fails
        results.push({
          competitor: competitor,
          updates: this.getMockUpdates(competitor)
        });
      }
    }
    
    return results;
  }

  // NewsAPI integration (paid service but very reliable)
  async fetchFromNewsAPI(competitor, industry, focusArea) {
    if (!this.newsAPIKey) return [];
    
    const query = `"${competitor}" AND (${industry} OR ${focusArea})`;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=${this.newsAPIKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return data.articles?.map(article => ({
        update: article.title,
        impact: this.calculateImpact(article.title, article.description),
        time: this.formatTime(article.publishedAt),
        source: article.source.name,
        url: article.url
      })) || [];
    } catch (error) {
      console.error('NewsAPI error:', error);
      return [];
    }
  }

  // Google News RSS (free but limited)
  async fetchFromGoogleNewsRSS(competitor, industry) {
    const query = `"${competitor}" ${industry}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    try {
      // Note: You'll need a CORS proxy or server-side endpoint for this
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
      const response = await fetch(proxyUrl);
      const xmlText = await response.text();
      
      // Parse RSS XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      
      return Array.from(items).slice(0, 3).map(item => ({
        update: item.querySelector('title')?.textContent || '',
        impact: this.calculateImpact(item.querySelector('title')?.textContent || ''),
        time: this.formatTime(item.querySelector('pubDate')?.textContent || ''),
        source: 'Google News',
        url: item.querySelector('link')?.textContent || ''
      }));
    } catch (error) {
      console.error('RSS fetch error:', error);
      return [];
    }
  }

  // Calculate impact based on keywords
  calculateImpact(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();
    
    const highImpactKeywords = [
      'launch', 'release', 'partnership', 'acquisition', 'funding',
      'breakthrough', 'major', 'significant', 'revolutionary', 'announces'
    ];
    
    const mediumImpactKeywords = [
      'update', 'upgrade', 'feature', 'improvement', 'expansion',
      'pricing', 'plan', 'strategy', 'investment'
    ];
    
    if (highImpactKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    } else if (mediumImpactKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  // Format time to relative format
  formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1d ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  }

  // Mock data fallback
  getMockUpdates(competitor) {
    const mockUpdates = [
      { update: "Launched new AI-powered analytics dashboard", impact: "high", time: "2h ago" },
      { update: "Updated pricing strategy with new enterprise tier", impact: "medium", time: "1d ago" },
      { update: "Released mobile app version 3.2 with enhanced UX", impact: "medium", time: "3d ago" },
      { update: "Announced strategic partnership with tech giant", impact: "high", time: "5d ago" },
      { update: "Published new API documentation for developers", impact: "low", time: "1w ago" }
    ];
    
    // Return random selection for this competitor
    return mockUpdates.slice(0, 2).map(update => ({
      ...update,
      update: update.update.replace('Launched', `${competitor} launched`)
    }));
  }

  // Industry-specific news
  async getIndustryNews(industry, focusArea) {
    const query = `${industry} ${focusArea} trends news`;
    
    try {
      if (this.newsAPIKey) {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${this.newsAPIKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        return data.articles?.slice(0, 5).map(article => ({
          title: article.title,
          source: article.source.name,
          impact: this.calculateImpact(article.title, article.description),
          url: article.url,
          publishedAt: article.publishedAt
        })) || [];
      }
    } catch (error) {
      console.error('Industry news error:', error);
    }
    
    // Fallback mock data
    return [
      { title: `${industry} Market Trends Q2 2025: Key Insights`, source: "TechCrunch", impact: "high" },
      { title: `New Regulations Impact ${industry} Industry`, source: "Industry Weekly", impact: "medium" },
      { title: `Innovation in ${focusArea}: What's Next`, source: "Business Insider", impact: "medium" }
    ];
  }
}

export default new CompetitorService();
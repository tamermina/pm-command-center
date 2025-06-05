import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  FileText, 
  Brain, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Lightbulb,
  ChevronRight,
  Plus,
  Download,
  Star
} from 'lucide-react';

// Add this import at the top of your App.jsx
import competitorService from './services/competitorService';

const PMCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [briefingData, setBriefingData] = useState({
    marketNews: [
      { title: "AI Product Development Trends Q2 2025", source: "TechCrunch", impact: "high" },
      { title: "New Mobile UX Guidelines Released", source: "Google Dev", impact: "medium" },
      { title: "Customer Retention Benchmarks Updated", source: "ProductHunt", impact: "medium" }
    ],
    competitorUpdates: [
      { company: "Competitor A", update: "Launched new dashboard feature", impact: "high" },
      { company: "Competitor B", update: "Pricing model changes", impact: "medium" }
    ],
    metrics: {
      dau: { value: "45,230", change: "+5.2%" },
      conversion: { value: "3.4%", change: "+0.3%" },
      churn: { value: "2.1%", change: "-0.4%" }
    }
  });
  
  const [competitorSetup, setCompetitorSetup] = useState({
    organization: '',
    industry: '',
    focusArea: '',
    competitors: ['', '', ''],
    isSetupComplete: false
  });
  const [competitorData, setCompetitorData] = useState([]);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [documentationInput, setDocumentationInput] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [generatedRequirements, setGeneratedRequirements] = useState('');

  const generateDocumentation = () => {
    if (!documentationInput.trim()) return;
    
    const polishedDoc = `# Product Requirements Document

## Overview
${documentationInput}

## User Stories
- As a user, I want to [action] so that I can [benefit]
- As a user, I need [functionality] in order to [achieve goal]

## Acceptance Criteria
✓ Feature meets accessibility standards (WCAG 2.1 AA)
✓ Performance impact < 100ms load time
✓ Mobile responsive design implemented
✓ Error handling and edge cases covered

## Technical Considerations
- API integration requirements
- Database schema updates needed
- Third-party service dependencies
- Security and privacy implications

## Success Metrics
- User engagement: Target 15% increase
- Task completion rate: >85%
- User satisfaction score: >4.2/5

## Timeline
- Research & Design: 1 week
- Development: 2-3 weeks  
- Testing & QA: 1 week
- Release & Monitor: Ongoing`;

    setGeneratedDoc(polishedDoc);
  };

  const generateRequirements = () => {
    if (!requirementsInput.trim()) return;

    const structured = `# Feature Requirements: ${requirementsInput}

## Epic
**As a product manager, I want to implement ${requirementsInput} so that our users can achieve their goals more effectively.**

## User Stories

### Primary Story
**As a [user type], I want to [action] so that I can [benefit].**

**Acceptance Criteria:**
- Given [context]
- When [action]
- Then [expected result]

### Supporting Stories
1. **Setup & Configuration**
   - As an admin, I want to configure ${requirementsInput} settings
   - AC: Admin panel includes all necessary configuration options

2. **User Experience**
   - As a user, I want an intuitive interface for ${requirementsInput}
   - AC: Interface follows established design patterns and is accessible

3. **Performance & Reliability**
   - As a user, I want ${requirementsInput} to work consistently
   - AC: 99.9% uptime, <2s response time

## Technical Requirements
- **Frontend:** React components with TypeScript
- **Backend:** RESTful API endpoints
- **Database:** Schema updates for new data models
- **Integration:** Third-party service compatibility
- **Security:** Authentication, authorization, data validation

## Definition of Done
☐ Code reviewed and approved
☐ Unit tests written and passing (>80% coverage)
☐ Integration tests completed
☐ Accessibility testing completed
☐ Performance benchmarks met
☐ Documentation updated
☐ Stakeholder sign-off received`;

    setGeneratedRequirements(structured);
  };

  // Add this function to fetch real competitor data
const fetchCompetitorData = async () => {
  if (!competitorSetup.isSetupComplete) return;
  
  setIsLoadingCompetitors(true);
  try {
    // Get competitor updates
    const competitors = competitorSetup.competitors.filter(c => c.trim());
    const competitorUpdates = await competitorService.getCompetitorNews(
      competitors, 
      competitorSetup.industry, 
      competitorSetup.focusArea
    );
    
    // Get industry news
    const industryNews = await competitorService.getIndustryNews(
      competitorSetup.industry, 
      competitorSetup.focusArea
    );
    
    setCompetitorData(competitorUpdates);
    setBriefingData(prev => ({
      ...prev,
      marketNews: industryNews
    }));
    
    setLastUpdated(new Date());
  } catch (error) {
    console.error('Error fetching competitor data:', error);
  } finally {
    setIsLoadingCompetitors(false);
  }
};

// Add useEffect to auto-fetch data when setup is completed
useEffect(() => {
  if (competitorSetup.isSetupComplete) {
    fetchCompetitorData();
    
    // Set up auto-refresh every 30 minutes
    const interval = setInterval(fetchCompetitorData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }
}, [competitorSetup.isSetupComplete]);

  const communicationTemplates = {
    'Executive Update': `# Weekly Executive Summary

## Key Highlights
- [Major accomplishment this week]
- [Important milestone reached]
- [Critical decision made]

## Metrics Dashboard
- **User Growth:** [X]% week-over-week
- **Revenue Impact:** $[X] additional ARR
- **Customer Satisfaction:** [X]/5 average rating

## Roadmap Progress
✅ Completed: [Feature/initiative]
🔄 In Progress: [Current priorities]
📅 Coming Next: [Next week's focus]

## Risks & Mitigation
- **Risk:** [Potential issue]
- **Impact:** [High/Medium/Low]
- **Mitigation:** [Action plan]

## Ask/Support Needed
- [Specific request for resources/decisions]`,

    'Engineering Sync': `# Engineering Sync Notes

## Sprint Goals
- [Primary objective]
- [Secondary objectives]

## Technical Requirements
- [Specific technical needs]
- [Performance requirements]
- [Integration points]

## Dependencies
- [External dependencies]
- [Cross-team dependencies]
- [Technical debt considerations]

## Questions for Engineering
1. [Technical feasibility question]
2. [Implementation approach question]
3. [Timeline/effort estimation]

## Next Steps
- [ ] [Action item with owner]
- [ ] [Action item with owner]`,

    'Customer Update': `# Product Update for Customers

## What's New
We're excited to share [feature/improvement] that will help you [benefit].

## Key Benefits
- **Improved [aspect]:** [Specific improvement and impact]
- **Enhanced [feature]:** [How it makes their workflow better]
- **Better [experience]:** [User experience enhancement]

## How to Get Started
1. [Step-by-step instructions]
2. [Additional guidance]
3. [Where to find help]

## Coming Soon
We're working on [future features] based on your feedback.

## Questions?
Reach out to [contact] for support or feedback.`
  };

  const [selectedTemplate, setSelectedTemplate] = useState('Executive Update');

  const prioritizationFrameworks = {
    'RICE Framework': {
      description: 'Reach × Impact × Confidence ÷ Effort',
      factors: ['Reach (users affected)', 'Impact (goal achievement)', 'Confidence (certainty level)', 'Effort (resources needed)'],
      calculation: 'Score = (Reach × Impact × Confidence) ÷ Effort'
    },
    'Value vs Effort': {
      description: 'Plot features on value/effort matrix',
      factors: ['Business Value', 'User Value', 'Development Effort', 'Maintenance Cost'],
      calculation: 'Prioritize high-value, low-effort items first'
    },
    'Kano Model': {
      description: 'Categorize features by customer satisfaction impact',
      factors: ['Basic Needs', 'Performance Needs', 'Excitement Features', 'Indifferent Features'],
      calculation: 'Focus on Basic → Performance → Excitement'
    }
  };

  const [selectedFramework, setSelectedFramework] = useState('RICE Framework');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="text-indigo-600" />
                PM Command Center
              </h1>
              <p className="text-gray-600 mt-2">Your AI-powered product management assistant</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <Settings className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-1 mt-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'dashboard', label: 'Daily Briefing', icon: Bell },
              { id: 'documentation', label: 'Smart Docs', icon: FileText },
              { id: 'requirements', label: 'Requirements Gen', icon: Lightbulb },
              { id: 'decisions', label: 'Decision Support', icon: Brain },
              { id: 'templates', label: 'Templates', icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Briefing */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Key Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Daily Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{briefingData.metrics.dau.value}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">{briefingData.metrics.dau.change}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{briefingData.metrics.conversion.value}</p>
                  </div>
                  <span className="text-blue-600 text-sm font-medium">{briefingData.metrics.conversion.change}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{briefingData.metrics.churn.value}</p>
                  </div>
                  <span className="text-purple-600 text-sm font-medium">{briefingData.metrics.churn.change}</span>
                </div>
              </div>
            </div>

            {/* Market News */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Market Intelligence
              </h3>
              <div className="space-y-3">
                {briefingData.marketNews.map((news, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{news.title}</h4>
                        <p className="text-xs text-gray-500">{news.source}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        news.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {news.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Updates */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Competitor Intelligence
              </h3>
              
              {/* Setup Form - Show if not completed */}
              {!competitorSetup.isSetupComplete ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 text-sm">Quick Setup Required</h4>
                        <p className="text-xs text-blue-700 mt-1">
                          Help us provide relevant competitor insights by sharing some context about your business.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Organization/Company
                    </label>
                    <input
                      type="text"
                      value={competitorSetup.organization}
                      onChange={(e) => setCompetitorSetup(prev => ({
                        ...prev,
                        organization: e.target.value
                      }))}
                      placeholder="e.g., Acme Bank, StartupXYZ, My Product Team"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={competitorSetup.industry}
                      onChange={(e) => setCompetitorSetup(prev => ({
                        ...prev,
                        industry: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select your industry...</option>
                      <option value="fintech">Fintech & Financial Services</option>
                      <option value="healthcare">Healthcare & MedTech</option>
                      <option value="ecommerce">E-commerce & Retail</option>
                      <option value="saas">SaaS & Software</option>
                      <option value="edtech">Education & EdTech</option>
                      <option value="gaming">Gaming & Entertainment</option>
                      <option value="travel">Travel & Hospitality</option>
                      <option value="logistics">Logistics & Supply Chain</option>
                      <option value="real-estate">Real Estate & PropTech</option>
                      <option value="foodtech">Food & Beverage Tech</option>
                      <option value="automotive">Automotive & Transportation</option>
                      <option value="energy">Energy & CleanTech</option>
                      <option value="media">Media & Content</option>
                      <option value="social">Social & Community</option>
                      <option value="productivity">Productivity & Workplace</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Focus Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Focus Area
                    </label>
                    <input
                      type="text"
                      value={competitorSetup.focusArea}
                      onChange={(e) => setCompetitorSetup(prev => ({
                        ...prev,
                        focusArea: e.target.value
                      }))}
                      placeholder="e.g., Mobile banking apps, B2B analytics dashboard, Consumer marketplace"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be specific about your product area or market segment
                    </p>
                  </div>

                  {/* Competitors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Competitors (Minimum 3)
                    </label>
                    <div className="space-y-2">
                      {competitorSetup.competitors.map((competitor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                          <input
                            type="text"
                            value={competitor}
                            onChange={(e) => {
                              const newCompetitors = [...competitorSetup.competitors];
                              newCompetitors[index] = e.target.value;
                              setCompetitorSetup(prev => ({
                                ...prev,
                                competitors: newCompetitors
                              }));
                            }}
                            placeholder={index === 0 ? "e.g., Chase Mobile, Stripe Dashboard, Amazon" : "Competitor name..."}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          />
                          {index >= 3 && (
                            <button
                              onClick={() => {
                                const newCompetitors = competitorSetup.competitors.filter((_, i) => i !== index);
                                setCompetitorSetup(prev => ({
                                  ...prev,
                                  competitors: newCompetitors
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {competitorSetup.competitors.length < 8 && (
                        <button
                          onClick={() => setCompetitorSetup(prev => ({
                            ...prev,
                            competitors: [...prev.competitors, '']
                          }))}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add another competitor
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Setup Button */}
                  <button
                    onClick={() => {
                      // Validate required fields
                      const isValid = competitorSetup.organization.trim() && 
                                    competitorSetup.industry && 
                                    competitorSetup.focusArea.trim() && 
                                    competitorSetup.competitors.filter(c => c.trim()).length >= 3;
                      
                      if (isValid) {
                        setCompetitorSetup(prev => ({
                          ...prev,
                          isSetupComplete: true
                        }));
                        
                        // Here you would typically save to backend/localStorage
                        console.log('Competitor setup completed:', competitorSetup);
                      } else {
                        alert('Please fill in all required fields and add at least 3 competitors.');
                      }
                    }}
                    disabled={!competitorSetup.organization.trim() || 
                            !competitorSetup.industry || 
                            !competitorSetup.focusArea.trim() || 
                            competitorSetup.competitors.filter(c => c.trim()).length < 3}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Target className="w-4 h-4" />
                    Start Competitor Monitoring
                  </button>
                </div>
              ) : (
                /* Competitor Updates Display - Show after setup */
                <div className="space-y-4">
  {/* Setup Summary */}
  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-green-900 text-sm">
          Monitoring: {competitorSetup.organization}
        </h4>
        <p className="text-xs text-green-700">
          {competitorSetup.industry} • {competitorSetup.focusArea}
        </p>
        <p className="text-xs text-green-600 mt-1">
          Tracking {competitorSetup.competitors.filter(c => c.trim()).length} competitors
          {lastUpdated && (
            <span className="ml-2">• Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={fetchCompetitorData}
          disabled={isLoadingCompetitors}
          className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded"
        >
          {isLoadingCompetitors ? 'Updating...' : 'Refresh'}
        </button>
        <button
          onClick={() => setCompetitorSetup(prev => ({
            ...prev,
            isSetupComplete: false
          }))}
          className="text-green-600 hover:text-green-700 text-xs"
        >
          Edit Setup
        </button>
      </div>
    </div>
  </div>

  {/* Loading State */}
  {isLoadingCompetitors && (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      <span className="ml-2 text-sm text-gray-600">Fetching latest updates...</span>
    </div>
  )}

  {/* Real Competitor Updates */}
  {!isLoadingCompetitors && competitorData.length > 0 && (
    <div className="space-y-3">
      {competitorData.map((competitorInfo, compIndex) => 
        competitorInfo.updates.map((update, updateIndex) => (
          <div key={`${compIndex}-${updateIndex}`} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{competitorInfo.competitor}</h4>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{update.time}</span>
                  {update.source && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{update.source}</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{update.update}</p>
                {update.url && (
                  <a 
                    href={update.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                  >
                    Read more →
                  </a>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                update.impact === 'high' ? 'bg-red-100 text-red-700' : 
                update.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {update.impact}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )}

  {/* Empty State */}
  {!isLoadingCompetitors && competitorData.length === 0 && (
    <div className="text-center py-6">
      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-500">No recent updates found</p>
      <button 
        onClick={fetchCompetitorData}
        className="text-red-600 hover:text-red-700 text-sm mt-2"
      >
        Try refreshing
      </button>
    </div>
  )}

  <button className="w-full mt-4 text-red-600 text-xs sm:text-sm font-medium hover:text-red-700 flex items-center justify-center gap-1">
    View Full Analysis <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
  </button>
</div>
                
              )}
            </div>
          </div>
        )}

        {/* Smart Documentation */}
        {activeTab === 'documentation' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Smart Documentation Generator
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input (Meeting notes, rough ideas, stakeholder requests)
                </label>
                <textarea
                  value={documentationInput}
                  onChange={(e) => setDocumentationInput(e.target.value)}
                  placeholder="Paste your meeting notes or describe your feature idea here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={generateDocumentation}
                  disabled={!documentationInput.trim()}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Generate Polished Document
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Generated PRD
                  </label>
                  {generatedDoc && (
                    <button className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  )}
                </div>
                <div className="h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                  {generatedDoc ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedDoc}</pre>
                  ) : (
                    <p className="text-gray-500 italic">Generated documentation will appear here...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Generator */}
        {activeTab === 'requirements' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              AI-Powered Requirements Generator
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Concept or Stakeholder Request
                </label>
                <textarea
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  placeholder="Describe the feature or functionality you want to build..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={generateRequirements}
                  disabled={!requirementsInput.trim()}
                  className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Generate User Stories & Acceptance Criteria
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Structured Requirements
                  </label>
                  {generatedRequirements && (
                    <button className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Export to Jira
                    </button>
                  )}
                </div>
                <div className="h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                  {generatedRequirements ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedRequirements}</pre>
                  ) : (
                    <p className="text-gray-500 italic">Structured requirements will appear here...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decision Support */}
        {activeTab === 'decisions' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Decision Support Framework
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Prioritization Framework
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(prioritizationFrameworks).map(([name, framework]) => (
                  <div
                    key={name}
                    onClick={() => setSelectedFramework(name)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFramework === name 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
                    <p className="text-sm text-gray-600">{framework.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                {selectedFramework} - Implementation Guide
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Key Factors to Evaluate:</h5>
                  <ul className="space-y-2">
                    {prioritizationFrameworks[selectedFramework].factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Calculation Method:</h5>
                  <div className="p-3 bg-white rounded border text-sm text-gray-700">
                    {prioritizationFrameworks[selectedFramework].calculation}
                  </div>
                </div>
              </div>
              
              <button className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Start New Prioritization Exercise
              </button>
            </div>
          </div>
        )}

        {/* Communication Templates */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-600" />
              Communication Templates
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Template Categories</h4>
                <div className="space-y-2">
                  {Object.keys(communicationTemplates).map(template => (
                    <button
                      key={template}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTemplate === template
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{selectedTemplate}</h4>
                  <button className="text-green-600 text-sm hover:text-green-700 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Copy Template
                  </button>
                </div>
                <div className="h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {communicationTemplates[selectedTemplate]}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PMCommandCenter;
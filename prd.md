# Product Requirements Document: Web Teleprompter

**Version:** 1.0  
**Last Updated:** December 13, 2025  
**Status:** Draft

## 1. Product Overview

### 1.1 Vision

A modern, web-based teleprompter application built with Svelte 5 that
provides professional-grade prompting features with a clean,
distraction-free interface. The product aims to democratize access to
teleprompter functionality for content creators, presenters, and
educators without requiring expensive hardware or software.

### 1.2 Goals

- Provide smooth, jitter-free scrolling at 60fps
- Support both casual content creators and professional use cases
- Minimize setup friction with browser-based deployment
- Offer professional features comparable to paid desktop applications
- Maintain open-source ethos for community contribution

### 1.3 Non-Goals

- Native mobile apps (web-first, mobile-responsive)
- Integration with professional hardware teleprompters (Phase 1)
- Multi-user collaboration features (Phase 1)
- Cloud sync across devices (Phase 1)

## 2. Target Users

### Primary Personas

**The Content Creator**

- Creates YouTube videos, tutorials, or social media content
- Records at home or in small studio setups
- Needs reliable prompting without expensive equipment
- Values speed controls and easy script editing

**The Presenter**

- Gives virtual presentations, webinars, or online courses
- Needs to maintain eye contact with camera during video calls
- Requires transparency mode to see meeting participants
- Values professional appearance and smooth delivery

**The Educator**

- Records lecture content or instructional videos
- Needs to refer to detailed scripts or outlines
- May need to jump between sections frequently
- Values marker navigation and time estimates

## 3. Core Features (MVP)

### 3.1 Script Management

**Script Editor**

- Plain text editing interface
- Auto-save to browser localStorage
- Import from .txt, .docx, .pdf files
- Export scripts to text format
- Character and word count display

**Script Organization**

- List view of saved scripts
- Search/filter scripts by name
- Duplicate and delete scripts
- Last modified timestamps

### 3.2 Display & Scrolling

**Scroll Control**

- Manual scroll speed adjustment (1-10 scale)
- Start/pause/reset controls
- Smooth, frame-rate independent scrolling
- Timer-based scrolling (set script duration, auto-calculate speed)
- Keyboard shortcuts for speed control (arrow keys)

**Visual Customization**

- Font size adjustment (24px - 96px range)
- Font family selection
- Text color customization
- Background color customization
- Line height adjustment
- Text alignment (left, center, right)

**Reading Aids**

- Optional reading guide (line/arrow overlay)
- Guide position control (top, center, bottom third)
- Guide color and opacity customization
- Margin controls for narrowing text width

### 3.3 Advanced Controls

**Mirroring & Orientation**

- Horizontal flip (for beam splitter glass)
- Vertical flip
- Reset to default orientation

**Remote Control Support**

- Keyboard shortcuts (spacebar play/pause, arrows for speed/font)
- Custom keyboard mapping
- Documentation for supported shortcuts

### 3.4 Presentation Mode

**Fullscreen Display**

- Distraction-free prompting view
- Hide UI controls (keyboard shortcuts still active)
- Floating minimal control panel (optional)
- ESC to exit presentation mode

**Progress Indicators**

- Elapsed time display
- Remaining time estimate (based on scroll speed)
- Progress bar
- Word/character position indicator

### 3.5 Navigation

**Script Markers**

- Add H2-style markers in script (e.g., ## Section Name)
- Jump to marker via sidebar
- Marker list in edit mode
- Quick navigation during playback

## 4. Nice-to-Have Features (Post-MVP)

### 4.1 Enhanced Editing

- Rich text formatting (bold, italic, color highlights)
- Markdown rendering support
- Find and replace
- Multi-script tabs

### 4.2 Advanced Playback

- Voice-activated scrolling
- Teleprompter hardware integration
- Multi-monitor support
- Picture-in-picture video recording

### 4.3 Collaboration & Sync

- Cloud storage integration (Google Drive, Dropbox)
- Multi-device sync
- Share scripts via URL
- Team/organization accounts

### 4.4 Analytics & Improvement

- Practice mode with recording
- Speech pace analysis
- Readability scoring
- Session history

### 4.5 Accessibility

- Screen reader support
- High contrast themes
- Keyboard-only navigation
- Custom color schemes for visual impairments

## 5. Technical Requirements

### 5.1 Technology Stack

- **Framework:** Svelte 5 with runes
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Storage:** Browser localStorage (IndexedDB for larger scripts)
- **Deployment:** Static hosting (Netlify, Vercel, Cloudflare Pages,
  or Coolify)

### 5.2 Performance Targets

- Initial load: < 2 seconds
- Scroll frame rate: 60fps minimum
- Time to interactive: < 1 second
- Bundle size: < 200KB (gzipped)

### 5.3 Browser Support

- Chrome 100+ (primary)
- Firefox 100+
- Safari 15+
- Edge 100+

### 5.4 Responsive Design

- Desktop-first (1920x1080 primary)
- Tablet support (768px+)
- Mobile fallback (basic editing, no prompting)

## 6. User Experience

### 6.1 Key Flows

**First-Time User**

1. Land on app with default script
2. See "Edit Script" and "Start Prompting" buttons
3. Click "Start Prompting" → immediate demo experience
4. Edit button returns to editor

**Returning User**

1. See list of saved scripts
2. Click script to load
3. Edit or present

**During Presentation**

1. Enter presentation mode
2. Use keyboard to control speed and playback
3. ESC to exit and return to editor

### 6.2 Design Principles

- **Minimal by default:** Settings tucked away, clean prompting
  surface
- **Keyboard-first:** All critical functions accessible via shortcuts
- **Progressive disclosure:** Advanced features available but not
  overwhelming
- **Professional aesthetic:** Dark theme by default, clean typography

## 7. Success Metrics

### 7.1 Adoption Metrics

- Monthly active users
- Scripts created per user
- Session duration
- Repeat usage rate

### 7.2 Performance Metrics

- Page load time
- Scroll smoothness (frame drops)
- Error rates
- Browser compatibility issues

### 7.3 Engagement Metrics

- Feature usage breakdown
- Most common font sizes/speeds
- Average script length
- Presentation mode duration

## 8. Open Questions

- Should we support multiple scripts open in tabs?
- How do we handle very long scripts (10,000+ words)?
- Should there be default themes/presets?
- Do we need a tutorial/onboarding flow?
- Should we support foot pedal/Bluetooth clicker integration in MVP?

## 9. Timeline & Phases

### Phase 1: MVP (4-6 weeks)

- Core script editing
- Basic playback controls
- Font/speed customization
- Keyboard shortcuts
- localStorage persistence

### Phase 2: Enhancement (2-3 weeks)

- Mirroring/transparency
- Timer-based scrolling
- Markers and navigation
- Reading guide overlay
- Import/export

### Phase 3: Polish (2 weeks)

- Presentation mode
- Progress indicators
- Responsive design
- Documentation

### Phase 4: Advanced Features (TBD)

- Voice activation
- Cloud sync
- Hardware integration
- Analytics

## 10. Dependencies & Risks

### Dependencies

- Browser File API for imports
- localStorage/IndexedDB availability
- Smooth CSS transforms and requestAnimationFrame support

### Risks

- Browser inconsistencies in scrolling performance
- Mobile browsers may limit fullscreen API
- localStorage quota limits for large scripts
- Third-party library bloat affecting bundle size

### Mitigations

- Progressive enhancement for features
- Feature detection and graceful degradation
- Clear browser support documentation
- Regular performance audits

## 11. Appendix

### 11.1 Competitive Analysis

- **QPrompt:** Desktop app, feature-rich but requires installation
- **CuePrompter:** Simple web-based, lacks advanced features
- **Teleprompter.com:** Polished but paid subscription model
- **Imaginary Teleprompter:** Web-based but dated UI/UX

### 11.2 Differentiators

- Modern tech stack (Svelte 5)
- Open source
- No installation required
- Keyboard-first design
- Free with no paywalls

### 11.3 References

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
  for voice activation
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)

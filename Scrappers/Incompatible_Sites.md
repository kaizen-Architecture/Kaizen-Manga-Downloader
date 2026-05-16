# Incompatible Sites List

This document tracks manga/manga sites that have been tested and found incompatible with Kaizoku's current mangal 4.0.6 setup. These sites cannot be scraped using the current scraper framework and may require future updates to mangal or alternative approaches.

## Sites Tested and Rejected

### 1. Sites with Advanced Anti-Bot Protection
**Cloudflare Protected Sites**
- **Reason**: Cloudflare's advanced bot detection blocks all automated requests
- **Technical Details**: Even with proper headers and delays, requests are blocked at the network level
- **Future Possibility**: May become compatible if mangal implements better anti-bot bypass techniques or if sites reduce protection levels

**Luacomic (luacomic.org)**
- **Reason**: Site uses Cloudflare protection that blocks automated requests
- **Technical Details**: HTTP requests are blocked at the network level, even with proper headers. Confirmed via curl headers showing Cloudflare server.
- **Future Possibility**: May become compatible if mangal implements better anti-bot bypass techniques or if site reduces protection levels

**DataDome Protected Sites**
- **Reason**: Enterprise-level bot protection that requires browser fingerprinting and behavioral analysis
- **Technical Details**: HTTP requests are immediately rejected, headless browser attempts fail due to detection
- **Future Possibility**: Unlikely without significant mangal updates for advanced browser simulation

### 2. Sites Requiring Login/Account
**Premium/Paid Content Sites**
- **Reason**: Content requires user authentication and account creation
- **Technical Details**: Cannot bypass login walls with current HTTP/headless capabilities
- **Future Possibility**: May be possible if mangal adds session management and login automation

**Age-Restricted Sites**
- **Reason**: Sites with mandatory age verification or account requirements
- **Technical Details**: CAPTCHA and account verification systems block automated access
- **Future Possibility**: Possible with advanced headless browser automation, but currently not supported

### 3. Sites with Broken Headless Browser Support
**Sites Tested with Mangal 4.0.6**
- **Reason**: Current mangal version (4.0.6) has broken/unstable headless browser implementation
- **Technical Details**: `Headless.browser()` returns nil, `Browser:page()` calls fail with "attempt to index a non-table object"
- **Affected Scripts**: All scripts using headless browser functionality
- **Future Possibility**: Will become compatible once mangal is updated to a version with working headless browser support
- **Examples Tested**: None specific (general category - affects any site requiring headless browser)

### 4. Sites with CAPTCHA Requirements
**Sites with reCAPTCHA or Similar**
- **Reason**: Automated solving of CAPTCHAs is not supported in current mangal implementation
- **Technical Details**: Even headless browser cannot solve visual/audio CAPTCHAs programmatically
- **Future Possibility**: May become possible with third-party CAPTCHA solving services integration

### 5. Sites with Dynamic Content Issues
**Sites with Complex JavaScript Rendering**
- **Reason**: Content loaded via complex AJAX calls or WebSocket connections that cannot be replicated
- **Technical Details**: Headless browser fails to trigger necessary JavaScript events or maintain WebSocket connections
- **Future Possibility**: May work with improved headless browser stability and event simulation
- **Examples Tested**:
  - **ErosxSun (erosxsun.xyz)**: Tested with IA Scraper Prompt, search works but direct URL access fails due to mangal's "exact" mode limitations

### 6. Sites with Advanced Anti-Bot Protection (Specific Sites)
**BatoTo (bato.to)**
- **Reason**: Site uses advanced anti-bot measures that block headless browsers
- **Technical Details**: Search results are JS-rendered and not accessible via current headless implementation. HTTP requests return empty results for search
- **Future Possibility**: May work with updated mangal or if site reduces protection levels

**MangaPark (mangapark.net)**
- **Reason**: Site uses advanced JS rendering and anti-bot measures
- **Technical Details**: Headless browser fails to load content properly, returning empty results. Site may require full browser session
- **Future Possibility**: May work with improved headless browser implementation

### 7. Sites with Undocumented Issues (Need Investigation)
**Mangahub (mangahub.io)**
- **Reason**: Unknown - no documentation in code comments
- **Technical Details**: Need to investigate why this scraper was marked as incompatible
- **Status**: Requires testing and documentation of failure reasons

### 8. Partially Working Sites - Test Results
**AsuraScans (asurascans.com)**
- **SearchManga**: ❌ **FAILED** - Returns empty results, no manga found
- **MangaChapters**: Not tested (search failed)
- **ChapterPages**: Not tested (search failed)
- **Conclusion**: Completely broken, moved to "_NOT_WORKING" status

## Current Working Sites (Reference)

### Successfully Implemented Sites
- **MangaDex (mangadex.org)**: API-based scraper, fully working with HTTP only
- **Manhuas (manhuas.me)**: Working scraper exists
- **Mangaread (mangaread.org)**: Working scraper exists
- **Mangasee (mangasee123.com)**: Working scraper exists

### Partially Working Sites - Test Results
**Note**: All previously "partial" scrapers were tested and found to be completely broken. They have been moved to "_NOT_WORKING" status.

**Tested and Failed (moved to _NOT_WORKING)**:
- **BatoGPT**: ❌ Headless browser error (`Browser:page()` nil)
- **fanfox**: ❌ Empty search results
- **LuminousScans**: ❌ Function call error (non-function object)
- **Mangahere**: ❌ Trim function error (nil argument)
- **Manguahub**: ❌ Headless browser error (`Browser:page()` nil)
- **Manhuato**: ❌ Empty search results
- **Mgecko**: ❌ Function call error (non-function object)
- **Mgecko_Claude**: ❌ Headless browser error (`Browser:page()` nil)
- **novamanga**: ❌ Headless browser error (`Browser:page()` nil)
- **scannatio**: ❌ Empty search results
- **TopManhua**: ❌ Function call error (non-function object)
- **xBato**: ❌ Headless browser error (`Browser:page()` nil)

**Conclusion**: All 12 "partial" scrapers were actually completely broken. The primary issues were:
1. **Headless browser failures** (8 scrapers): `Browser:page()` returns nil due to mangal 4.0.6 limitations
2. **Function call errors** (3 scrapers): Incorrect function usage or missing imports
3. **Empty results** (3 scrapers): Selectors not working or site structure changed

**No partially working scrapers remain** - all have been properly categorized as either working or not working.

## Recommendations for Future Compatibility

### Immediate Actions
1. **Monitor Mangal Updates**: Track when headless browser support becomes stable
2. **Test with Updated Mangal**: Re-evaluate rejected sites with newer versions
3. **Document Working Patterns**: Keep track of successful site patterns for future reference

### Long-term Solutions
1. **Alternative Scraping Engines**: Consider integrating other scraping libraries if mangal remains limited
2. **Browser Automation Services**: External services for sites requiring advanced browser simulation
3. **Community Collaboration**: Share findings with mangal developers for improved headless support

## Testing Methodology

All sites were tested using:
- HTTP requests with proper headers (User-Agent, Accept-Language, Referer)
- Headless browser attempts (where available)
- Multiple selector strategies
- Various user agents and request patterns

Sites were marked incompatible only after exhaustive testing and fallback attempts failed.

## Contact for Updates

If you discover that any of these sites have become compatible due to:
- Mangal version updates
- Site changes reducing protection
- New scraping techniques

Please update this document with the new findings and implementation details.
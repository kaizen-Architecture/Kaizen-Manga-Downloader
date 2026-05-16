# Enhanced Lua Scraper Generator for Mangal 4.0.6/Kaizoku

## Overview
This enhanced prompt incorporates findings from analyzing existing Kaizoku scrapers to provide clearer guidance, better patterns, and improved best practices for creating robust Lua scrapers.

## Key Improvements Based on Analysis

### 1. **HTTP-First Principle** (Critical Enhancement)
**BEFORE**: "Try headless first, fallback to HTTP if headless fails"
**AFTER**: "HTTP first, headless fallback for dynamic content only"

**Rationale**: Analysis showed that Manhuas scraper (⭐⭐⭐⭐⭐) uses HTTP for search and headless only for dynamic content, while Mangasee (⭐⭐) uses headless everywhere. HTTP-first approach is more reliable and performant.

### 2. **Comprehensive Anti-Bot Headers** (New Requirement)
**ADDITION**: Standardized header implementation for all HTTP requests:

```lua
local request = Http.request("GET", url)
request:set_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
request:set_header("Accept-Language", "en-US,en;q=0.9")
request:set_header("Referer", Base)
local result = Client:do_request(request)
```

**Rationale**: MangaDex and Manhuas consistently use headers, while Mangasee omits them entirely.

### 3. **Balanced Technology Usage** (Enhanced Guidance)
**NEW SECTION**: Technology Selection Guidelines

- **SearchManga**: Always use HTTP (static content)
- **MangaChapters**: Try HTTP first, headless fallback if AJAX-loaded
- **ChapterPages**: HTTP first, headless fallback if images are lazy-loaded/JS-rendered

**Rationale**: Prevents over-reliance on unstable headless browser.

### 4. **Selector Fallback Strategy** (Refined)
**BEFORE**: Generic fallback approach
**AFTER**: Tiered fallback system:

1. **Primary selectors**: Site-specific, most reliable
2. **Secondary selectors**: Alternative patterns for same elements
3. **Universal fallbacks**: Generic selectors as last resort

**Rationale**: Mangaread uses excessive fallbacks, Manhuas uses minimal but effective ones.

### 5. **Helper Function Standardization** (New)
**ADDITION**: Consistent helper function definitions:

```lua
-- Global helper (recommended for consistency)
function Reverse(t)
    local n = #t
    local i = 1
    while i < n do
        t[i], t[n] = t[n], t[i]
        i = i + 1
        n = n - 1
    end
end
```

**Rationale**: Inconsistent implementation across existing scrapers.

## Enhanced Prompt Structure

### 1. 🔍 Exploration and Verification

**MANDATORY: Technology Assessment**
- **Test HTTP first**: Use curl/browser dev tools to check if content loads without JS
- **Identify dynamic content**: Note which pages require JavaScript
- **Assess anti-bot**: Check for Cloudflare, DataDome, or advanced protection

**APPROACH SELECTION**:
- **STATIC SITES**: HTTP-only approach (like MangaDex API)
- **DYNAMIC SITES**: HTTP-first with selective headless fallback (like Manhuas)
- **HEAVILY JS SITES**: Comprehensive headless with HTTP fallbacks (like Mangaread)

**CRITICAL: Step-by-Step Execution Guarantee**
- **ALWAYS** start by confirming the current active task and website being worked on
- **NEVER** switch tasks or websites without explicit user confirmation
- **DOCUMENT** all explorations and findings immediately to avoid confusion
- **USE CURL FOR EXPLORATION**: Always use `curl -s "URL" > Scrappers/Temporal/filename.html` to fetch HTML content for analysis
- **VERIFY SELECTORS**: Test selectors on fetched HTML before implementing
- **MAINTAIN CONTEXT**: Keep track of current project and reject attempts to work on incompatible or previously rejected sites

### 2. 📦 Output Structure (Enhanced)

**Function Return Specifications**:
- `SearchManga()`: `[{name, url, [author], [genres], [summary]}]`
- `MangaChapters()`: `[{name, url, [volume]}]` - ordered oldest to newest
- `ChapterPages()`: `[{index, url}]` - index starts at 1

**Error Handling Requirements**:
- Never return nil - return empty tables instead
- Validate all extracted data
- Graceful fallbacks when selectors fail

### 3. ⚙️ Technical Standards (Enhanced)

**Import Guidelines**:
```lua
-- Stable imports (always available)
Html = require("html")
Http = require("http")
HttpUtil = require("http_util")
Strings = require("strings")

-- Unstable imports (use with fallbacks)
Headless = require("headless")  -- 4.0.6: unstable
Time = require("time")          -- 4.0.6: unstable
```

**Variable Standards**:
```lua
Client = Http.client()
Browser = Headless.browser()    -- Initialize only if needed
Base = "https://example.com"
Delay = 1                       -- For headless operations
```

### 4. 🛡️ Anti-Bot Measures (Comprehensive)

**HTTP Request Headers** (Required for all requests):
```lua
request:set_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
request:set_header("Accept-Language", "en-US,en;q=0.9")
request:set_header("Referer", Base)
```

**Headless Browser Usage**:
- Initialize browser only when needed
- Use appropriate delays: `Time.sleep(Delay)`
- Implement proper wait strategies

### 5. 🔄 Recommended Workflow

**Step-by-Step Process**:

1. **Version Check**: Confirm Mangal 4.0.6
2. **Site Assessment**: Test HTTP vs headless requirements
3. **Selector Discovery**: Document primary and fallback selectors
4. **Implementation**: HTTP-first with selective headless
5. **Testing**: Verify with 3 different manga
6. **Optimization**: Refine selectors and add fallbacks
7. **Documentation**: Comment selector sources and verification

### 6. 📋 Best Practices from Analysis

**DO**:
- Use HTTP for static content (search, chapters when possible)
- Implement comprehensive headers on all requests
- Provide meaningful fallback selectors
- Document selector discovery process
- Test with multiple manga from different genres

**DON'T**:
- Use headless browser for everything (Mangasee anti-pattern)
- Skip HTTP fallbacks for dynamic content
- Omit anti-bot headers
- Create over-complex fallback systems
- Forget to handle relative URLs properly

### 7. 🧪 Testing and Verification

**Required Test Commands**:
```bash
# First, copy the scraper to your local mangal sources folder
# On Windows: copy ScriptName.lua "%APPDATA%\mangal\sources\"
# On Linux/Mac: cp ScriptName.lua ~/.config/mangal/sources/

# Search test
mangal inline --source ScriptName --query "popular manga" --manga 1 --json > Scrappers/Temporal/output_search.json

# Chapters test
mangal inline --source ScriptName --query "Manga Title" --manga exact --chapters all --json > Scrappers/Temporal/output_chapters.json

# Verify JSON outputs contain correct data structure
```

**CRITICAL: Context Maintenance Rules**
- **ALWAYS** verify current task before any action
- **REJECT** attempts to work on wrong websites
- **DOCUMENT** all findings and explorations immediately
- **USE CURL** for HTML fetching: `curl -s "URL" > Scrappers/Temporal/filename.html`
- **TEST SELECTORS** on fetched HTML before implementation
- **MAINTAIN FOCUS** on single task/website at a time
- **CONFIRM USER INTENT** before switching tasks or websites

**Compatibility Checklist**:
- [ ] HTTP requests work without headless
- [ ] Headless fallbacks functional
- [ ] All selectors extract correct data
- [ ] Error handling prevents crashes
- [ ] Relative URLs properly resolved

## Template Implementation

### SearchManga (HTTP-Only)
```lua
function SearchManga(query)
    local url = Base .. "/search?q=" .. HttpUtil.query_escape(query)
    local request = Http.request("GET", url)
    request:set_header("User-Agent", "Mozilla/5.0...")
    request:set_header("Accept-Language", "en-US,en;q=0.9")
    request:set_header("Referer", Base)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local mangas = {}
    -- Primary selector
    doc:find(".manga-item"):each(function(i, el)
        -- Extract data with validation
    end)
    return mangas
end
```

### MangaChapters (HTTP with Headless Fallback)
```lua
function MangaChapters(mangaURL)
    -- Try HTTP first
    local request = Http.request("GET", mangaURL)
    request:set_header("User-Agent", "Mozilla/5.0...")
    -- ... other headers
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local chapters = {}
    doc:find(".chapter-link"):each(function(i, el)
        -- Extract chapters
    end)

    -- If no chapters found, try headless fallback
    if #chapters == 0 then
        local page = Browser:page()
        page:navigate(mangaURL)
        Time.sleep(Delay)
        page:waitLoad()
        doc = Html.parse(page:html())
        -- Extract with headless selectors
    end

    Reverse(chapters) -- Ensure oldest first
    return chapters
end
```

### ChapterPages (HTTP with Headless Fallback)
```lua
function ChapterPages(chapterURL)
    -- Try HTTP first
    local request = Http.request("GET", chapterURL)
    -- ... headers
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local pages = {}
    doc:find("img.page-image"):each(function(i, img)
        -- Extract images
    end)

    -- Headless fallback if needed
    if #pages == 0 then
        local page = Browser:page()
        page:navigate(chapterURL)
        Time.sleep(Delay)
        page:waitLoad()
        doc = Html.parse(page:html())
        -- Extract with headless selectors
    end

    return pages
end
```

## Known Incompatible Sites

**IMPORTANT**: Before attempting to create a scraper for any site, check the `Incompatible_Sites.md` file in this directory. This document contains a comprehensive list of sites that have been tested and found incompatible with the current Kaizoku/mangal 4.0.6 setup.

### Quick Compatibility Check
- ❌ **Reject Immediately**: Sites with Cloudflare, DataDome, or advanced anti-bot protection
- ❌ **Reject Immediately**: Sites requiring login/account creation
- ❌ **Reject Immediately**: Sites with CAPTCHA requirements
- ⚠️ **Test Carefully**: Sites with heavy JavaScript - may work with updated mangal versions
- ✅ **Likely Compatible**: Sites with static HTML content or simple AJAX

### Key Incompatibility Categories
1. **Anti-Bot Protection**: Cloudflare, DataDome, etc. block automated requests
2. **Authentication Required**: Sites needing login/account verification
3. **Broken Headless Support**: Current mangal 4.0.6 has unstable headless browser implementation
4. **CAPTCHA Systems**: Automated solving not supported
5. **Complex JavaScript**: Dynamic content that cannot be properly rendered

**Reference**: See `Incompatible_Sites.md` for detailed analysis of tested sites and future compatibility possibilities.

## Conclusion

This enhanced prompt addresses inconsistencies found in existing scrapers by:

1. **Enforcing HTTP-first approach** for reliability and performance
2. **Standardizing anti-bot measures** across all implementations
3. **Providing clear technology selection guidelines**
4. **Establishing fallback best practices**
5. **Including comprehensive testing procedures**
6. **Adding compatibility awareness** to prevent wasted development time

The result is a more robust, maintainable, and consistent scraper development process that leverages the best patterns observed in working Kaizoku scrapers while avoiding the pitfalls found in less optimal implementations.
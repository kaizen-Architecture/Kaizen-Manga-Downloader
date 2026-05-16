--------------------------------------
-- @name    Mangaread
-- @url     https://www.mangaread.org
-- @author  AI Assistant & User (Updated for Mangal Compatibility)
-- @license MIT
--------------------------------------

----- IMPORTS -----
Html = require("html")
Http = require("http")
HttpUtil = require("http_util")
Headless = require("headless")  -- Enabled for potential lazy loading
Time = require("time")          -- For delays
--- END IMPORTS ---

----- VARIABLES -----
Client = Http.client()
Browser = Headless.browser()    -- Enabled for dynamic content
Base = "https://www.mangaread.org"
Delay = 1 -- seconds
--- END VARIABLES ---

----- MAIN -----

--- Searches for manga with given query.
-- @param query Query to search for
-- @return Table of tables with the following fields: name, url
function SearchManga(query)
    local url = Base .. "/?s=" .. HttpUtil.query_escape(query) .. "&post_type=wp-manga"
    local request = Http.request("GET", url)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)
    
    local mangas = {}
    doc:find(".c-tabs-item__content"):each(function(i, r)
        local titleElement = r:find("h3.h4 a"):first() or r:find("h4 a"):first() or r:find(".post-title a"):first()
        if titleElement then
            local href = titleElement:attr("href")
            if href and not href:find("http") then href = Base .. href end
            mangas[i+1] = { name = titleElement:text():gsub("^%s*(.-)%s*$", "%1"), url = href }
        end
    end)
    
    return mangas
end

--- Gets the list of all manga chapters.
-- @param mangaURL URL of the manga
-- @return Table of tables with the following fields: name, url
function MangaChapters(mangaURL)
    local request = Http.request("GET", mangaURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)
    
    local chapters = {}
    doc:find(".wp-manga-chapter a"):each(function(i, s)
        local href = s:attr("href")
        if href and not href:find("http") then href = Base .. href end
        chapters[i+1] = { name = s:text():gsub("^%s*(.-)%s*$", "%1"), url = href }
    end)
    
    Reverse(chapters)
    return chapters
end

--- Gets the list of all pages of a chapter.
-- @param chapterURL URL of the chapter
-- @return Table of tables with the following fields: url, index
function ChapterPages(chapterURL)
    -- Use Headless browser for dynamic content
    local page = Browser:page()
    page:navigate(chapterURL)
    Time.sleep(Delay)
    page:waitLoad()

    local doc = Html.parse(page:html())

    local pages = {}
    -- Primary selector for Mangaread (list style)
    doc:find(".wp-manga-chapter-img"):each(function(i, s)
        local src = s:attr("src")
        if src and not src:find("loading") then
            src = src:gsub("^%s*(.-)%s*$", "%1")
            if not src:find("http") then
                if src:sub(1,2) == "//" then src = "https:" .. src
                elseif src:sub(1,1) == "/" then src = Base .. src
                else src = Base .. "/" .. src end
            end
            pages[i+1] = { index = i+1, url = src }
        end
    end)
    -- Handle paged style: Extract from chapter_preloaded_images script
    if #pages == 0 then
        local script = doc:find("#chapter_preloaded_images"):first()
        if script then
            local scriptText = script:text()
            -- Extract the array from var chapter_preloaded_images = [...]
            local imagesStr = scriptText:match('chapter_preloaded_images%s*=%s*(%[.-%])')
            if imagesStr then
                -- Parse the JSON-like array (simple string splitting)
                imagesStr = imagesStr:gsub('^%[', ''):gsub('%]$', ''):gsub('"', '')
                for url in imagesStr:gmatch('([^,]+)') do
                    url = url:gsub('^%s*(.-)%s*$', '%1')
                    if url ~= "" then
                        table.insert(pages, { index = #pages + 1, url = url })
                    end
                end
            end
        end
    end
    -- Fallback selectors for universality (in case structure varies)
    if #pages == 0 then
        doc:find(".page-break img"):each(function(i, s)
            local src = s:attr("src") or s:attr("data-src") or s:attr("data-lazy-src")
            if src and not src:find("loading") then
                src = src:gsub("^%s*(.-)%s*$", "%1")
                if not src:find("http") then
                    if src:sub(1,2) == "//" then src = "https:" .. src
                    elseif src:sub(1,1) == "/" then src = Base .. src
                    else src = Base .. "/" .. src end
                end
                pages[i+1] = { index = i+1, url = src }
            end
        end)
    end
    if #pages == 0 then
        doc:find(".reading-content img"):each(function(i, s)
            local src = s:attr("src") or s:attr("data-src") or s:attr("data-lazy-src")
            if src and not src:find("loading") then
                src = src:gsub("^%s*(.-)%s*$", "%1")
                if not src:find("http") then
                    if src:sub(1,2) == "//" then src = "https:" .. src
                    elseif src:sub(1,1) == "/" then src = Base .. src
                    else src = Base .. "/" .. src end
                end
                pages[i+1] = { index = i+1, url = src }
            end
        end)
    end
    -- Additional fallbacks for other sites
    if #pages == 0 then
        doc:find("#readerarea img"):each(function(i, s)
            local src = s:attr("src") or s:attr("data-src") or s:attr("data-lazy-src")
            if src and not src:find("loading") then
                src = src:gsub("^%s*(.-)%s*$", "%1")
                if not src:find("http") then
                    if src:sub(1,2) == "//" then src = "https:" .. src
                    elseif src:sub(1,1) == "/" then src = Base .. src
                    else src = Base .. "/" .. src end
                end
                pages[i+1] = { index = i+1, url = src }
            end
        end)
    end
    if #pages == 0 then
        doc:find(".text-left img"):each(function(i, s)
            local src = s:attr("src") or s:attr("data-src") or s:attr("data-lazy-src")
            if src and not src:find("loading") then
                src = src:gsub("^%s*(.-)%s*$", "%1")
                if not src:find("http") then
                    if src:sub(1,2) == "//" then src = "https:" .. src
                    elseif src:sub(1,1) == "/" then src = Base .. src
                    else src = Base .. "/" .. src end
                end
                pages[i+1] = { index = i+1, url = src }
            end
        end)
    end

    return pages
end

--- END MAIN ---

----- HELPERS -----
function Reverse(t)
    local n = #t
    local i = 1
    while i < n do
        t[i], t[n] = t[n], t[i]
        i = i + 1
        n = n - 1
    end
end
--- END HELPERS ---
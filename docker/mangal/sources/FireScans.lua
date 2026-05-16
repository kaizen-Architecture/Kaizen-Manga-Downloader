--------------------------------------
-- @name FireScans
-- @url https://firescans.xyz
-- @author Enhanced for Kaizoku using HTTP-first approach
-- @license MIT
--------------------------------------

----- IMPORTS -----
-- Stable imports (always available in Mangal 4.0.6)
Html = require("html")
Http = require("http")
HttpUtil = require("http_util")
--- END IMPORTS ---

----- VARIABLES -----
Client = Http.client()
Base = "https://firescans.xyz"
--- END VARIABLES ---

----- MAIN -----

--- Searches for manga with given query.
-- Uses HTTP-only approach as search results are static content.
-- @param query Query to search for
-- @return Table of tables with the following fields: name, url
function SearchManga(query)
    local url = Base .. "/?s=" .. HttpUtil.query_escape(query) .. "&post_type=wp-manga"
    local request = Http.request("GET", url)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local mangas = {}

    -- Primary selector: FireScans search results
    doc:find(".c-tabs-item__content"):each(function(i, r)
        local titleElement = r:find("h3.h4 a"):first()
        if titleElement then
            local href = titleElement:attr("href")
            if href and not href:find("http") then href = Base .. href end
            mangas[i+1] = { name = titleElement:text():gsub("^%s*(.-)%s*$", "%1"), url = href }
        end
    end)

    -- Secondary fallback selector (alternative structure)
    if #mangas == 0 then
        doc:find(".post-title"):each(function(i, r)
            local titleElement = r:find("h3 a"):first() or r:find("a"):first()
            if titleElement then
                local href = titleElement:attr("href")
                if href and not href:find("http") then href = Base .. href end
                mangas[i+1] = { name = titleElement:text():gsub("^%s*(.-)%s*$", "%1"), url = href }
            end
        end)
    end

    return mangas
end

--- Gets the list of all manga chapters.
-- HTTP-only approach for FireScans (chapters load without JavaScript).
-- @param mangaURL URL of the manga
-- @return Table of tables with the following fields: name, url
function MangaChapters(mangaURL)
    local request = Http.request("GET", mangaURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local chapters = {}

    -- Primary selector: FireScans chapter links
    doc:find(".wp-manga-chapter a"):each(function(i, s)
        local href = s:attr("href")
        if href and not href:find("http") then href = Base .. href end
        chapters[i+1] = { name = s:text():gsub("^%s*(.-)%s*$", "%1"), url = href }
    end)

    Reverse(chapters)
    return chapters
end

--- Gets the list of all pages of a chapter.
-- HTTP-only approach for FireScans (images load without JavaScript).
-- @param chapterURL URL of the chapter
-- @return Table of tables with the following fields: index, url
function ChapterPages(chapterURL)
    local request = Http.request("GET", chapterURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local pages = {}

    -- Primary selector: FireScans chapter images
    doc:find(".wp-manga-chapter-img"):each(function(i, s)
        local src = s:attr("src") or s:attr("data-src")
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

    -- Fallback selector for alternative image structures
    if #pages == 0 then
        doc:find("img"):each(function(i, s)
            local src = s:attr("src") or s:attr("data-src")
            if src and not src:find("loading") and not src:find("logo") and not src:find("icon") then
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
--------------------------------------
-- @name MGEKO
-- @url https://www.mgeko.cc
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
Base = "https://www.mgeko.cc"
--- END VARIABLES ---

----- MAIN -----

--- Searches for manga with given query.
-- Uses HTTP-only approach as search results are static content.
-- @param query Query to search for
-- @return Table of tables with the following fields: name, url
function SearchManga(query)
    -- Note: This site requires CSRF token for search. Token is session-specific and may expire.
    -- For production use, would need to fetch fresh token from search page.
    local csrf_token = "v5ZsOx8aE21PGdq5CKrsSzJtqLiWpYBUugKaEK390hDpDFixHZNNsDLgiTZddPhV"
    local url = Base .. "/search/?csrfmiddlewaretoken=" .. csrf_token .. "&inputContent=" .. HttpUtil.query_escape(query)
    local request = Http.request("GET", url)
    request:set_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    request:set_header("Referer", Base)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local mangas = {}

    -- Primary selector: MGEKO search results
    doc:find(".novel-list.grid .novel-item"):each(function(i, r)
        local titleElement = r:find("a"):first()
        if titleElement then
            local href = titleElement:attr("href")
            local title = r:find(".novel-title.text2row"):text()
            if href and title and title ~= "" then
                if not href:find("http") then href = Base .. href end
                mangas[#mangas+1] = { name = title:gsub("^%s*(.-)%s*$", "%1"), url = href }
            end
        end
    end)

    -- Fallback selector for alternative structures
    if #mangas == 0 then
        doc:find("a[href*='/manga/']"):each(function(i, r)
            local href = r:attr("href")
            local title = r:text()
            if href and title and title ~= "" and not title:find("Chapter") then
                if not href:find("http") then href = Base .. href end
                mangas[#mangas+1] = { name = title:gsub("^%s*(.-)%s*$", "%1"), url = href }
            end
        end)
    end

    return mangas
end

--- Gets the list of all manga chapters.
-- HTTP-only approach for MGEKO (chapters load without JavaScript).
-- @param mangaURL URL of the manga
-- @return Table of tables with the following fields: name, url
function MangaChapters(mangaURL)
    local request = Http.request("GET", mangaURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local chapters = {}

    -- Primary selector: MGEKO chapter links
    doc:find(".chapter-list .chapter-list-item a[href*='/reader/en/']"):each(function(i, s)
        local href = s:attr("href")
        local name = s:find(".chapter-number"):text()
        if href and name and name ~= "" then
            -- Extract just the chapter number part
            name = name:match("([^\n]+)")
            if name then
                name = name:gsub("^%s*(.-)%s*$", "%1")
                if not href:find("http") then href = Base .. href end
                chapters[i+1] = { name = name, url = href }
            end
        end
    end)

    Reverse(chapters)
    return chapters
end

--- Gets the list of all pages of a chapter.
-- HTTP-only approach for MGEKO (images load without JavaScript).
-- @param chapterURL URL of the chapter
-- @return Table of tables with the following fields: index, url
function ChapterPages(chapterURL)
    local request = Http.request("GET", chapterURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local pages = {}

    -- Primary selector: MGEKO chapter images
    doc:find("img[src*='imgsrv4.com/mg2/cdn_mangaraw']"):each(function(i, s)
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

    -- Fallback selector for alternative image structures
    if #pages == 0 then
        doc:find("#chapter-reader img"):each(function(i, s)
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
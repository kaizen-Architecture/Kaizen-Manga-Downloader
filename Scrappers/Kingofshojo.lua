--------------------------------------
-- @name Kingofshojo
-- @url https://kingofshojo.com
-- @author Kilo Code
-- @license MIT
--------------------------------------

----- IMPORTS -----
Html = require("html")
Http = require("http")
HttpUtil = require("http_util")
Strings = require("strings")
--- END IMPORTS ---

----- VARIABLES -----
Client = Http.client()
Base = "https://kingofshojo.com"
--- END VARIABLES ---

----- MAIN -----

--- Searches for manga with given query.
-- @param query Query to search for
-- @return Table of tables with the following fields: name, url
function SearchManga(query)
    local url = Base .. "/?s=" .. HttpUtil.query_escape(query)
    local request = Http.request("GET", url)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local mangas = {}
    -- Primary selector: search results in .listupd
    doc:find(".listupd .bs .bsx a"):each(function(i, el)
        local title = el:find(".bigor .tt"):first()
        if title then
            local href = el:attr("href")
            if href and not href:find("http") then href = Base .. href end
            mangas[i+1] = {
                name = title:text():gsub("^%s*(.-)%s*$", "%1"),
                url = href
            }
        end
    end)

    -- If no results found, try alternative selector
    if #mangas == 0 then
        doc:find(".serieslist .listupd .bs .bsx a.series"):each(function(i, el)
            local title = el:find(".bigor .tt"):first()
            if title then
                local href = el:attr("href")
                if href and not href:find("http") then href = Base .. href end
                mangas[i+1] = {
                    name = title:text():gsub("^%s*(.-)%s*$", "%1"),
                    url = href
                }
            end
        end)
    end

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
    -- Primary selector: chapter list
    doc:find("#chapterlist ul li a"):each(function(i, el)
        local chapter_num = el:find(".chapternum"):first()
        if chapter_num then
            local href = el:attr("href")
            if href and not href:find("http") then href = Base .. href end
            chapters[i+1] = {
                name = chapter_num:text():gsub("^%s*(.-)%s*$", "%1"),
                url = href
            }
        end
    end)

    -- Reverse to get oldest first (newest are shown first on site)
    if #chapters > 0 then
        local n = #chapters
        for i = 1, math.floor(n / 2) do
            chapters[i], chapters[n - i + 1] = chapters[n - i + 1], chapters[i]
        end
    end

    return chapters
end

--- Gets the list of all pages of a chapter.
-- @param chapterURL URL of the chapter
-- @return Table of tables with the following fields: url, index
function ChapterPages(chapterURL)
    local request = Http.request("GET", chapterURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)

    local pages = {}
    -- Primary selector: images in reader area
    doc:find("#readerarea img"):each(function(i, img)
        local src = img:attr("src")
        if src and src ~= "" then
            -- Ensure full URL
            if not src:find("http") then
                if src:sub(1,2) == "//" then
                    src = "https:" .. src
                elseif src:sub(1,1) == "/" then
                    src = Base .. src
                else
                    src = Base .. "/" .. src
                end
            end
            pages[i+1] = {
                index = i+1,
                url = src
            }
        end
    end)

    return pages
end

--- END MAIN ---

----- HELPERS -----
--- END HELPERS ---
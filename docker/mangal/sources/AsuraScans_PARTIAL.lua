--------------------------------------
-- @name    AsuraScans
-- @url     https://www.asurascans.com/
-- @author  mpiva
-- @license MIT
--------------------------------------

Html = require("html")
Http = require("http")
HttpUtil = require("http_util")
Time = require("time")

Client = Http.client()
Base = "https://www.asurascans.com"
Delay = 2 -- segundos entre requests

----- SEARCH MANGA -----
function SearchManga(query)
    query = query:gsub("'", "")
    local url = Base .. "/?s=" .. HttpUtil.query_escape(query)
    local request = Http.request("GET", url)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)
    local mangas = {}

    -- Lista de resultados
    doc:find("div.bs"):each(function(i, div)
        local a = div:find("a"):first()
        local title = div:find("h3"):first()
        if a and title then
            table.insert(mangas, {
                name = trim(title:text()),
                url = a:attr("href")
            })
        end
    end)
    return mangas
end

----- GET CHAPTERS -----
function MangaChapters(mangaURL)
    local request = Http.request("GET", mangaURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)
    local chapters = {}

    doc:find("ul.main li.wp-manga-chapter a"):each(function(i, a)
        table.insert(chapters, {
            name = trim(a:text()),
            url = a:attr("href")
        })
    end)

    Reverse(chapters)
    return chapters
end

----- GET PAGES -----
function ChapterPages(chapterURL)
    local request = Http.request("GET", chapterURL)
    local result = Client:do_request(request)
    local doc = Html.parse(result.body)
    local pages = {}

    doc:find("div.reading-content img"):each(function(i, img)
        local src = img:attr("data-src") or img:attr("src")
        if src then
            table.insert(pages, { index = i+1, url = src:gsub("[\n\r\t]", "") })
        end
    end)

    return pages
end

----- HELPERS -----
function trim(s)
    return (string.gsub(s, "^%s*(.-)%s*$", "%1"))
end

function Reverse(t)
    local n = #t
    local i = 1
    while i < n do
        t[i], t[n] = t[n], t[i]
        i = i + 1
        n = n - 1
    end
end

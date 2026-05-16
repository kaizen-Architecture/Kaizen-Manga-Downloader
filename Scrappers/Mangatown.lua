---------------------------------
-- @name    Mangatown
-- @url     https://www.mangatown.com
-- @author  Kilo Code
-- @license MIT
---------------------------------

----- IMPORTS -----
Http = require("http")
HttpUtil = require("http_util")
Strings = require("strings")
Html = require("html")

--- END IMPORTS ---

----- VARIABLES -----
Client = Http.client()
Base = "https://www.mangatown.com"
--- END VARIABLES ---

----- LOCAL FUNCTIONS -----
local function Reverse(t)
    local n = #t
    local i = 1
    while i < n do
        t[i], t[n] = t[n], t[i]
        i = i + 1
        n = n - 1
    end
end
--- END LOCAL FUNCTIONS ---

----- MAIN -----

--- Searches for manga with given query.
-- @param query Query to search for
-- @return Table of mangas
function SearchManga(query)
	local url = Base .. "/search?name=" .. HttpUtil.query_escape(query)
	local request = Http.request("GET", url)
	local result = Client:do_request(request)
	if not result or not result.body then return {} end
	local doc = Html.parse(result.body)

	local mangas = {}

	-- Primary selector: manga_pic_list li
	doc:find("ul.manga_pic_list li"):each(function(i, el)
		local manga = {}

		-- Extract title from p.title a
		local title_link = el:find("p.title a"):first()
		if title_link then
			local text = title_link:text()
			if text and text ~= "" then
				manga.name = text:gsub("^%s*(.-)%s*$", "%1")
				local href = title_link:attr("href")
				if href then
					manga.url = href:match("^/") and Base .. href or href
				end
			else
				return
			end
		else
			return
		end

		-- Skip if no name or url
		if not manga.name or not manga.url then
			return
		end

		-- Extract author from p.view containing "Author:"
		el:find("p.view"):each(function(j, p)
			local text = p:text()
			if text and text:find("Author:") then
				local author_link = p:find("a.color_0077"):first()
				if author_link then
					local author_text = author_link:text()
					if author_text and author_text ~= "" then
						manga.author = author_text:gsub("^%s*(.-)%s*$", "%1")
					end
				end
			end
		end)

		-- Extract genres from p.keyWord
		local genre_elem = el:find("p.keyWord"):first()
		if genre_elem then
			local genres = {}
			genre_elem:find("a"):each(function(j, a)
				local genre_text = a:text()
				if genre_text and genre_text ~= "" then
					table.insert(genres, #genres + 1, genre_text:gsub("^%s*(.-)%s*$", "%1"))
				end
			end)
			if #genres > 0 then
				manga.genres = table.concat(genres, ",")
			end
		end

		-- Add manga to results
		table.insert(mangas, manga)
	end)

	return mangas
end

--- Gets the list of all manga chapters.
-- @param mangaURL URL of the manga
-- @return Table of chapters
function MangaChapters(mangaURL)
	local request = Http.request("GET", mangaURL)
	local result = Client:do_request(request)
	if not result or not result.body then return {} end
	local doc = Html.parse(result.body)

	local chapters = {}

	-- Primary selector: ul.chapter_list li a
	doc:find("ul.chapter_list li a"):each(function(i, el)
		local chapter = {}
		local text = el:text()
		if text and text ~= "" then
			chapter.name = text:gsub("^%s*(.-)%s*$", "%1")
		end
		local href = el:attr("href")
		if href then
			chapter.url = href:match("^/") and Base .. href or href
		end
		if chapter.name and chapter.url then
			table.insert(chapters, chapter)
		end
	end)

	Reverse(chapters)
	return chapters
end

--- Gets the list of all pages of a chapter.
-- @param chapterURL URL of the chapter
-- @return Table of pages
function ChapterPages(chapterURL)
	local request = Http.request("GET", chapterURL)
	local result = Client:do_request(request)
	if not result or not result.body then return {} end
	local doc = Html.parse(result.body)

	local pages = {}

	-- Primary selector: img.image (main manga image)
	doc:find("img.image"):each(function(i, img)
		local src = img:attr("src")
		if src and not src:find("logo") and not src:find("loading") then
			table.insert(pages, {
				index = #pages + 1,
				url = src:match("^//") and "https:" .. src or src:match("^/") and Base .. src or src
			})
		end
	end)

	return pages
end
---------------------------------
-- @name    RizzComic
-- @url     https://rizzcomic.com
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
Base = "https://rizzcomic.com"
--- END VARIABLES ---

----- LOCAL FUNCTIONS -----
--- END LOCAL FUNCTIONS ---

----- MAIN -----

--- Searches for manga with given query.
-- @param query Query to search for
-- @return Table of mangas
function SearchManga(query)
	local url = Base .. "/?s=" .. HttpUtil.query_escape(query)
	local request = Http.request("GET", url)
	local result = Client:do_request(request)
	if not result or not result.body then return {} end
	local doc = Html.parse(result.body)

	local mangas = {}

	doc:find(".bs .bsx a"):each(function(i, el)
		local manga = {}
		local name = el:find(".tt"):text()
		local url = el:attr("href")
		if name and url then
			manga.name = name:gsub("^%s*(.-)%s*$", "%1")
			manga.url = url:match("^/") and Base .. url or url
			table.insert(mangas, manga)
		end
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

	doc:find(".bxcl ul li"):each(function(i, el)
		local a = el:find(".eph-num a")
		if a then
			local title = a:find(".chapternum"):text()
			local url = a:attr("href")
			if title and url then
				local chapter = {}
				chapter.name = title:gsub("^%s*(.-)%s*$", "%1")
				chapter.url = url:match("^/") and Base .. url or url
				table.insert(chapters, chapter)
			end
		end
	end)

	return chapters
end

--- Gets the list of all pages of a chapter.
-- @param chapterURL URL of the chapter
-- @return Table of pages
function ChapterPages(chapterURL)
	local request = Http.request("GET", chapterURL)
	local result = Client:do_request(request)
	if not result or not result.body then return {} end

	-- Parse the script containing images
	local images = {}
	for img in result.body:gmatch('"images":%[(.-)%]') do
		for url in img:gmatch('"([^"]+)"') do
			table.insert(images, {
				index = #images + 1,
				url = url:match("^//") and "https:" .. url or url:match("^/") and Base .. url or url
			})
		end
	end

	return images
end